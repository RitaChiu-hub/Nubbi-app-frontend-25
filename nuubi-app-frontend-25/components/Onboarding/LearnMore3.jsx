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

export default function LearnMore3Screen({ navigation }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "Learn more",
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <View style={globalStyles.container}>
      <Text style={{ fontSize: 20, padding: 10 }}>
        At your home page, click on your username in the upper left corner to
        see how many total points you've earned, along with all your user
        settings.
      </Text>

      <Text style={{ fontSize: 20, padding: 10 }}>
        Insert picture of user page example
      </Text>
      <View style={{ marginBottom: 100 }}>
        <TouchableOpacity
          style={globalStyles.primaryButton}
          onPress={() => navigation.navigate("LearnMore4")}
        >
          <Text style={globalStyles.primaryButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
