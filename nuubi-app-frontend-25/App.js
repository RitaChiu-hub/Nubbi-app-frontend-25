import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  const [myMessage, setMyMessage] = React.useState(null);

  console.log("--------------------1------------------");
  const getMessage = async () => {
    try {
      //  const response = await fetch(`http://127.0.0.1:4000/backend/getmessage`, {
      const response = await fetch(
        `https://coral-app-n96bn.ondigitalocean.app/backend/getmessage`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(),
        }
      );
      const jsonData = await response.json();
      setMyMessage(jsonData.message);
      console.log(myMessage);
    } catch (err) {
      console.error(err.message);
    }
  };

  React.useEffect(() => {
    getMessage();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Hello</Text>
      <Text>{myMessage}</Text>
      <StatusBar style="auto" />
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
});
