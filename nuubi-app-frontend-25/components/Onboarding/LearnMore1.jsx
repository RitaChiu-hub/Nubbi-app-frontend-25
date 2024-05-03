import * as React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { globalStyles } from "../../styles/global";

export default function LearnMore1Screen({ navigation }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingRegular}>Mission</Text>
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
            Our mission is to increase university student success through
            gamified peer-learning.
          </Text>
          <View style={{ marginVertical: 7 }}></View>
          <Text style={globalStyles.bodyRegular}>
            Research by Stanford shows that peer learning can boost retention by
            16X and engagement by 5X in online learning.
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
          source={require("../../assets/onboarding/homepageScreen.png")}
          style={{
            width: 400,
            height: 400,
            marginTop: 30,
          }}
          resizeMode="contain"
        />
      </View>
    </ScrollView>
  );
}
