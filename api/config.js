// Serves the Apps Script Web App URL from the SCRIPT_URL environment variable.
// Only an Apps Script /exec URL is ever returned, so a mistyped value (e.g. a password) is never exposed.
module.exports = (req, res) => {
  const v = (process.env.SCRIPT_URL || "").trim();
  const ok = /^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(v);
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.status(200).send(JSON.stringify({ scriptUrl: ok ? v : "" }));
};
