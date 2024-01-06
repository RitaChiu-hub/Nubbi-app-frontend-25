import * as React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { globalStyles } from "../../styles/global";

export default function LearnMore1Screen({ navigation }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.screenHeader}>Learn More</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <ScrollView
      style={{
        backgroundColor: "#fdfdfd",
      }}
    >
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#fdfdfd",
          padding: 16,
        }}
      >
        <Text style={globalStyles.body2Regular}>
          Nuubi is your home for learning groups. Each group has two main parts:
          Live chat and posts. Live chat is for general topics and quick
          questions. Posts are for longer questions and sharing important info.
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
              paddingHorizontal: 30,
              borderRadius: 60,
              elevation: 3,
              backgroundColor: "#2482AA",
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
          }}
          source={require("../../assets/onboarding/chatposts.png")}
        />
      </View>
    </ScrollView>
  );
}
