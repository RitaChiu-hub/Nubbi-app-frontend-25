import * as React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { globalStyles } from "../../styles/global";

export default function LearnMore2Screen({ navigation }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingWhite}>Features</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <ScrollView
      style={{
        padding: 12,
        backgroundColor: "#fbfbfb",
      }}
    >
      <View style={globalStyles.container}>
        <View style={globalStyles.widthContainer}>
          <Text style={globalStyles.bodyRegular}>
            Nuubi can be used as a standalone app, or we can work with your
            university to integrate into your existing LMS, such as Canvas or
            Blackboard.
          </Text>
          <View style={{ marginVertical: 7 }}></View>
          <Text style={globalStyles.bodyRegular}>Our main features are:</Text>

          <View style={{ marginLeft: 12 }}>
            <Text style={globalStyles.bodyRegular}>
              • Group Chat for dynamic, community building conversations
            </Text>
            <Text style={globalStyles.bodyRegular}>
              • Forums for discussion posts and homework help
            </Text>
            <Text style={globalStyles.bodyRegular}>
              • Gamification, including a point system, leaderboards and
              achievements to incentivize positive outcomes
            </Text>
            <Text style={globalStyles.bodyRegular}>
              • Anonymity and mobile friendly design to encourage
              participation
            </Text>
          </View>
          <View style={{ marginVertical: 7 }}></View>
          <TouchableOpacity
            style={globalStyles.smallRightButton}
            accessibilityRole="button"
            onPress={() => navigation.navigate("LearnMore4")}
          >
            <Text style={globalStyles.primaryButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
        {/* <Image
          style={{
            marginTop: 40,
            width: 400,
            height: 520,
          }}
          source={require("../../assets/onboarding/pointsystem.png")}
        /> */}
      </View>
    </ScrollView>
  );
}
