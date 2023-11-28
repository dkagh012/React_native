import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function IndexScreen({ navigation }) {

  const onPressButton1 = () => {
    navigation.navigate("blank1")
  }

  const onPressButton2 = () => {
    navigation.navigate("blank2")
  }

  const onPressButton3 = () => {
    navigation.navigate("blank3")
  }

  const onLogout = async () => {

    await AsyncStorage.removeItem('isLoggedIn');

    navigation.navigate('login');
  };

  return (
    <View style={styles.container}>


      {/* Pressable Buttons */}
      <Pressable style={styles.button} onPress={onPressButton1}>
        <Text style={styles.buttonText}>Go to Blank Screen 1</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={onPressButton2}>
        <Text style={styles.buttonText}>Go to Blank Screen 2</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={onPressButton3}>
        <Text style={styles.buttonText}>Go to Blank Screen 3</Text>
      </Pressable>
      
      {/* Logout Button */}
      <Pressable style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    gap: 10
  },
  logoutButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'red', // Change the color as needed
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black'
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});