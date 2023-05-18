import * as React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { globalStyles } from "../../styles/global";

export default function LearnMore4Screen({ navigation }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "Learn More",
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
          justifyContent: "center",
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
          You can see all your groups on the home page. To join your first
          group, click "New" in the upper right corner. You can create your own
          group, browse public groups, or enter a passcode to join a private
          group.
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
            onPress={() => navigation.navigate("LearnMore7")}
          >
            <Text style={globalStyles.primaryButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
        <Image
          style={{
            width: 440,
            height: 520,
          }}
          source={require("../../assets/onboarding/homepage2.png")}
        />
      </View>
    </ScrollView>
  );
}
