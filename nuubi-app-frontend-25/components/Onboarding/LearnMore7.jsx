import * as React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { globalStyles } from "../../styles/global";

export default function LearnMore7Screen({ navigation }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "Learn More",
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fdfdfd",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          fontSize: 18,
          color: "#333",
          padding: 20,
          marginLeft: 20,
          marginRight: 20,
          marginTop: -250,
        }}
      >
        Time to start learning together, get your questions answered faster{" "}
        {"& "}
        get rewarded for being helpful!
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
      >
        <View></View>
        <View style={globalStyles.buttonContainer}>
          <View>
            <TouchableOpacity
              style={globalStyles.secondaryButton}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={globalStyles.secondaryButtonText}>Log in</Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              style={globalStyles.primaryButton}
              onPress={() => navigation.navigate("SignUp")}
            >
              <Text style={globalStyles.primaryButtonText}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
