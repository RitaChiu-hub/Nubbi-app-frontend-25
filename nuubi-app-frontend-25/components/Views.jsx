import "react-native-gesture-handler";
import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext } from "react";
// import { AccountContext } from "./AccountContext";

// import LoginScreen from "./Login/LoginScreen";
// import SignUpScreen from "./Login/SignUpScreen";

// import HomeScreen from "./HomeScreen";
import SplashScreen from "./SplashScreen";

// const StackHome = createNativeStackNavigator();

// function HomeStack() {
//   return (
//     <StackHome.Navigator
//       initialRouteName="Home"
//       screenOptions={{ headerBackTitleVisible: false }}
//       // screenOptions={{ headerShown: false }}
//     >
//       <StackHome.Screen
//         name="Home"
//         component={HomeScreen}
//         options={{ title: "Home" }}
//       />
//     </StackHome.Navigator>
//   );
// }

const StackAuth = createNativeStackNavigator();

function AuthStack() {
  return (
    <StackAuth.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerBackTitleVisible: false }}
    >
      <StackAuth.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      {/* <StackAuth.Screen name="Login" component={LoginScreen} />
      <StackAuth.Screen name="SignUp" component={SignUpScreen} /> */}
    </StackAuth.Navigator>
  );
}

const Stack = createNativeStackNavigator();

export default function Views() {
  //	const { user } = useContext(AccountContext);
  //const isAuth = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* {user.loggedIn == false ? ( */}
      <Stack.Screen
        name="Sign in"
        component={AuthStack}
        options={{
          title: "Log in",
        }}
      />
      {/* ) : (
				<Stack.Screen name="HomeStack" component={HomeStack} />
			)} */}
    </Stack.Navigator>
  );
}
