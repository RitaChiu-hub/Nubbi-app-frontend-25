import * as React from "react";
import {
  Button,
  TextInput,
  View,
  Text,
  StyleSheet,
  Alert,
  StatusBar,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { Formik, ErrorMessage } from "formik";
import { globalStyles } from "../../styles/global";
import { AccountContext } from "../AccountContext";
import * as SecureStore from "expo-secure-store";
const { createPostSchema } = require("../validationSchema");

export default function CreatePostScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "Create Post",
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fdfdfd",
        alignItems: "center",
        paddingTop: 20,
      }}
    >
      <View
        style={{
          marginTop: StatusBar.currentHeight || 15,
          marginBottom: 10,
          minWidth: 300,
        }}
      >
        <Formik
          initialValues={{ title: "", body_text: "" }}
          validationSchema={createPostSchema}
          onSubmit={(values, actions) => {
            const vals = { ...values };
            actions.resetForm();
            fetch(
              `https://coral-app-n96bn.ondigitalocean.app/groups/${user.currentGroup}/createpost`,
              {
                method: "POST",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...user, ...vals }),
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
                console.log(data);
                setUser({ ...data });
                if (data.status) {
                  setError(data.status);
                } else if (data.loggedIn) {
                  SecureStore.setItemAsync("token", data.token);
                }
              });
          }}
        >
          {(props) => (
            <View>
              <Text
                style={{
                  color: "red",
                  textAlign: "center",
                }}
              >
                {error}
              </Text>
              <Text>Post Title</Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#ddd",
                  padding: 10,
                  fontSize: 18,
                  borderRadius: 6,
                  width: "100%",
                  alignItems: "stretch",
                }}
                placeholder="Enter post title"
                onChangeText={props.handleChange("title")}
                value={props.values.title}
                onBlur={Keyboard.dismiss}
              />
              <View style={{ marginVertical: 5 }}></View>
              <Text
                style={{
                  color: "red",
                  textAlign: "center",
                }}
              >
                <ErrorMessage name="title" />
              </Text>
              <Text>Post</Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#ddd",
                  padding: 10,
                  fontSize: 18,
                  borderRadius: 6,
                  width: "100%",
                  height: 350,
                  alignItems: "stretch",
                  textAlignVertical: "top",
                  marginBottom: 5,
                }}
                multiline={true}
                placeholder="Enter text"
                onChangeText={props.handleChange("body_text")}
                value={props.values.body_text}
                onBlur={Keyboard.dismiss}
              />
              <Text
                style={{
                  color: "red",
                  textAlign: "center",
                }}
              >
                <ErrorMessage name="body_text" />
              </Text>
              <View style={{ marginVertical: 10 }}></View>
              <TouchableOpacity
                style={globalStyles.primaryButton}
                onPress={props.handleSubmit}
              >
                <Text style={globalStyles.primaryButtonText}>Create Post</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
}
