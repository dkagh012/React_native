import React, { useState, useEffect, useRef } from "react";
import { Text, View, Button, Platform, PermissionsAndroid } from "react-native";
import * as Notifications from "expo-notifications";
import messaging from "@react-native-firebase/messaging";
import "@react-native-firebase/app";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function sendPushNotification(expoPushToken) {
  const pushToken = (await Notifications.getDevicePushTokenAsync()).data;
  console.log(expoPushToken);
  console.log(pushToken);

  try {
    const response = await fetch("https://fcm.googleapis.com/fcm/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `key= AAAAU3xvVd0:APA91bFCBp67yPFpCdgJJvMhnf3wQi59B6CzKb4odZqwv6jqNsZZEyGMCtmHA3JPpN54__KCNyeU3x8xYRvBbuzJT1BD5hQIVkdONSDuyYHuq061WYE_NdZvHCXEHDKNQPwk5lzja4Hj`, // Replace with your Firebase server key
      },
      body: JSON.stringify({
        to: expoPushToken, // Use expoPushToken here
        notification: {
          title: "Original Title",
          body: "And here is the body!",
        },
        data: {
          someData: "goes here",
        },
      }),
    });
    console.log("FCM Server Response Status:", response.status);

    // Additional tasks based on the server response can be performed here
  } catch (error) {
    console.error("Error sending push notification:", error);
  }
}

async function registerForPushNotificationsAsync() {
  let fcmToken;
  try {
    let status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );

    if (status !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }

    if (Platform.OS === "ios") {
      await messaging().registerDeviceForRemoteMessages();
    }

    fcmToken = (await messaging().getToken()) || "";
  } catch (error) {
    console.error("Error getting push token:", error);
  }

  return fcmToken;
}

export default function BlankScreen3() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    const onNotificationReceived = (notification) => {
      setNotification(notification);
      // Handle foreground notifications here
    };

    notificationListener.current =
      Notifications.addNotificationReceivedListener(onNotificationReceived);

    const onNotificationResponseReceived = (response) => {
      console.log(response);
      // Handle notification response here
    };

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(
        onNotificationResponseReceived
      );

    return () => {
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
      <Text>Your expo push token: {expoPushToken}</Text>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Text>
          테스트: {notification?.request?.content?.title || "No title"}{" "}
        </Text>
        <Text>Body: {notification?.request?.content?.body || "No body"}</Text>
        <Text>
          Data:{" "}
          {notification?.request?.content?.data
            ? JSON.stringify(notification.request.content.data)
            : "No data"}
        </Text>
      </View>
      <Button
        title="Press to Send Notification"
        onPress={async () => {
          await sendPushNotification(expoPushToken);
        }}
      />
    </View>
  );
}
