import * as React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { globalStyles } from "../../styles/global";

export default function LearnMore7Screen({ navigation }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingRegular}>Learn More</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.widthContainer}>
        <Text style={globalStyles.bodyRegular}>
          Time to start learning together, get your questions answered faster{" "}
          {"& "}
          get rewarded for being helpful!
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
        </View>
      </View>
    </View>
  );
}
