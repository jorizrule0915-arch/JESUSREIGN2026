// Serves the Apps Script Web App URL from the SCRIPT_URL environment variable.
// The URL is public anyway (browsers call it directly); the admin key protects the data.
module.exports = (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.status(200).send(JSON.stringify({ scriptUrl: (process.env.SCRIPT_URL || "").trim() }));
};
