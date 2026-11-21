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
app.set("remoteURL", null) // No tunnel is used: the platform serves the app directly. Home page reads the URL from app settings, not a global.

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

server.listen(PORT, () => {
    const localURL = `http://localhost:${PORT}`

    console.log(`LOCAL  : ${localURL}`)
})
