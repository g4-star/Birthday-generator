const { put, del } = require("@vercel/blob");
const { randomUUID } = require("node:crypto");

const CHUNK_BYTES = 2 * 1024 * 1024;
const MAX_BYTES = {
  photo: 3 * 1024 * 1024,
  music: 10 * 1024 * 1024
};

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "audio/mpeg",
  "audio/mp4",
  "audio/ogg",
  "audio/wav",
  "audio/webm"
]);

const EXTENSIONS = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "audio/mpeg": "mp3",
  "audio/mp4": "m4a",
  "audio/ogg": "ogg",
  "audio/wav": "wav",
  "audio/webm": "webm"
};

function send(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(data));
}

function validKindType(kind, contentType) {
  if (!["photo", "music"].includes(kind)) return false;
  if (!ALLOWED_TYPES.has(contentType)) return false;
  if (kind === "photo" && !contentType.startsWith("image/")) return false;
  if (kind === "music" && !contentType.startsWith("audio/")) return false;
  return true;
}

function validSessionId(id) {
  return typeof id === "string" &&
    /^[0-9a-f-]{36}$/i.test(id);
}

function validChunkUrl(value, sessionId) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" &&
      url.hostname.endsWith(".blob.vercel-storage.com") &&
      url.pathname.startsWith(`/birthday-temp/${sessionId}/`);
  } catch {
    return false;
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return send(res, 405, { error: "Use POST to upload a file." });
  }

  try {
    const body = req.body || {};
    const { action, kind, contentType, sessionId } = body;

    if (!validKindType(kind, contentType)) {
      return send(res, 400, {
        error: "This file type is not supported."
      });
    }

    if (!validSessionId(sessionId)) {
      return send(res, 400, { error: "Invalid upload session." });
    }

    if (action === "chunk") {
      const { data, chunkIndex, chunkCount } = body;

      if (
        !Number.isInteger(chunkIndex) ||
        !Number.isInteger(chunkCount) ||
        chunkCount < 1 ||
        chunkCount > 5 ||
        chunkIndex < 0 ||
        chunkIndex >= chunkCount
      ) {
        return send(res, 400, { error: "Invalid upload chunk." });
      }

      if (
        typeof data !== "string" ||
        !data ||
        data.length > 2_800_000
      ) {
        return send(res, 413, { error: "Upload chunk is too large." });
      }

      const buffer = Buffer.from(data, "base64");

      if (!buffer.length || buffer.length > CHUNK_BYTES) {
        return send(res, 413, { error: "Upload chunk is too large." });
      }

      const blob = await put(
        `birthday-temp/${sessionId}/${chunkIndex}-${randomUUID()}.bin`,
        buffer,
        {
          access: "public",
          contentType: "application/octet-stream",
          addRandomSuffix: true
        }
      );

      return send(res, 200, { url: blob.url });
    }

    if (action === "finalize") {
      const { chunkUrls } = body;
      const maxBytes = MAX_BYTES[kind];

      if (
        !Array.isArray(chunkUrls) ||
        chunkUrls.length < 1 ||
        chunkUrls.length > 5 ||
        !chunkUrls.every(url => validChunkUrl(url, sessionId))
      ) {
        return send(res, 400, { error: "Invalid upload chunks." });
      }

      const parts = [];
      let totalBytes = 0;

      try {
        for (const url of chunkUrls) {
          const response = await fetch(url);

          if (!response.ok) {
            throw new Error("Could not retrieve an upload chunk.");
          }

          const part = Buffer.from(await response.arrayBuffer());
          totalBytes += part.length;

          if (totalBytes > maxBytes) {
            return send(res, 413, {
              error: kind === "music"
                ? "Songs cannot exceed 10 MB."
                : "Photos cannot exceed 3 MB."
            });
          }

          parts.push(part);
        }

        if (!totalBytes) {
          return send(res, 400, { error: "The uploaded file is empty." });
        }

        const buffer = Buffer.concat(parts);
        const extension = EXTENSIONS[contentType];

        const blob = await put(
          `birthday-${kind}/${randomUUID()}.${extension}`,
          buffer,
          {
            access: "public",
            contentType,
            addRandomSuffix: true
          }
        );

        return send(res, 200, { url: blob.url });
      } finally {
        await del(chunkUrls).catch(error => {
          console.error("Temporary upload cleanup failed:", error.message);
        });
      }
    }

    return send(res, 400, { error: "Invalid upload action." });
  } catch (error) {
    console.error("Birthday media upload failed:", error.message);
    return send(res, 500, {
      error: "Upload failed. Please try again."
    });
  }
};

module.exports.config = {
  api: {
    bodyParser: {
      sizeLimit: "3mb"
    }
  }
};
