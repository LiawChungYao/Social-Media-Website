require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Media Storage Init
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "webdevexample-e8eee.firebasestorage.app",
});

const bucket = admin.storage().bucket();

// Database Init
const mysql = require("mysql2");
const { randomInt } = require("crypto");
const { userInfo } = require("os");
// Credentials
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456789",
  database: "my_app_db"
});


db.connect(err => {
  if (err) {
    console.error("Connection error: ", err);
  } else {
    console.log("Connected to MySQL");
  }
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API is running " });
});

const upload = multer({ dest: "uploads/" });
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;
    const filename = Date.now() + "_" + randomInt(100);
    const destination = `images/${filename}`;

    // Upload to Firebase
    await bucket.upload(file.path, {
      destination: destination,
      metadata: {
        contentType: file.mimetype,
      },
    });

    console.log("Test");
    const firebaseFile = bucket.file(destination);
    // console.log("URL: " + url);
    // console.log("Firebase File: " + firebaseFile);

    // Remove Multer File
    const fs = require("fs");
    fs.unlinkSync(file.path);

    // Save data to database
    const sql = "INSERT INTO posts (content, caption, likes, retweets) VALUES (?, ?, ?, ?)";

    const values = [filename, 'picture', 0, 0];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Insert error:", err);
      } else {
        console.log("Post added, ID:", result.insertId);
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/register", async (req, res) => {
  console.log("Reached backend");
  console.log(req.body);
  var userInfo = req.body;
  const sql = "INSERT INTO users (username, password, email, created_at) VALUES (?, ?, ?, NOW())";

  const hashed = await bcrypt.hash(userInfo.password, 10);


  const values = [userInfo.username, hashed, userInfo.email];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Insert error:", err);
    } else {
      console.log("User added, ID:", result.insertId);
    }
  });
}

)


app.post("/login", async (req, res) => {
  console.log("Reached backend");
  console.log(req.body);
  const {username, password, keepSignedIn} = req.body;


  const sql = "SELECT * FROM users where username = ?";

  const values = [username];

  db.query(sql, values, async (err, result) => {
    if (err) {
      console.error("Insert error:", err);
    } else {
      if (result.length === 0){
        return res.status(401).json({error: "Invalid credentials"});
      }

      const user = result[0];
      
      const isMatch = await bcrypt.compare(password, user.password);

      if(!isMatch){
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign (
        { userId: user.id},
        process.env.JWT_SECRET,
        {
          expiresIn: keepSignedIn ? "7d" : "1h"
        }
      );
      console.log("Successful");
      res.json({ message: "Login successful", token });
    }
  });
}

)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});