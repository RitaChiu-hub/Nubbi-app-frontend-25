import * as React from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { AccountContext } from "../AccountContext";
import { globalStyles } from "../../styles/global";
import { useIsFocused } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons"; // Assuming you're using Expo and have installed @expo/vector-icons

export default function MyGroupTasks({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const isFocused = useIsFocused();
  const [error, setError] = React.useState(null);
  const [groupTasks, setGroupTasks] = React.useState([]);
  const [allGroupTasks, setAllGroupTasks] = React.useState([]);
  const [selectedTab, setSelectedTab] = React.useState("Groups");
  const [completedTasks, setCompletedTasks] = React.useState({}); // State to track completed tasks
  const [approvedTasks, setApprovedTasks] = React.useState({}); // State to track completed tasks

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
        `http://localhost:8080/groups/mygrouptasks`,
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
        `http://localhost:8080/groups/allgrouptasks`,
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

  React.useEffect(() => {
    myIsAdmin != "true" ? getGroupTasks() : getAllGroupTasks();
  }, []);

  const handleCompleteTask = (taskId) => {
    if (!completedTasks[taskId]) {
      setCompletedTasks((prevCompletedTasks) => ({
        ...prevCompletedTasks,
        [taskId]: true,
      }));

      fetch(
        //  "https://coral-app-n96bn.ondigitalocean.app/groups/createtask",
        "http://localhost:8080/groups/taskcompleted",
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
        "http://localhost:8080/groups/taskapproved",
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

  const renderItem = ({ item }) => (
    <View>
      {myIsAdmin != "true" && (
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
      )}
      {myIsAdmin == "true" && (
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
          {/* Change the is_approved to true for the approved tasks in the database (backend api)  */}
          {/* in the same api, add the points to the user points database and send the user a notification  */}
          <TouchableOpacity onPress={() => handleApproveTask(item.id)}>
            {approvedTasks[item.id] || item.is_approved ? (
              <FontAwesome name="check-circle" size={24} color="purple" />
            ) : (
              <FontAwesome name="circle-thin" size={24} color="black" />
            )}
          </TouchableOpacity>
        </View>
      )}
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
      {/* Conditionally render the data depending on whether the user is the admin or not  */}

      {myIsAdmin != "true" && (
        <FlatList
          data={groupTasks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}
      {myIsAdmin == "true" && (
        <View>
          <FlatList
            ListHeaderComponent={() => (
              <View>
                {completedTasksList.length > 0 && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={[
                        globalStyles.h3HeadingRegular,
                        { marginLeft: 24 },
                      ]}
                    >
                      Completed
                    </Text>
                    <Text
                      style={[
                        globalStyles.h3HeadingRegular,
                        { marginRight: 24 },
                      ]}
                    >
                      Approved?
                    </Text>
                  </View>
                )}
              </View>
            )}
            data={completedTasksList}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
          <FlatList
            ListHeaderComponent={() => (
              <View>
                {notCompletedTasksList.length > 0 && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={[
                        globalStyles.h3HeadingRegular,
                        { marginLeft: 24 },
                      ]}
                    >
                      Not Completed
                    </Text>
                    <Text
                      style={[
                        globalStyles.h3HeadingRegular,
                        { marginRight: 24 },
                      ]}
                    >
                      Approved?
                    </Text>
                  </View>
                )}
              </View>
            )}
            data={notCompletedTasksList}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </View>
      )}
    </View>
  );
}
