// Imported resources
import React, { useLayoutEffect, useState } from "react";
import {
  Keyboard,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { globalStyles } from "../../styles/global";
import { AccountContext } from "../AccountContext";

export default function FeedbackScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);
  const { goBack, navigate } = navigation;
  const [userFeedback, setUserFeedback] = useState("");

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingRegular}>Share Your Feedback</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <ScrollView style={{ backgroundColor: "#fdfdfd" }}>
      <View style={globalStyles.container}>
        <View style={[globalStyles.widthContainer]}>
          <Text style={globalStyles.captionError}>{error}</Text>
          <Text style={[globalStyles.bodyRegular, { marginVertical: 12 }]}>
            Enter in your feedback in the text field below and submit. We
            appreciate and value all feedback provided!
          </Text>

          {/* Input box */}
          <TextInput
            style={globalStyles.textInputLarge}
            multiline={true}
            placeholder="Input your message here... "
            onChangeText={(e) => setUserFeedback(e)}
            maxLength={500}
            onBlur={Keyboard.dismiss}
            value={userFeedback}
          />

          {/* Align text count and max length text */}
          <Text
            style={[
              globalStyles.bodyRegular,
              { textAlign: "right", margin: 10, marginBottom: 14 },
            ]}
          >
            {userFeedback.length} of {500} characters used
          </Text>

          <TouchableOpacity
            style={globalStyles.primaryButton}
            accessibilityRole="button"
            onPress={() => {
              fetch(
                "https://coral-app-n96bn.ondigitalocean.app/settings/sendfeedback",
                {
                  method: "POST",
                  credentials: "include",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ ...user, userFeedback }),
                }
              )
                .catch((err) => {
                  return;
                })
                .then((res) => {
                  if (!res || !res.ok || res.status >= 400) {
                    return;
                  }
                  return res.json();
                })
                .then((data) => {
                  if (!data) return;

                  setUser({ ...data });
                  if (data.status) {
                    setError(data.status);
                    setUserFeedback("");
                  }
                });
            }}
            disabled={userFeedback.length <= 0}
          >
            <Text style={globalStyles.primaryButtonText}>Send</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={globalStyles.secondaryButton}
            accessibilityRole="button"
            onPress={() => goBack()}
          >
            <Text style={globalStyles.secondaryButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
