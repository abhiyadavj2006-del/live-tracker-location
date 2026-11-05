// Copy to config.js for local use only — never commit a real config.js.
//   cp config.example.js config.js
// Then edit config.js with your own strong password and a new random token.
module.exports = {
    port: 6589,
    username: "admin",
    password: "change-me-to-a-strong-password",
    token: "change-me-generate-with-crypto-randomBytes-32"
}
