import * as React from "react";
import { View, Text } from "react-native";
import { globalStyles } from "../../styles/global";

export default function NotificationsScreen({ navigation }) {

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.screenHeader}>Notifications</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fdfdfd" }}>
      <Text style={globalStyles.body2Regular}>Notifications coming soon!</Text>
    </View>
  );
}
