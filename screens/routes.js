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

// 추가: 푸시 알림 보내기 엔드포인트
app.post("/send-push-notification", async (req, res) => {
  const { expoPushToken } = req.body;

  if (!expoPushToken) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid expoPushToken" });
  }

  try {
    await sendPushNotification(expoPushToken);
    res.json({ success: true, message: "Push notification sent successfully" });
  } catch (error) {
    console.error("Error sending push notification:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// 추가: 푸시 알림 보내기 함수
const sendPushNotification = async (expoPushToken) => {
  const expoPushEndpoint = "https://exp.host/--/api/v2/push/send";

  try {
    const response = await axios.post(expoPushEndpoint, {
      to: expoPushToken,
      sound: "default",
      title: "푸시 알림",
      body: "안녕하세요, Expo 푸시 알림 예제에서 보낸 메시지입니다!",
    });

    console.log("푸시 알림 전송 결과:", response.data);
  } catch (error) {
    console.error("푸시 알림 전송 중 오류 발생:", error);
    throw error; // 에러를 호출자에게 다시 던집니다.
  }
};

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
