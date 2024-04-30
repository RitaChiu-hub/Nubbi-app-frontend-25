import * as React from "react";
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  Platform,
  Dimensions,
  StyleSheet
} from "react-native";
import { Formik, ErrorMessage } from "formik";
import { globalStyles } from "../../styles/global";
import { AccountContext } from "../AccountContext";
import * as SecureStore from "expo-secure-store";
const { createGroupSchema } = require("../validationSchema");
import { loginStyles } from "../../styles/loginStyles";

export default function EditGroupScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);

  const [option, setOption] = React.useState(null);
  const [privacySelection, setPrivacySelection] = React.useState(
    user.visibility
  );

  const [userOption, setUserOption] = React.useState(null);
  const selectHandler = (value) => {
    onSelect(value);
    setUserOption(value);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.screenHeader}>Edit Group</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <ScrollView style={{ backgroundColor: "#fdfdfd" }}>
      <View style={globalStyles.container}>
        <View
          style={{
            flex: 1,
            marginTop: 15,
            alignItems: "center",
            marginBottom: Platform.OS === "android" ? 100 : 400,
          }}
        >
          <Formik
            initialValues={{
              groupname: user.groupName,
              description: user.groupDescription,
              visibility: user.visibility,
            }}
            validationSchema={createGroupSchema}
            onSubmit={(values, actions) => {
              const vals = { ...values };
              const allvals = { ...values, privacySelection };
              fetch(
                "https://coral-app-n96bn.ondigitalocean.app/groups/editgroup",
                {
                  method: "POST",
                  credentials: "include",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ ...user, ...allvals }),
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
                  }
                });
            }}
          >
            {(props) => (
              <View>
                <View style={{ marginVertical: 5 }}></View>
                <View style={{ marginHorizontal: 30 }}>
                  <Text
                    style={{
                      color: "red",
                      textAlign: "center",
                    }}
                  >
                    {error}
                  </Text>
                  <View >
                  <Text style={loginStyles.loginLabelText}>Group Name</Text>
                    <TextInput
                      style={styles.loginInput}
                      placeholder="Enter group name"
                      onChangeText={props.handleChange("groupname")}
                      value={props.values.groupname}
                      marginBottom={10}
                      onBlur={Keyboard.dismiss}
                    />
                    <View style={{ marginVertical: 5 }}></View>
                    <Text
                      style={{
                        color: "red",
                        textAlign: "center",
                      }}
                    >
                      <ErrorMessage name="groupname" />
                    </Text>
                    <Text style={loginStyles.loginLabelText}>Description</Text>
                    <TextInput
                      // make the text box larger? Make sure it's maximum 255 characters.
                      style={styles.loginInputLarge}
                      multiline={true}
                      placeholder="Enter description"
                      onChangeText={props.handleChange("description")}
                      value={props.values.description}
                      marginBottom={10}
                      onBlur={Keyboard.dismiss}
                    />
                    <View style={{ marginVertical: 5 }}></View>
                    <Text
                      style={{
                        color: "red",
                        textAlign: "center",
                      }}
                    >
                      <ErrorMessage name="description" />
                    </Text>
                    <Text style={loginStyles.loginLabelText}>Visibility</Text>
                    <View style={{ marginVertical: 5 }}></View>
                    <View style={globalStyles.buttonContainer}>
                      <View>
                        <TouchableOpacity
                          style={
                            privacySelection === "Private"
                              ? globalStyles.selected
                              : globalStyles.unselected
                          }
                          onPress={() => {
                            setPrivacySelection("Private");
                          }}
                        >
                          <Text style={styles.radioText}>
                            Private
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View>
                        <TouchableOpacity
                          style={
                            privacySelection === "Public"
                              ? globalStyles.selected
                              : globalStyles.unselected
                          }
                          onPress={() => {
                            setPrivacySelection("Public");
                          }}
                        >
                         <Text style={styles.radioText}>
                            Public
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  <View style={{ marginVertical: 10 }}></View>
                  <TouchableOpacity
               style={loginStyles.loginButton}
                    onPress={props.handleSubmit}
                  >
                  <Text style={loginStyles.loginButtonText}>
                      Update Group
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>
        </View>
      </View>
    </ScrollView>
  );
}



const deviceWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
  loginInput: {
    flex: 0.5,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#C0C0C0",
    backgroundColor: "#EBEBEB",
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#767676",
    padding: 12,
    borderRadius: 10,
    alignItems: "stretch",
    marginVertical: 5,
    width: deviceWidth * 0.9,
  },
  loginInputLarge: {
    flex: 0.5,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#C0C0C0",
    backgroundColor: "#EBEBEB",
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#767676",
    padding: 12,
    borderRadius: 10,
    alignItems: "stretch",
    width: deviceWidth * 0.9,
    height: 200,
    paddingTop: 12,
    paddingRight: 12,
    textAlignVertical: "top",
  },
  passwordInputContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#C0C0C0",
    backgroundColor: "#EBEBEB",
    padding: 8,
    borderRadius: 10,
    width: deviceWidth * 0.9,
    alignItems: "stretch",
    marginVertical: 5,
  },
  radioText: {
    color: "#333333",
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    letterSpacing: 1.25,
    // marginTop: 8,
    //  marginBottom: 4,
  },
});
