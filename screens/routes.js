const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");
const axios = require("axios");
const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "test",
});

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));

connection.getConnection(function (err, connection) {
  if (err) {
    console.error("데이터베이스 연결 실패:", err);
  } else {
    console.log("데이터베이스에 성공적으로 연결됨.");
  }
});

// Your existing MySQL-related routes...
app.get("/users", function (req, res) {
  connection.getConnection(function (err, connection) {
    connection.query("SELECT * FROM member", function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    });
  });
});

app.get("/colors", function (req, res) {
  connection.getConnection(function (err, connection) {
    connection.query("SELECT * FROM color", function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    });
  });
});

app.post("/login", function (req, res) {
  const { username, password } = req.body;

  connection.query(
    "SELECT * FROM member WHERE username = ? AND password = ?",
    [username, password],
    function (error, results, fields) {
      if (error) {
        res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      } else {
        if (results.length > 0) {
          res.json({ success: true, message: "Login successful" });
        } else {
          res.status(401).json({
            success: false,
            message: "Incorrect username or password",
          });
        }
      }
    }
  );
});

// app.post("/UserToken", (req, res) => {
//   console.log(req.body);
//   res.status(200).json({ success: true });
//   const { expoPushToken } = JSON.parse(JSON.stringify(req.body));
//   connection.query(
//     "INSERT INTO Token (token) VALUES (?)",
//     [expoPushToken],
//     (error, results, fields) => {
//       if (error) {
//         res
//           .status(500)
//           .json({ success: false, message: "Internal Server Error" });
//       } else {
//         res.json({
//           success: true,
//           message: "Expo Push Token saved successfully",
//         });
//       }
//     }
//   );
// });
app.post("/UserToken", (req, res) => {
  console.log(req.body); // Log the request body for debugging

  // Extract the token from the request body
  const { token } = req.body;

  // Check if the token is not null or undefined
  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "Token is missing" });
  }

  connection.query(
    "INSERT INTO Token (token) VALUES (?)",
    [token],
    (error, results, fields) => {
      if (error) {
        console.error("Database error:", error);
        return res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
      res.json({
        success: true,
        message: "Expo Push Token saved successfully",
      });
    }
  );
});

app.post("/send-notification", async (req, res) => {
  try {
    const { to, title, body, sound } = req.body;

    const message = {
      to,
      sound,
      title,
      body,
    };

    const response = await axios.post(
      "https://exp.host/--/api/v2/push/send",
      JSON.stringify(message),
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    );

    console.log("Notification sent successfully:", response.data);
    res.send("Notification sent successfully");
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).send("Error sending notification");
  }
});

app.listen(3000, () => {
  console.log("Go to http://localhost:3000/users so you can see the data.");
});
