import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoadingScreen({ navigation }) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (count === 0) {
      const checkLoginStatus = async () => {
        try {
          const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
          if (isLoggedIn === 'true') {
            navigation.navigate('index');
          } else {
            navigation.navigate('login');
          }
        } catch (error) {
          console.error('Error checking login status:', error);
        }
      };
    
      checkLoginStatus();
    }
  }, [count, navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.loadingText}>Please wait... redirecting in ({count})</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 20,
  },
});