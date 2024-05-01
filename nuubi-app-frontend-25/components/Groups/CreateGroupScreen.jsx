import * as React from "react";
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Keyboard,
  Platform,
  Dimensions,
} from "react-native";
import { Formik, ErrorMessage } from "formik";
import { globalStyles } from "../../styles/global";
import { AccountContext } from "../AccountContext";
const { createGroupSchema } = require("../validationSchema");

export default function CreateGroupScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);

  const [option, setOption] = React.useState(null);
  const [privacySelection, setPrivacySelection] = React.useState("Private");

  const [userOption, setUserOption] = React.useState(null);
  const selectHandler = (value) => {
    onSelect(value);
    setUserOption(value);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.screenHeader}>Create New Group</Text>
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
              groupname: "",
              description: "",
              visibility: "Private",
            }}
            validationSchema={createGroupSchema}
            onSubmit={(values, actions) => {
              const vals = { ...values };
              const allvals = { ...values, privacySelection };
              actions.resetForm();
              fetch(
                "https://coral-app-n96bn.ondigitalocean.app/groups/creategroup",
                {
                  method: "POST",
                  credentials: "include",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  //body: JSON.stringify({ ...user, ...vals }),
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
                  <View>
                    <Text style={globalStyles.loginLabelText}>Group Name</Text>
                    <TextInput
                      style={globalStyles.loginInput}
                      placeholder="Enter group name"
                      onChangeText={props.handleChange("groupname")}
                      value={props.values.groupname}
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
                    <Text style={globalStyles.loginLabelText}>Description</Text>
                    <TextInput
                      // make the text box larger? Make sure it's maximum 255 characters.
                      style={globalStyles.loginInputLarge}
                      multiline={true}
                      placeholder="Enter description"
                      onChangeText={props.handleChange("description")}
                      value={props.values.description}
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
                    <Text style={globalStyles.loginLabelText}>Visibility</Text>
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
                          <Text style={globalStyles.radioText}>Private</Text>
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
                          <Text style={globalStyles.radioText}>Public</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  <View style={{ marginVertical: 10 }}></View>
                  <TouchableOpacity
                    style={globalStyles.loginButton}
                    onPress={props.handleSubmit}
                  >
                    <Text style={globalStyles.loginButtonText}>
                      Create Group
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
   // width: deviceWidth * 0.9,
   width: deviceWidth > 500 ? deviceWidth * 0.6 : deviceWidth * 0.9,
   maxWidth: 500,
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
    width: deviceWidth > 500 ? deviceWidth * 0.6 : deviceWidth * 0.9,
    maxWidth: 500, 
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
    // width: deviceWidth * 0.9,
    width: deviceWidth > 500 ? deviceWidth * 0.6 : deviceWidth * 0.9,
    maxWidth: 500,
    alignItems: "stretch",
    marginVertical: 5,
  },
  radioText: {
    color: "#333333",
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    letterSpacing: 1.25,
  },
});
