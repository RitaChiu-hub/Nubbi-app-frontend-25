import * as React from "react";
import {
  Text,
  View,
  SafeAreaView,
  Modal,
  Alert,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { AccountContext } from "./AccountContext";
import socket from "../socket";
import { globalStyles } from "../styles/global";
const port = process.env.PORT || 4000;

export default function HomeScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);
  const [groups, setGroups] = React.useState([]);
  const [modalVisible, setModalVisible] = React.useState(false);
  const myUsername = user.username;

  if (user.loggedIn === true) {
    React.useEffect(() => {
      socket.connect();
    }, []);
  } else {
    socket.disconnect();
  }

  const signOut = () => {
    SecureStore.deleteItemAsync("userToken");
    setUser({ loggedIn: false });
    socket.disconnect();
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "My groups",
      headerTitleAlign: "center",
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <Text style={{ color: "#228ee7", fontSize: 16 }}>New</Text>
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
          <Text style={{ color: "#228ee7", fontSize: 16 }}>{myUsername}</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View
      style={{
        flex: 1,
        margin: 10,
      }}
    >
      <Text>Welcome</Text>
      <TouchableOpacity style={globalStyles.secondaryButton} onPress={signOut}>
        <Text style={globalStyles.secondaryButtonText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
}
