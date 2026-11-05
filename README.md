# Live Location Tracker
- **Live Location Tracker** It allows you to track live GPS coordinates in real-time and provides visual representations on a map, making it a great tool for showcasing in seminars, educational environments, and ethical hacking demonstrations.


## Prerequisites
To get this application up and running, ensure you have the following:
- **Node.js** (v16 or higher)

## Installation
1. **Clone the repository**:
```bash
git clone https://github.com/abhiyadavj2006-del/live-tracker-location.git
cd live-tracker-location
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set your login credentials and run the application:**
```bash
export TRACKER_USERNAME=admin
export TRACKER_PASSWORD=<choose-a-strong-password>
export TRACKER_TOKEN=<a-new-random-token>  # optional; a random token is generated per run if unset
npm start
```

> Note: this is a Node.js + Socket.io app. Run it locally with `npm start`; it cannot run on static hosting (such as GitHub Pages). Log in with the TRACKER_USERNAME and TRACKER_PASSWORD you set in step 3.