import * as React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { globalStyles } from "../../styles/global";

export default function LearnMore1Screen({ navigation }) {
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
            Nuubi is your home for learning groups. Each group has two main
            parts: Live chat and posts. Live chat is for general topics and
            quick questions. Posts are for longer questions and sharing
            important info.
          </Text>
          <TouchableOpacity
            style={globalStyles.smallRightButton}
            accessibilityRole="button"
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
