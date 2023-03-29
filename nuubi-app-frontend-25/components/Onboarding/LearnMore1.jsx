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

export default function LearnMore1Screen({ navigation }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "Learn more",
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
        Nuubi is your home for learning groups. Each group has two main parts:
        Live chat and posts. Live chat is for general topics and quick
        questions. Posts are for longer questions and sharing important info.
      </Text>
      <View
        style={{
          flexDirection: "row",
          //alignItems: "flex-end",
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
          onPress={() => navigation.navigate("LearnMore2")}
        >
          <Text style={globalStyles.primaryButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
      <Image
        style={{
          marginTop: 30,
          width: 440,
          height: 500,
          marginLeft: -40,
        }}
        source={require("../../assets/onboarding/chatposts.png")}
      />
    </View>
  );
}
