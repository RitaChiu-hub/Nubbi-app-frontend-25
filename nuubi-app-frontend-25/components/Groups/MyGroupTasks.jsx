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
import socket from "../../socket";
import { globalStyles } from "../../styles/global";
import { useIsFocused } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons"; // Assuming you're using Expo and have installed @expo/vector-icons

export default function MyGroupTasks({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const isFocused = useIsFocused();
  const [error, setError] = React.useState(null);
  const [groupTasks, setGroupTasks] = React.useState({});
  const [selectedTab, setSelectedTab] = React.useState("Groups");

  const screenWidth = Dimensions.get("window").width;

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

  React.useEffect(() => {
    getGroupTasks();
  }, []);

  const renderItem = ({ item }) => (
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
      <Text style={[globalStyles.bodyRegular, { flex: 1 }]}>{item.task}</Text>
      {item.is_completed ? (
        <FontAwesome name="check-circle" size={24} color="green" />
      ) : (
        <FontAwesome name="circle-thin" size={24} color="black" />
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
      <FlatList
        data={groupTasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.groupTasks_id}
      />
    </View>
  );
}
