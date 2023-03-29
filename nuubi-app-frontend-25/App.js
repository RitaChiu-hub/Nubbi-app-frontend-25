import Views from "./components/Views";
import { NavigationContainer } from "@react-navigation/native";
import UserContext from "./components/AccountContext";

export default function App() {
  return (
    <UserContext>
      <NavigationContainer>
        <Views />
      </NavigationContainer>
    </UserContext>
  );
}
