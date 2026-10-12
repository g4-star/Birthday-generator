const { neon } = require("@neondatabase/serverless");

function send(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(data));
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return send(res, 405, { error: "Use GET to retrieve a birthday page." });
  }

  const id = typeof req.query?.id === "string" ? req.query.id : "";

  if (!/^[A-Za-z0-9_-]{12}$/.test(id)) {
    return send(res, 400, { error: "Invalid birthday link." });
  }

  if (!process.env.DATABASE_URL) {
    return send(res, 500, { error: "The database is not configured yet." });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    const rows = await sql`
      SELECT id, recipient_name, age, message, sender_name,
             theme, photo_url, music_url, created_at
      FROM birthdays
      WHERE id = ${id}
      LIMIT 1
    `;

    if (!rows.length) {
      return send(res, 404, { error: "This birthday page was not found." });
    }

    return send(res, 200, { birthday: rows[0] });
  } catch (error) {
    console.error("Birthday lookup failed:", error.message);
    return send(res, 500, { error: "Could not load this birthday page." });
  }
};
