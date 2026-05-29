import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginPage from "../Screens/Auth/LoginPage";
import HomePage from "../Screens/Mains/HomePage";
import SignUpPage from "../Screens/Auth/SignUpPage";

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Home"
    >
      <Stack.Screen name="Login" component={LoginPage} />
      <Stack.Screen name="SignUp" component={SignUpPage} />
      <Stack.Screen name="Home" component={HomePage} />
    </Stack.Navigator>
  );
};
