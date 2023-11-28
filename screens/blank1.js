import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function BlankScreen1() {
  const [colors, setColors] = useState([]);

  useEffect(() => {
    // Fetch data from the server
    fetch("http://localhost:3000/colors")
      .then((response) => response.json())
      .then((data) => {
        setColors(data);
      })
      .catch((error) => {
        console.error("Error fetching color data:", error);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Colors:</Text>
      {colors.length > 0 && (
        <Text key={colors[0].color_id} style={styles.colorText}>
          {colors[0].color_name}
        </Text>
      )}
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
  titleText: {
    fontSize: 20,
    marginBottom: 10,
  },
  colorText: {
    fontSize: 16,
  },
});
