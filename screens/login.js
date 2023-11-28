import { useState } from "react";
import { StyleSheet, TextInput, Text, View, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation }) {
  const [username, onChangeUsername] = useState("");
  const [password, onChangePassword] = useState("");

  const onPressSubmit = async () => {
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      // 서버 응답 로그 출력
      console.log("POST RESPONSE: " + JSON.stringify(response));

      // 서버 응답을 텍스트로 변환하여 로그 출력 (HTML 또는 다른 형식일 수 있음)
      const responseText = await response.text();
      console.log("Response Text:", responseText);

      // 응답이 JSON 형식인 경우에만 파싱
      if (response.headers.get("content-type")?.includes("application/json")) {
        const result = JSON.parse(responseText);

        if (result.success) {
          // 로그인 성공 처리
          console.log("Login successful");
          await AsyncStorage.setItem("isLoggedIn", "true");
          navigation.navigate("index");
        } else {
          // 로그인 실패 처리
          console.error("Login failed:", result.message);
        }
      } else {
        // 응답이 JSON이 아닌 경우의 처리
        console.error("Invalid response format");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.loginHeaderText}>Login</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeUsername}
        value={username}
        placeholder="Username"
      />
      <TextInput
        style={styles.input}
        onChangeText={onChangePassword}
        value={password}
        placeholder="Password"
        secureTextEntry
      />
      <Pressable style={styles.button} onPress={onPressSubmit}>
        <Text style={styles.text}>Login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  loginHeaderText: {
    fontSize: 30,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 280,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "black",
    width: 280,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});
