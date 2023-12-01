import { useState } from "react";
import { StyleSheet, TextInput, Text, View, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation }) {
  const [username, onChangeUsername] = useState("");
  const [password, onChangePassword] = useState("");

  const onPressSubmit = async () => {
    try {
      const response = await fetch("http://192.168.50.211:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Login successful, navigate to the next screen
        console.log("GOt here");
        await AsyncStorage.setItem("isLoggedIn", "true");
        navigation.navigate("index");
      } else {
        // Display an error message or handle the login failure
        console.error("Login failed:", result.message);
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
        // keyboardType="numeric"
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
