const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");
const axios = require("axios");

app.post("/send-notification", async (req, res) => {
  const { token, title, body } = req.body;

  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "토큰이 필요합니다." });
  }

  try {
    const response = await axios.post("https://exp.host/--/api/v2/push/send", {
      to: token,
      title: title,
      body: body,
      sound: "default",
    });

    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error("알림 전송 중 오류 발생:", error);
    res.status(500).json({ success: false, message: "알림 전송 실패" });
  }
});
const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "test",
});

connection.getConnection(function (err, connection) {
  if (err) {
    console.error("데이터베이스 연결 실패:", err);
  } else {
    console.log("데이터베이스에 성공적으로 연결됨.");
  }
});

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

app.listen(3000, () => {
  console.log("Go to http://localhost:3000/users so you can see the data.");
});
