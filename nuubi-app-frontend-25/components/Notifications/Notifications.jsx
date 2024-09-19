import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StyleSheet,
} from "react-native";
import { globalStyles } from "../../styles/global";
import { useIsFocused } from "@react-navigation/native";
import { AccountContext } from "../AccountContext";
import moment from "moment-timezone";

export default function NotificationsScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);
  const [notifications, setNotifications] = React.useState({
    created_at: "2000-01-01T01:00:00.000000",
  });
  const screenWidth = Dimensions.get("window").width;
  const isFocused = useIsFocused();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingWhite}>Notifications</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  const getNotifications = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/groups/getnotifications",
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

      //  setNotifications(formattedNotifications);
      setNotifications(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  React.useEffect(() => {
    getNotifications();
  }, [isFocused]);

  const getNotificationsRead = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/groups/getnotificationsread",
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
      //  console.log(jsonData);
      setUser({ ...user, notifications: false });
    } catch (err) {
      console.error(err.message);
    }
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      getNotificationsRead();
    }, 10000); // 10 seconds delay

    return () => clearTimeout(timer); // Clear the timer if component unmounts
  }, [isFocused]);

  // React.useEffect(() => {
  //   getNotificationsRead();
  // }, [isFocused]);

  const renderItem = ({ item }) => {
    return (
      <View style={styles.notificationItem}>
        <Text
          style={[
            styles.notificationMessage,
            !item.is_read && styles.unreadNotification,
          ]}
        >
          {item.message}
        </Text>
        <Text style={styles.notificationDate}>
          {moment(item.createdAt).calendar()}
        </Text>
      </View>
    );
  };

  // const renderItem = ({ item }) => {
  //   return (
  //     <View style={styles.notificationItem}>
  //       <Text style={styles.notificationMessage}>{item.message}</Text>
  //       <Text style={styles.notificationDate}>
  //         {moment(item.createdAt).calendar()}
  //       </Text>
  //     </View>
  //   );
  // };

  return (
    <View style={styles.container}>
      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <Text style={globalStyles.bodyRegular}>No notifications yet!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fbfbfb",
  },
  listContent: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  notificationItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    width: Dimensions.get("window").width * 0.9,
  },
  notificationMessage: {
    fontSize: 16,
    color: "#333",
  },
  unreadNotification: {
    fontWeight: "bold",
    padding: 5,
  },
  notificationDate: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },
});
