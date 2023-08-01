import "react-native-gesture-handler";
import Views from "./components/Views";
//import Freshpaint from "@freshpaint/freshpaint-react-native";
import { NavigationContainer } from "@react-navigation/native";
import UserContext from "./components/AccountContext";
import { Fragment } from "react";
import { StatusBar } from "expo-status-bar";

//Freshpaint.init("e1f8844c-e8e6-4bba-81b8-9873888789b1");
// const FreshpaintNavigationContainer =
//   Freshpaint.withReactNavigationAutotrack(NavigationContainer);

const linking = {
  config: {
    screens: {},
  },
};

export default function App() {
  return (
    <Fragment>
      <StatusBar style="dark" />
      <UserContext>
        {/* <FreshpaintNavigationContainer> */}
        <NavigationContainer linking={linking}>
          <Views />
        </NavigationContainer>
        {/* </FreshpaintNavigationContainer> */}
      </UserContext>
    </Fragment>
  );
}
