import * as React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { globalStyles } from "../../styles/global";

export default function LearnMore2Screen({ navigation }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <Text style={globalStyles.screenHeader}>Learn More</Text>,
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
        <Text
            style={globalStyles.body2Regular}
        >
          Get points for being helpful on any post, comment or message! The
          group info page shows the most helpful members.
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
              marginTop: 10,
              paddingVertical: 14,
              paddingHorizontal: 30,
              borderRadius: 60,
              elevation: 3,
              backgroundColor: "#2482AA",
            }}
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
