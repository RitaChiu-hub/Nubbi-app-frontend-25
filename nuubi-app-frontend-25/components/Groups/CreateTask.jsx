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
              task: "",
              pointValue: "",
            }}
            validationSchema={createTaskSchema}
            onSubmit={(values, actions) => {
              const vals = { ...values };
              console.log(vals);
              //   actions.resetForm();
              //   fetch(
              //     //  "https://coral-app-n96bn.ondigitalocean.app/groups/createtask",
              //     "http://localhost:8080/groups/createtask",
              //     {
              //       method: "POST",
              //       credentials: "include",
              //       headers: {
              //         "Content-Type": "application/json",
              //       },
              //       body: JSON.stringify({ ...user, ...vals }),
              //     }
              //   )
              //     .catch((err) => {
              //       return;
              //     })
              //     .then((res) => {
              //       if (!res || !res.ok || res.status >= 400) {
              //         return;
              //       }
              //       return res.json();
              //     })
              //     .then((data) => {
              //       if (!data) return;
              //       //  console.log(data);
              //       setUser({ ...data });
              //       if (data.status) {
              //         setError(data.status);
              //       }
              //     });
            }}
          >
            {(props) => (
              <View>
                <View style={{ marginVertical: 5 }}></View>
                <Text style={globalStyles.h3HeadingRegular}>
                  Create a task that will be assigned to all group members
                </Text>
                <View style={{ marginHorizontal: 30 }}>
                  <Text style={globalStyles.captionError}>{error}</Text>
                  <View>
                    <Text style={globalStyles.textInputLabel}>Task</Text>

                    <TextInput
                      style={globalStyles.textInput}
                      placeholder="Enter the task"
                      onChangeText={props.handleChange("task")}
                      value={props.values.pointValue}
                      onBlur={Keyboard.dismiss}
                      keyboardType="string"
                    />
                    <View style={{ marginVertical: 5 }}></View>
                    <Text style={globalStyles.captionError}>
                      <ErrorMessage name="task" />
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
