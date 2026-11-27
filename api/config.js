// Serves the Apps Script Web App URL from the SCRIPT_URL environment variable set in Vercel.
module.exports = (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({ scriptUrl: (process.env.SCRIPT_URL || "").trim() });
};
