import Views from "./components/Views";
import { NavigationContainer } from "@react-navigation/native";
import UserContext from "./components/AccountContext";
import { Fragment } from "react";
import { StatusBar } from "expo-status-bar";

export default function App() {
  return (
    <Fragment>
      <StatusBar style="dark" />
      <UserContext>
        <NavigationContainer>
          <Views />
        </NavigationContainer>
      </UserContext>
    </Fragment>
  );
}
