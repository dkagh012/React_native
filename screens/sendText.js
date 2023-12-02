const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

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

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
