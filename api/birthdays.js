const { neon } = require("@neondatabase/serverless");
const { randomBytes } = require("node:crypto");

const allowedThemes = new Set([
  "party", "elegant", "hacker", "pastel", "galaxy",
  "royal", "neon", "floral", "ocean", "sunset",
  "midnight", "candy", "minimal", "retro", "luxury",
  "tropical", "dreamy", "gold", "anime", "romantic",
  "cyberpunk", "confetti", "lavender", "emerald", "cosmic"
]);

function send(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(data));
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return send(res, 405, { error: "Use POST to create a birthday page." });
  }

  if (!process.env.DATABASE_URL) {
    return send(res, 500, { error: "The database is not configured yet." });
  }

  try {
    const body = req.body || {};
    const nameValue = body.recipient_name ?? body.name;
    const name = typeof nameValue === "string" ? nameValue.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const senderValue = body.sender_name ?? body.sender;
    const sender = typeof senderValue === "string" ? senderValue.trim() : "";
    const themeInput = typeof body.theme === "string" ? body.theme : "party";
    const theme = allowedThemes.has(themeInput) ? themeInput : "party";
    const ageInput = body.age;
    const age = ageInput === "" || ageInput == null ? null : Number(ageInput);

    if (!name || name.length > 100) {
      return send(res, 400, { error: "Enter a recipient name (maximum 100 characters)." });
    }

    if (!message || message.length > 5000) {
      return send(res, 400, { error: "Enter a message of up to 5,000 characters." });
    }

    if (sender.length > 100) {
      return send(res, 400, { error: "Sender name must be 100 characters or fewer." });
    }

    if (age !== null && (!Number.isInteger(age) || age < 0 || age > 150)) {
      return send(res, 400, { error: "Age must be a whole number from 0 to 150." });
    }

    const photoValue = body.photo_url ?? body.photoUrl;
    const photoUrl = typeof photoValue === "string" ? photoValue : null;
    const musicValue = body.music_url ?? body.musicUrl;
    const musicUrl = typeof musicValue === "string" ? musicValue : null;

    for (const [label, value] of [["Photo", photoUrl], ["Music", musicUrl]]) {
      if (value && (value.length > 2000 || !/^https:\/\//i.test(value))) {
        return send(res, 400, { error: `${label} URL must be a valid HTTPS URL.` });
      }
    }

    const id = randomBytes(9).toString("base64url");
    const sql = neon(process.env.DATABASE_URL);

    await sql`
      INSERT INTO birthdays
        (id, recipient_name, age, message, sender_name, theme, photo_url, music_url)
      VALUES
        (${id}, ${name}, ${age}, ${message}, ${sender || null},
         ${theme}, ${photoUrl}, ${musicUrl})
    `;

    const forwardedProto = req.headers["x-forwarded-proto"];
    const proto = forwardedProto === "https" ? "https" : "https";
    const host = req.headers["x-forwarded-host"] || req.headers.host;

    if (!host) {
      return send(res, 201, { id, message: "Birthday page saved." });
    }

    return send(res, 201, {
      id,
      url: `${proto}://${host}/b/${id}`
    });
  } catch (error) {
    console.error("Birthday creation failed:", error.message);
    return send(res, 500, { error: "Could not save the birthday page. Check your database configuration." });
  }
};
