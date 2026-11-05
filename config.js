// Live Location Tracker config.
// SECURITY: do not put real credentials or tokens in this file — this repo is public.
// Set them as environment variables when you run the server, e.g.:
//   TRACKER_USERNAME=admin TRACKER_PASSWORD=<a-strong-password> TRACKER_TOKEN=<a-new-random-token> node server.js
// Generate a new token with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
// The old token/password that was committed here must be treated as public and changed.
const crypto = require("crypto")

// No hard-coded default password: the login password must come from TRACKER_PASSWORD.
if (!process.env.TRACKER_PASSWORD) {
    console.error("config: TRACKER_PASSWORD is not set - login will not work until it is set.")
}
if (!process.env.TRACKER_TOKEN) {
    console.warn("config: TRACKER_TOKEN is not set - using a random token generated for this run only (logins end when the server restarts).")
}

module.exports = {
    port: process.env.PORT || 6589,
    username: process.env.TRACKER_USERNAME || "admin",
    password: process.env.TRACKER_PASSWORD,
    token: process.env.TRACKER_TOKEN || crypto.randomBytes(32).toString("hex")
}
