//import * as React from "react";
import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Platform,
  Button,
} from "react-native";
import { AccountContext } from "../AccountContext";
import { globalStyles } from "../../styles/global";
import { useIsFocused } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons"; // Assuming you're using Expo and have installed @expo/vector-icons
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "Original Title",
    body: "And here is the body!",
    data: { someData: "goes here" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

function handleRegistrationError(errorMessage) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      handleRegistrationError(
        "Permission not granted to get push token for push notification!"
      );
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError("Project ID not found");
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      // console.log(pushTokenString);
      return pushTokenString;
    } catch (error) {
      handleRegistrationError(`${error}`);
    }
  } else {
    handleRegistrationError("Must use physical device for push notifications");
  }
}

export default function MyGroupTasks({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const isFocused = useIsFocused();
  const [error, setError] = React.useState(null);
  const [groupTasks, setGroupTasks] = React.useState([]);
  const [allGroupTasks, setAllGroupTasks] = React.useState([]);
  const [selectedTab, setSelectedTab] = React.useState("Groups");
  const [completedTasks, setCompletedTasks] = React.useState({}); // State to track completed tasks
  const [approvedTasks, setApprovedTasks] = React.useState({}); // State to track completed tasks

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(undefined);
  const notificationListener = useRef();
  const responseListener = useRef();

  async function registerForPushNotificationsAsync() {
    let token;
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig.extra.eas.projectId,
        })
      ).data;
    } catch (error) {
      console.error(error);
    }
    return token;
  }

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token ?? ""))
      .catch((error) => setExpoPushToken(`${error}`));

    console.log(expoPushToken);
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  const screenWidth = Dimensions.get("window").width;
  const myIsAdmin = user ? user.isAdmin : false;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingRegular}>My Group Tasks</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  const getGroupTasks = async () => {
    try {
      const response = await fetch(
        // `https://coral-app-n96bn.ondigitalocean.app/groups/mygrouptasks`,
        `https://coral-app-n96bn.ondigitalocean.app/groups/mygrouptasks`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...user }),
        }
      );
      const jsonData = await response.json();
      setGroupTasks(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  const getAllGroupTasks = async () => {
    try {
      const response = await fetch(
        // `https://coral-app-n96bn.ondigitalocean.app/groups/mygrouptasks`,
        `https://coral-app-n96bn.ondigitalocean.app/groups/allgrouptasks`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...user }),
        }
      );
      const jsonData = await response.json();
      setAllGroupTasks(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  // React.useEffect(() => {
  //   myIsAdmin != "true" ? getGroupTasks() : getAllGroupTasks();
  // }, []);

  React.useEffect(() => {
    // Call getGroupTasks unconditionally
    getGroupTasks();

    // Conditionally call getAllGroupTasks if the user is an admin
    if (myIsAdmin == "true") {
      getAllGroupTasks();
    }
  }, []);

  const handleCompleteTask = (taskId) => {
    if (!completedTasks[taskId]) {
      setCompletedTasks((prevCompletedTasks) => ({
        ...prevCompletedTasks,
        [taskId]: true,
      }));

      fetch(
        //  "https://coral-app-n96bn.ondigitalocean.app/groups/createtask",
        "https://coral-app-n96bn.ondigitalocean.app/groups/taskcompleted",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...user, taskId }),
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
          //  setUser({ ...data });
          if (data.status) {
            setError(data.status);
          }
        });
      // mark as completed in the backend database
    }
  };

  const handleApproveTask = (taskId) => {
    if (!approvedTasks[taskId]) {
      setApprovedTasks((prevApprovedTasks) => ({
        ...prevApprovedTasks,
        [taskId]: true,
      }));

      //   console.log("Approved!")

      fetch(
        //  "https://coral-app-n96bn.ondigitalocean.app/groups/createtask",
        "https://coral-app-n96bn.ondigitalocean.app/groups/taskapproved",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...user, taskId }),
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
          //  setUser({ ...data });
          if (data.status) {
            setError(data.status);
          }
        });
      // mark as approved in the backend database
    }
  };

  const completedTasksList = myIsAdmin
    ? allGroupTasks.filter((task) => task.is_completed)
    : groupTasks.filter((task) => task.is_completed);

  const notCompletedTasksList = myIsAdmin
    ? allGroupTasks.filter((task) => !task.is_completed)
    : groupTasks.filter((task) => !task.is_completed);

  // console.log(
  //   myIsAdmin
  //     ? allGroupTasks.filter((task) => !task.is_completed)
  //     : groupTasks.filter((task) => !task.is_completed)
  // );

  const renderCompletionItem = ({ item }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        minWidth: 300,
        borderWidth: 1,
        borderRadius: 16,
        marginHorizontal: 16,
        marginVertical: 8,
        borderColor: "#ddd",
        backgroundColor: "#fdfdfd",
        elevation: 15,
        shadowColor: "#333333",
        shadowOpacity: 0.5,
        shadowRadius: 2,
        shadowOffset: {
          width: 0.8,
          height: 0.8,
        },
        overflow: "visible",
      }}
    >
      <Text style={[globalStyles.bodyRegular, { flex: 1 }]}>
        {item.task}
        {" ("}
        {item.point_value}
        {" Points)"}
      </Text>
      <TouchableOpacity onPress={() => handleCompleteTask(item.id)}>
        {completedTasks[item.id] || item.is_completed ? (
          <FontAwesome name="check-circle" size={24} color="green" />
        ) : (
          <FontAwesome name="circle-thin" size={24} color="black" />
        )}
      </TouchableOpacity>
    </View>
  );

  const renderApprovalItem = ({ item }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        minWidth: 300,
        borderWidth: 1,
        borderRadius: 16,
        marginHorizontal: 16,
        marginVertical: 8,
        borderColor: "#ddd",
        backgroundColor: "#fdfdfd",
        elevation: 15,
        shadowColor: "#333333",
        shadowOpacity: 0.5,
        shadowRadius: 2,
        shadowOffset: {
          width: 0.8,
          height: 0.8,
        },
        overflow: "visible",
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={[globalStyles.bodyRegular]}>
          {item.task} ({item.point_value} Points)
        </Text>
        <Text style={[globalStyles.bodyRegular]}>{item.username}</Text>
      </View>
      <TouchableOpacity onPress={() => handleApproveTask(item.id)}>
        {approvedTasks[item.id] || item.is_approved ? (
          <FontAwesome name="check-circle" size={24} color="purple" />
        ) : (
          <FontAwesome name="circle-thin" size={24} color="black" />
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <View
      style={{
        flex: 1,
        paddingTop: 8,
        backgroundColor: "#fdfdfd",
      }}
    >
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <Text>Your Expo push token: {expoPushToken}</Text>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Text>
         Title: {notification && notification.request.content.title}{" "}
          </Text>
          <Text>Body: {notification && notification.request.content.body}</Text>
          <Text>
            Data:{" "}
            {notification && JSON.stringify(notification.request.content.data)}
          </Text>
        </View>
        <Button
          title="Press to Send Notification"
          onPress={async () => {
            console.log("Sending notification");
            await sendPushNotification(expoPushToken);
          }}
        />
      </View>
      {/* <FlatList
        ListHeaderComponent={() => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={[globalStyles.h3HeadingRegular, { marginLeft: 24 }]}>
              My Tasks
            </Text>
            <Text style={[globalStyles.h3HeadingRegular, { marginRight: 24 }]}>
              Completed?
            </Text>
          </View>
        )}
        data={groupTasks}
        renderItem={renderCompletionItem}
        keyExtractor={(item) => item.id}
        style={{ height: Dimensions.get("window").height * 0.3 }}
      />
      {myIsAdmin == "true" && (
        <FlatList
          ListHeaderComponent={() => (
            <View>
              {completedTasksList.length > 0 && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: "3%",
                  }}
                >
                  <Text
                    style={[globalStyles.h3HeadingRegular, { marginLeft: 24 }]}
                  >
                    Completed
                  </Text>
                  <Text
                    style={[globalStyles.h3HeadingRegular, { marginRight: 24 }]}
                  >
                    Approved?
                  </Text>
                </View>
              )}
            </View>
          )}
          data={completedTasksList}
          renderItem={renderApprovalItem}
          keyExtractor={(item) => item.id}
          style={{ height: Dimensions.get("window").height * 0.3 }}
        />
      )}
      {myIsAdmin == "true" && (
        <FlatList
          ListHeaderComponent={() => (
            <View>
              {notCompletedTasksList.length > 0 && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: "3%",
                  }}
                >
                  <Text
                    style={[globalStyles.h3HeadingRegular, { marginLeft: 24 }]}
                  >
                    Not Completed
                  </Text>
                  <Text
                    style={[globalStyles.h3HeadingRegular, { marginRight: 24 }]}
                  >
                    Approved?
                  </Text>
                </View>
              )}
            </View>
          )}
          data={notCompletedTasksList}
          renderItem={renderApprovalItem}
          keyExtractor={(item) => item.id}
          style={{ height: Dimensions.get("window").height * 0.3 }}
        /> */}
      {/* )} */}
    </View>
  );
}
