import * as React from "react";
import {
  Button,
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { globalStyles } from "../../styles/global";

export default function LearnMore5Screen({ navigation }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "Learn more",
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <View style={globalStyles.container}>
      <Text style={{ fontSize: 20, padding: 10, color: "red" }}>
        switch the order????
      </Text>
      <Text style={{ fontSize: 20, padding: 10 }}>
        Now for the fun part - points! You can award a point to any helpful live
        chat message, post or post comment. This means you can get rewarded for
        being helpful! You can check out the group info page to see where you
        rank, and see which members are likely to be helpful if you're stuck on
        learning a new concept.
      </Text>

      <Text style={{ fontSize: 20, padding: 10 }}>
        Insert picture of likes and/or group info page
      </Text>
      <View style={{ marginBottom: 100 }}>
        <TouchableOpacity
          style={globalStyles.primaryButton}
          onPress={() => navigation.navigate("LearnMore6")}
        >
          <Text style={globalStyles.primaryButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
