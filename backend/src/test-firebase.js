const admin = require("firebase-admin");
const path = require("path");

// Load service account
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "webdevexample-e8eee.firebasestorage.app",
});

const bucket = admin.storage().bucket();
console.log("Bucket:", bucket.name);

async function testConnection() {
  try {
    console.log("Bucket name:", bucket.name);
    console.log("Bucket name:", bucket);

    const [files] = await bucket.getFiles({ maxResults: 2 });

    console.log("Connection successful ✅");
    console.log("Sample files:", files.map(f => f.name));
  } catch (error) {
    console.error("Error connecting ❌", error);
  }
}


async function getImageUrl() {
  try {
    const [files] = await bucket.getFiles({ maxResults: 2 });
    const file = bucket.file(files[1].name);

    const [url] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 1000 * 60 * 60 // 1 hour
    });

    console.log("Signed URL:");
    console.log(url);

  } catch (err) {
    console.error(err);
  }
}

async function uploadImage() {
  try {
    const filePath = "./src/test_image.png"; // local file
    const destination = "test-image.png"; // path inside bucket

    await bucket.upload(filePath, {
      destination: destination,
    });

    console.log("Upload successful ✅");
  } catch (err) {
    console.error("Upload failed ❌", err);
  }
}

const mysql = require("mysql2");
// create connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456789",
  database: "my_app_db"
});


// connect
db.connect(err => {
  if (err) {
    console.error("Connection error:", err);
  } else {
    console.log("Connected to MySQL");
  }
});


const sql = "INSERT INTO posts (content, caption, likes, retweets) VALUES (?, ?, ?, ?, ?)";

const values = ['image_2026-03-12_164954544.png', 'picture', 2, 2];

db.query(sql, values, (err, result) => {
  if (err) {
    console.error("Insert error:", err);
  } else {
    console.log("User added, ID:", result.insertId);
  }
});
//testConnection();
//getImageUrl();
//uploadImage();