import * as Notifications from "expo-notifications";
import axios from "axios"; // 이메일 전송을 위한 axios

async function requestNotificationPermission() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status;
}

async function sendEmail() {
  // 여기에 이메일 전송 로직을 구현합니다.
  // 예: axios.post('your-email-api-endpoint', { /* 이메일 데이터 */ });
}

async function sendNotification() {
  // 여기에 알림 전송 로직을 구현합니다.
  // 예: Notifications.scheduleNotificationAsync({ /* 알림 데이터 */ });
}

async function handleNotificationPermission() {
  const permissionStatus = await requestNotificationPermission();

  if (permissionStatus === "granted") {
    await sendNotification();
  } else {
    await sendEmail();
  }
}

// 함수 호출
handleNotificationPermission();
