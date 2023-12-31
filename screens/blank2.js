import { useState, useEffect, useRef } from "react";
import { Text, View, Button } from "react-native";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import messaging from "@react-native-firebase/messaging";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function sendPushNotification(fcmToken) {
  // const message = {
  //   to: fcmToken,
  //   sound: "default",
  //   title: "Original Title",
  //   body: "And here is the body!",
  //   data: { someData: "goes here" },
  // };

  await fetch("https://fcm.googleapis.com/fcm/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `key=AAAAU3xvVd0:APA91bFCBp67yPFpCdgJJvMhnf3wQi59B6CzKb4odZqwv6jqNsZZEyGMCtmHA3JPpN54__KCNyeU3x8xYRvBbuzJT1BD5hQIVkdONSDuyYHuq061WYE_NdZvHCXEHDKNQPwk5lzja4Hj`, // Replace with your Firebase server key
    },
    body: JSON.stringify({
      to: fcmToken,
      notification: {
        title: "Original Title",
        body: "And here is the body!",
      },
      data: {
        someData: "goes here",
      },
    }),
  });
}

async function registerForPushNotificationsAsync() {
  let fcmToken;

  // 권한 확인
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;

  // 권한이 없는 경우 권한 요청
  if (existingStatus !== "granted") {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    alert("Failed to get push token for push notification!");
    return;
  }

  // FCM 토큰 가져오기
  fcmToken = await messaging().getToken();
  console.log("FCM Token:", fcmToken);

  return fcmToken;
}

export default function App() {
  const [fcmToken, setFcmToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => setFcmToken(token));

    // Expo 앱에서 FCM 토큰 변경 시
    const unsubscribeOnTokenRefresh = messaging().onTokenRefresh((newToken) => {
      console.log("Refreshed FCM Token:", newToken);
      setFcmToken(newToken);
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      unsubscribeOnTokenRefresh();
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <View
      style={{ flex: 1, alignItems: "center", justifyContent: "space-around" }}
    >
      <Text>Your FCM token: {fcmToken}</Text>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Text>
          Title: {notification && notification.request.content.title}{" "}
        </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>
          Data:{" "}
          {notification && JSON.stringify(notification.request.content.data)}
        </Text>
      </View>
      <Button
        title="Press to Send Notification"
        onPress={async () => {
          await sendPushNotification(fcmToken);
        }}
      />
    </View>
  );
}
