import * as React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { globalStyles } from "../../styles/global";

export default function LearnMore4Screen({ navigation }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingWhite}>Values</Text>
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
            Nuubi is committed to accessibility, safety, inclusivity,
            empowerment and career-readiness. We adhere to the industry leading
            WCAG accessability and HECVAT security standards.
          </Text>
          <View style={{ marginVertical: 7 }}></View>
          <TouchableOpacity
            style={globalStyles.smallRightButton}
            accessibilityRole="button"
            onPress={() => navigation.navigate("LearnMore7")}
          >
            <Text style={globalStyles.primaryButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
        {/* <Image
          style={{
            width: 440,
            height: 520,
          }}
          source={require("../../assets/onboarding/homepage2.png")}
        /> */}
      </View>
    </ScrollView>
  );
}
