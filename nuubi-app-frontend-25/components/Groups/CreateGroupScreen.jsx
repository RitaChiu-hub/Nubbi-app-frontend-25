import * as React from "react";
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  Platform,
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
        <Text style={globalStyles.h3HeadingWhite}>Create New Group</Text>
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
                //  console.log(data);
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
                <Text style={globalStyles.captionError}>
                    {error}
                  </Text>
                  <View>
                    <Text style={globalStyles.textInputLabel}>Group Name</Text>
                    <TextInput
                      style={globalStyles.textInput}
                      placeholder="Enter group name"
                      onChangeText={props.handleChange("groupname")}
                      value={props.values.groupname}
                      onBlur={Keyboard.dismiss}
                    />
                    <View style={{ marginVertical: 5 }}></View>
                    <Text style={globalStyles.captionError}>
                      <ErrorMessage name="groupname" />
                    </Text>
                    <Text style={globalStyles.textInputLabel}>Description</Text>
                    <TextInput
                      style={globalStyles.textInputLarge}
                      multiline={true}
                      placeholder="Enter description"
                      onChangeText={props.handleChange("description")}
                      value={props.values.description}
                      onBlur={Keyboard.dismiss}
                    />
                    <View style={{ marginVertical: 5 }}></View>
                    <Text style={globalStyles.captionError}>
                      <ErrorMessage name="description" />
                    </Text>
                    <Text style={globalStyles.textInputLabel}>Visibility</Text>
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
                          <Text style={globalStyles.textInputLabel}>Private</Text>
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
                          <Text style={globalStyles.textInputLabel}>Public</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  <View style={{ marginVertical: 10 }}></View>
                  <TouchableOpacity
                    style={globalStyles.primaryButton}
                    onPress={props.handleSubmit}
                  >
                    <Text style={globalStyles.primaryButtonText}>
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

