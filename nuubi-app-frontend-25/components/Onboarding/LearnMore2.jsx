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

export default function LearnMore2Screen({ navigation }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "Learn More",
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fdfdfd",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Text
        style={{
          fontSize: 18,
          color: "#333",
          padding: 20,
          marginLeft: 5,
          marginRight: 25,
        }}
      >
        Get points for being helpful on any post, comment or message! The group
        info page shows the most helpful members.
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          width: "90%",
        }}
      >
        <View></View>
        <TouchableOpacity
          style={{
            paddingVertical: 14,
            paddingHorizontal: 20,
            borderRadius: 12,
            elevation: 3,
            backgroundColor: "#1aa7ec",
          }}
          onPress={() => navigation.navigate("LearnMore4")}
        >
          <Text style={globalStyles.primaryButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
      <Image
        style={{
          marginTop: 40,
          width: 400,
          height: 520,
        }}
        source={require("../../assets/onboarding/pointsystem.png")}
      />
    </View>
  );
}
