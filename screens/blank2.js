import { useState, useEffect, useRef } from "react";
import { Text, View, Button, Platform } from "react-native";
import Constants from "expo-constants"; // 추가된 부분
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
export default function BlankScreen2() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "space-around",
      }}
    >
      <Text>Your expo push token: {expoPushToken}</Text>
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
        title="Press to schedule a notification"
        onPress={async () => {
          await schedulePushNotification();
        }}
      />
    </View>
  );
}

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: "Here is the notification body",
      data: { data: "goes here" },
    },
    trigger: null,
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  // Android 13(API 레벨 33) 이상에서 POST_NOTIFICATIONS 권한 요청
  if (Platform.OS === "android" && Device.platformApiLevel >= 33) {
    const { status } = await Notifications.requestPermissionsAsync({
      android: { permissions: ["android.permission.POST_NOTIFICATIONS"] },
    });
    if (status !== "granted") {
      alert("Required notification permission not granted!");
      return;
    }
  }

  // 기존 Android 버전에 대한 처리
  if (Platform.OS === "android" && Device.platformApiLevel < 33) {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  // 기기 확인
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }

    // Expo 푸시 토큰 가져오기
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: "a6402589-1ecf-420a-8dde-cd9dcba52f38",
      })
    ).data;
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}
