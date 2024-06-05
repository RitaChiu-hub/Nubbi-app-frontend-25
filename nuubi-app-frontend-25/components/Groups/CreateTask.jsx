import * as React from "react";
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  Platform,
  Picker,
} from "react-native";
import { Formik, ErrorMessage } from "formik";
import { globalStyles } from "../../styles/global";
import { AccountContext } from "../AccountContext";
const { createTaskSchema } = require("../validationSchema");

export default function CreateTask({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingRegular}>Create New Task</Text>
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
              action: "",
              amount: "",
              item: "",
              pointValue: "",
            }}
            validationSchema={createTaskSchema}
            onSubmit={(values, actions) => {
              const vals = { ...values };
              //  console.log(vals);
              actions.resetForm();
              fetch(
                //  "https://coral-app-n96bn.ondigitalocean.app/groups/createtask",
                "http://localhost:8080/groups/createtask",
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
                  <Text style={globalStyles.captionError}>{error}</Text>
                  <View>
                    <Text style={globalStyles.textInputLabel}>Action</Text>
                    <Picker
                      selectedValue={props.values.action}
                      onValueChange={props.handleChange("action")}
                      style={globalStyles.picker}
                    >
                      <Picker.Item label="Select action" value="" />
                      <Picker.Item label="Write" value="write" />
                      <Picker.Item label="Like" value="like" />
                    </Picker>
                    <View style={{ marginVertical: 5 }}></View>
                    <Text style={globalStyles.captionError}>
                      <ErrorMessage name="action" />
                    </Text>

                    <Text style={globalStyles.textInputLabel}>Amount</Text>
                    <TextInput
                      style={globalStyles.textInput}
                      placeholder="Enter amount (1-10)"
                      onChangeText={props.handleChange("amount")}
                      value={props.values.amount}
                      onBlur={Keyboard.dismiss}
                      keyboardType="numeric"
                    />
                    <View style={{ marginVertical: 5 }}></View>
                    <Text style={globalStyles.captionError}>
                      <ErrorMessage name="amount" />
                    </Text>

                    <Text style={globalStyles.textInputLabel}>Item</Text>
                    <Picker
                      selectedValue={props.values.item}
                      onValueChange={props.handleChange("item")}
                      style={globalStyles.picker}
                    >
                      <Picker.Item label="Select item" value="" />
                      <Picker.Item label="Comments" value="comments" />
                      <Picker.Item label="Posts" value="posts" />
                      <Picker.Item label="Chats" value="chats" />
                    </Picker>
                    <View style={{ marginVertical: 5 }}></View>
                    <Text style={globalStyles.captionError}>
                      <ErrorMessage name="item" />
                    </Text>

                    <Text style={globalStyles.textInputLabel}>Point Value</Text>
                    <TextInput
                      style={globalStyles.textInput}
                      placeholder="Enter point value (1-100)"
                      onChangeText={props.handleChange("pointValue")}
                      value={props.values.pointValue}
                      onBlur={Keyboard.dismiss}
                      keyboardType="numeric"
                    />
                    <View style={{ marginVertical: 5 }}></View>
                    <Text style={globalStyles.captionError}>
                      <ErrorMessage name="pointValue" />
                    </Text>
                  </View>
                  <View style={{ marginVertical: 10 }}></View>
                  <TouchableOpacity
                    style={globalStyles.primaryButton}
                    onPress={props.handleSubmit}
                  >
                    <Text style={globalStyles.primaryButtonText}>
                      Create Task
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
