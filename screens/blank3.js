// Import necessary libraries
import { useEffect } from "react";
import { Alert, PermissionsAndroid, Platform, View, Text } from "react-native";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import navigation (assuming you have it set up)
import { useNavigation } from "@react-navigation/native";

// Popup 컴포넌트 정의
export default function Popup() {
  alert("test");
  // Get navigation object
  const navigation = useNavigation();

  // useEffect를 사용하여 컴포넌트가 처음 로드될 때 한 번만 실행
  useEffect(() => {
    // 알림 권한을 확인하는 함수
    const checkNotificationPermission = async () => {
      const isTokenIn = await AsyncStorage.getItem("isTokenIn");
      // if (isTokenIn === "true") {
      //   navigation.navigate("login");
      // } else {
      // Alert을 사용하여 간단한 팝업을 표시
      Alert.alert("테스트 알림", "당신은 멋진 개발자입니다.", [
        {
          text: "동의",
          onPress: async () => {
            console.log("동의");
            // 여기에 true에 해당하는 동작 추가
            // 권한 요청
            try {
              const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
              );

              if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("알림 권한이 승인되었습니다.");

                if (Platform.OS === "android" && Device.isDevice) {
                  const token = JSON.parse(
                    JSON.stringify(
                      await Notifications.getExpoPushTokenAsync({
                        projectId: Constants.expoConfig.extra.eas.projectId,
                      })
                    )
                  ).data;
                  console.log(token);
                  const exponentPushToken = token.replace(
                    /^ExponentPushToken\[(.*)\]$/,
                    "$1"
                  );
                  const payload = { token: `${exponentPushToken}` };

                  fetch("http://192.168.50.211:3000/UserToken", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                  })
                    .then((response) => response.json())
                    .then((data) => {
                      AsyncStorage.setItem("isTokenIn", "true");
                      navigation.navigate("login");
                    })
                    .catch((error) => console.error("Fetch error:", error));
                }
              } else {
                console.log("알림 권한이 거부되었습니다.");
              }
            } catch (err) {
              console.warn(err);
            }
          },
        },
        {
          text: "거부",
          onPress: () => {
            console.log("거부");
            // 여기에 false에 해당하는 동작 추가

            // Set the AsyncStorage item to "false"
            AsyncStorage.setItem("isTokenIn", "false");
          },
          style: "cancel",
        },
      ]);
      // }
    };

    // 컴포넌트가 처음 로드될 때 알림 권한 확인 함수 실행
    checkNotificationPermission();
  }, []); // useEffect를 빈 배열로 전달하여 앱이 처음 로드될 때 한 번만 실행되도록 설정
  return (
    <View>
      <Text>Please wait... redirecting in</Text>
    </View>
  );
}
