import * as React from "react";
import {
  Button,
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { globalStyles } from "../styles/global";

export default function SplashScreen({ navigation }) {
  const [myMessage, setMyMessage] = React.useState(null);
  const [myMessage2, setMyMessage2] = React.useState(null);

  const getMessage = async () => {
    try {
      const response = await fetch(
        `https://coral-app-n96bn.ondigitalocean.app/backend/getmessage2`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );
      const jsonData = await response.text();
      console.log(jsonData);
      setMyMessage2(jsonData.message);
    } catch (err) {
      console.error(err.message);
    }
  };

  React.useEffect(() => {
    getMessage();
  }, []);

  return (
    <SafeAreaView style={globalStyles.container}>
      <Text>{myMessage2}</Text>
    </SafeAreaView>
  );
}
