import * as React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { globalStyles } from "../../styles/global";

export default function LearnMore7Screen({ navigation }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.screenHeader}>Learn More</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: "#fdfdfd",
        padding: 16,
        paddingTop: 32,
      }}
    >
      <Text style={globalStyles.body2Regular}>
        Time to start learning together, get your questions answered faster{" "}
        {"& "}
        get rewarded for being helpful!
      </Text>

      <View>
        <TouchableOpacity
          style={{
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 14,
            paddingHorizontal: 20,
            borderRadius: 60,
            elevation: 3,
            backgroundColor: "#2482AA",
            width: "100%",
            marginTop: 16,
          }}
          accessibilityRole="button"
          onPress={() => navigation.navigate("SignUp")}
        >
          <Text style={globalStyles.primaryButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
