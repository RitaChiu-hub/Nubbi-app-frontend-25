import * as React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { globalStyles } from "../../styles/global";

export default function LearnMore7Screen({ navigation }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingWhite}>Pricing</Text>
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
        <View style={[globalStyles.widthContainer, { alignItems: "center" }]}>
          <Text style={globalStyles.bodyRegular}>
            Nuubi is currently available for free beta testing with select
            universities.
          </Text>
          <View style={{ marginVertical: 8 }}></View>
          <Text style={globalStyles.bodyRegular}>
            Test it out now with a free account!
          </Text>
          <View style={{ marginVertical: 8 }}></View>
          <View>
            <TouchableOpacity
              style={globalStyles.primaryButton}
              accessibilityRole="button"
              onPress={() => navigation.navigate("SignUp")}
            >
              <Text style={globalStyles.primaryButtonText}>Sign Up</Text>
            </TouchableOpacity>
            <View></View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
