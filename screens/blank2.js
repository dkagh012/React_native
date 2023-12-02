import {
  PermissionsAndroid,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";

const NotificationPermission = () => {
  const checkApplicationPermission = async () => {
    if (Platform.OS === "android") {
      try {
        console.log(
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          )
        );
      } catch (error) {}
    }
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          checkApplicationPermission();
        }}
      >
        <Text>NotificationPermission</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NotificationPermission;
