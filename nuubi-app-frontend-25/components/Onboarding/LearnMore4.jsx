import * as React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { globalStyles } from "../../styles/global";

export default function LearnMore4Screen({ navigation }) {
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
        <Text style={globalStyles.bodyRegular}>
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
              paddingHorizontal: 30,
              borderRadius: 60,
              elevation: 3,
              backgroundColor: "#2482AA",
            }}
            accessibilityRole="button"
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
