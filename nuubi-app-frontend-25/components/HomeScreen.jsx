import * as React from "react";
import { Text, View, Modal, FlatList, TouchableOpacity } from "react-native";
import { AccountContext } from "./AccountContext";
import socket from "../socket";
import { globalStyles } from "../styles/global";
import * as SecureStore from "expo-secure-store";
import Icon from "react-native-vector-icons/Ionicons";

export default function HomeScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);
  const [groups, setGroups] = React.useState([]);

  if (user.loggedIn === true) {
    React.useEffect(() => {
      socket.connect();
    }, []);
  } else {
    socket.disconnect();
  }

  const getGroups = async () => {
    console.log("my groups loading");
    try {
      const response = await fetch(
        //   `https://coral-app-n96bn.ondigitalocean.app/groups/mygroups`,
        `https://coral-app-n96bn.ondigitalocean.app/groups/mygroups`,
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

      setGroups(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  React.useEffect(() => {
    getGroups();
  }, [user]);

  const Item = ({ title, description, id, invitePasscode }) => (
    <View>
      <TouchableOpacity
        style={{
          alignItems: "flex-start",
          justifyContent: "center",
          paddingVertical: 10,
          paddingHorizontal: 10,
          width: "100%",
          minWidth: 300,
          borderWidth: 1,
          borderRadius: 6,
          marginBottom: 10,
          borderColor: "#ddd",
          backgroundColor: "#fdfdfd",
        }}
        onPress={() => {
          setUser({
            ...user,
            currentGroup: id,
            groupName: title,
            invitePasscode: invitePasscode,
          }),
            navigation.navigate("Group Chat");
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "#333",
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "normal",
            color: "#333",
          }}
        >
          {description}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => (
    <Item
      title={item.name}
      description={item.description}
      id={item.group_id}
      invitePasscode={item.invite_passcode}
    />
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "My Groups",
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <View
      style={{
        flex: 1,
        marginHorizontal: 10,
        marginTop: 10,
      }}
    >
      <View style={{ backgroundColor: "#f1f1f1", width: "100%" }}>
        <FlatList
          data={groups}
          renderItem={renderItem}
          keyExtractor={(item) => item.group_id}
        />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={user.firstSignIn === true}
        onRequestClose={() => {
          setUser({
            ...user,
            firstSignIn: false,
          });
          console.log({ ...user });
        }}
      >
        <View style={globalStyles.centeredView}>
          <View style={globalStyles.modalView}>
            <Text
              style={{
                textAlign: "center",
                fontSize: 16,
              }}
            >
              Welcome to Nuubi! Your username is {user.username}. To change it,
              tap the settings icon{" "}
              <Icon name="settings-outline" size={18} color="#228ee7" /> in the
              bottom navigation bar.
            </Text>
            <View style={{ paddingVertical: 10 }}></View>
            <Text style={{ textAlign: "center", fontSize: 16 }}>
              Questions? In settings, click on "Help".
            </Text>
            <View style={{ paddingVertical: 10 }}></View>
            <TouchableOpacity
              style={globalStyles.secondaryButton}
              onPress={() => {
                setUser({
                  ...user,
                  firstSignIn: false,
                });
                console.log({ ...user });
              }}
            >
              <Text style={globalStyles.secondaryButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
