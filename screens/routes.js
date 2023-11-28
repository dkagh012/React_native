const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");

const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "test",
});

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
  // 요청된 username과 password를 가져옵니다.
  const { username, password } = req.body;

  // 데이터베이스에 대한 쿼리 실행
  connection.query(
    "SELECT * FROM member WHERE username = ? AND password = ?",
    [username, password],
    function (error, results, fields) {
      if (error) {
        // 서버 오류 처리
        res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      } else {
        if (results.length > 0) {
          // 로그인 성공
          res.json({ success: true, message: "Login successful" });
        } else {
          // 잘못된 사용자 이름 또는 비밀번호
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
