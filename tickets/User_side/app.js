//app.js
//importing necessary modules and files
const express = require("express");
const path = require("path");
const ticketRoutes = require("./routes/ticketRoutes");
const userRoutes = require("./routes/userRoutes");
const bodyParser = require("body-parser");
const session = require("express-session");
const { generateCaptcha, verifyCaptcha } = require("./utils/captcha");
const app = express();
const multer = require("multer");
const ticketController = require("./controllers/ticketController");
const db = require('./db')
const captchaController = require("./utils/captcha"); // Make sure the path is correct

// Session middleware must be mounted first
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { 
      secure: false,
    }
  })
);

// Then mount other middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const upload = multer({ dest: "uploads/" });

// Mount routes
app.use('/', userRoutes);
app.use('/', ticketRoutes);

// Define the index.html route
app.get("/index.html", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

// Define the new-ticket route
app.get("/new-ticket", (req, res) => {
    if (!req.session.email) {
        return res.redirect('/');
    }
    res.render('index2', { 
        fullName: req.session.fullName || '',
        telephone: req.session.telephone || ''
    });
});

// Generate CAPTCHA
app.get("/captcha", generateCaptcha);

// Use verifyCaptcha middleware for ticket creation
app.post(
  "/create-ticket",
  upload.single("attachment"),
  (req, res, next) => {
    console.log("=== CAPTCHA VERIFICATION MIDDLEWARE ===");
    console.log("Session ID:", req.sessionID);
    console.log("Session captcha:", req.session.captcha);
    console.log("Request body:", req.body);
    verifyCaptcha(req, res, next);
  },
  ticketController.createTicket
);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});