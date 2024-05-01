import * as React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { globalStyles } from "../../styles/global";

export default function LearnMore4Screen({ navigation }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingRegular}>Learn More</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <ScrollView
      style={{
        padding: 12,
        backgroundColor: "#fdfdfd",
      }}
    >
      <View style={globalStyles.container}>
        <View style={globalStyles.widthContainer}>
          <Text style={globalStyles.bodyRegular}>
            You can see all your groups on the home page. To join your first
            group, click "New" in the upper right corner. You can create your
            own group, browse public groups, or enter a passcode to join a
            private group.
          </Text>
          <TouchableOpacity
            style={globalStyles.smallRightButton}
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
