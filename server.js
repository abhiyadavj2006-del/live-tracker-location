const { tunnel: cloudflaredTunnel } = require("cloudflared")
const cookieParser = require("cookie-parser")
const socketIO = require("socket.io")
const config = require("./config")
const express = require("express")
const tarkine = require("tarkine")
const http = require('http')

const app = express()
const server = http.createServer(app)
const io = new socketIO.Server(server)
const PORT = process.env.PORT || config.port
let remoteURL = null
app.set("remoteURL", null) // Home page reads the tunnel URL from app settings, not a global.

app.set("io", io) // router.js reads the Socket.IO server from app settings, not a global.

app.set("view engine", "html")
app.engine("html", tarkine.renderFile)
app.set("views", __dirname);
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(__dirname + "/public"))

// Legacy alias for the old /weather.png reference (weather.html now uses an inline SVG data URI for its icon).
// Serves a 1x1 transparent PNG so /weather.png no longer 404s.
app.get("/weather.png", (req, res) => {
    res.type("png").send(Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAwMCAO+ip1sAAAAASUVORK5CYII=", "base64"))
})
app.use(express.json())

app.use("/", require("./router"))

server.listen(PORT, async () => {
    const localURL = `http://localhost:${PORT}`
    try {
        remoteURL = await cloudflaredTunnel({
            "--url": localURL
        }).url
        app.set("remoteURL", remoteURL)
    } catch (error) {
        console.warn("Remote tunnel unavailable - the app still works locally:", error.message)
    }

    console.log(`LOCAL  : ${localURL}`)
    console.log(`REMOTE : ${remoteURL || "not available"}`)
})