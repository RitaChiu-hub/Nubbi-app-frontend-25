import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import { globalStyles } from "../../styles/global";

export default function HelpScreen({ navigation }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "Nuubi How-To",
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
          //  alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#fdfdfd",
        }}
      >
        <Text style={styles.header}>Where can I find Nuubi? </Text>

        <Text style={styles.text}>
          Nuubi is available at www.nuubi.app on the web, as well as iOS and
          Android app stores.
        </Text>

        <Text style={styles.header}>How do I create an account? </Text>

        <Text style={styles.header}>How do I join a private group? </Text>

        <Text style={styles.header}>
          How do I find my group invite passcode & admin username?{" "}
        </Text>

        <Text style={styles.header}>
          How do I invite someone to my private group?{" "}
        </Text>

        <Text style={styles.header}>
          How do I see the points of each member in a group?{" "}
        </Text>

        <Text style={styles.header}>
          How do I edit my group information, where I'm the admin?{" "}
        </Text>

        <Text style={styles.header}>How do I create my own group? </Text>

        <Text style={styles.header}>
          How do I find the Posts Screen {"("} for posts and discussion
          questions? {")"}{" "}
        </Text>
        <Text style={styles.header}>How do I add a discussion post? </Text>
        <Text style={styles.header}>How do I answer a discussion post? </Text>
        <Text style={styles.header}>How do I change my settings?</Text>
        <Text style={styles.header}>
          How do I get more help if I have more questions?
        </Text>

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

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    color: "#333",
    paddingTop: 10,
    marginLeft: 15,
    marginRight: 25,
  },
  header: {
    fontSize: 18,
    color: "#333",
    paddingTop: 20,
    marginLeft: 15,
    marginRight: 25,
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "left",
  },
});
