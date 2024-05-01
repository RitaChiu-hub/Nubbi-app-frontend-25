import * as React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { globalStyles } from "../../styles/global";

export default function LearnMore2Screen({ navigation }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <Text style={globalStyles.h3HeadingRegular}>Learn More</Text>,
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
          Get points for being helpful on any post, comment or message! The
          group info page shows the most helpful members.
        </Text>
        <TouchableOpacity
            style={globalStyles.smallRightButton}
            accessibilityRole="button"
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
    </ScrollView>
  );
}
