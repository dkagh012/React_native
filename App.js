import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import IndexScreen from "./screens/index";
import LoginScreen from "./screens/login";
import LoadingScreen from "./screens/loading";
import BlankScreen1 from "./screens/blank1";
import BlankScreen2 from "./screens/blank2";
import BlankScreen3 from "./screens/blank3";
import Popup from "./screens/Popup";
import Test from "./screens/test";

// Import the 'firebase/app' module to initialize Firebase

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          name="Popup"
          component={Popup}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="loading"
          component={LoadingScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="login"
          component={LoginScreen}
        />
        <Stack.Screen
          options={{ headerShown: true, title: "Index" }}
          name="index"
          component={IndexScreen}
        />
        <Stack.Screen
          options={{ headerShown: true, title: "Blank Screen 1" }}
          name="blank1"
          component={BlankScreen1}
        />
        <Stack.Screen
          options={{ headerShown: true, title: "Blank Screen 2" }}
          name="blank2"
          component={BlankScreen2}
        />
        <Stack.Screen
          options={{ headerShown: true, title: "Blank Screen 3" }}
          name="blank3"
          component={BlankScreen3}
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
