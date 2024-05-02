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

  // This effect sets the navigation options when the component mounts or when the navigation prop changes
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingRegular}>Feedback</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView>
        <View
          style={{
            height: 590,
            paddingTop: 30,
          }}
        >
          <Text style={globalStyles.captionError}>{error}</Text>
          {/* Style addition syntax */}
          <Text style={[globalStyles.h2HeadingMedium]}>
            Share Your Feedback
          </Text>
          <Text style={[globalStyles.bodyRegular, { color: "#888888", marginVertical: 12 }]}>
            Enter in your feedback in the text field below and submit. We
            appreciate and value all feedback provided!
          </Text>

          {/* Input box */}
          <TextInput
            style={[globalStyles.textInputLarge]}
            multiline={true}
            placeholder=""
            onChangeText={(e) => setUserFeedback(e)}
            maxLength={500}
            onBlur={Keyboard.dismiss}
            value={userFeedback}
          />

          {/* Align text count and max length text */}
          <Text
            style={[
              globalStyles.headingText,
              { textAlign: "right" },
              { fontSize: 17 },
              { color: "#888" },
            ]}
          >
            {userFeedback.length} of {500} characters used
          </Text>

          {/* "Save" button, condition for active and inactive functiionality*/}
          <TouchableOpacity
            style={{
              backgroundColor: userFeedback.length <= 0 ? "#fdfdfd" : "#2482aa",
              borderColor: userFeedback.length <= 0 ? "#123234" : "",
              borderWidth: userFeedback.length <= 0 ? 2 : 0,
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              paddingVertical: 14,
              width: "94%",
              marginTop: "auto",
              borderRadius: 60,
              alignSelf: "center",
            }}
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
            <Text
              style={[
                globalStyles.primaryButtonText,
                { color: userFeedback.length <= 0 ? "#123234" : "#fdfdfd" },
              ]}
            >
              Send
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: "#fdfdfd",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 14,
              marginTop: 10,
              borderRadius: 60,
              width: "94%",
              elevation: 3,
              borderWidth: 2,
              borderColor: "#123234",
              alignSelf: "center",
            }}
            accessibilityRole="button"
            onPress={() => goBack()}
          >
            <Text style={globalStyles.secondaryButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
