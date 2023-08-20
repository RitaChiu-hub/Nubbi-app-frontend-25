import * as React from "react";
import {
  Text,
  View,
  Modal,
  Alert,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { AccountContext } from "./AccountContext";
import socket from "../socket";
import { globalStyles } from "../styles/global";
import * as SecureStore from "expo-secure-store";
import Icon from "react-native-vector-icons/Ionicons";

export default function HomeScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);
  const [groups, setGroups] = React.useState([]);
  const [modalVisible, setModalVisible] = React.useState(false);

  if (user.loggedIn === true) {
    React.useEffect(() => {
      socket.connect();
    }, []);
  } else {
    socket.disconnect();
  }

  const getGroups = async () => {
    try {
      const response = await fetch(
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
    //}, [groups]);
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
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={() => navigation.navigate("HelpLoggedIn")}>
            <Icon name="help-circle-outline" size={30} color="#228ee7" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
            }}
          >
            <Icon
              name="add-circle-outline"
              size={30}
              color="#228ee7"
              style={{ paddingHorizontal: 5 }}
            />
          </TouchableOpacity>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
          <Icon
            name="settings-outline"
            size={30}
            color="#228ee7"
            style={{ paddingLeft: 10 }}
          />
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
              tap the settings{" "}
              <Icon
                name="settings-outline"
                size={18}
                color="#228ee7"
                style={{ paddingLeft: 10 }}
              />{" "}
              icon in the top left corner.
            </Text>
            <View style={{ paddingVertical: 10 }}></View>
            <Text style={{ textAlign: "center", fontSize: 16 }}>
              Questions? Tap the{" "}
              <Icon
                name="help-circle-outline"
                size={18}
                color="#228ee7"
                style={{ paddingLeft: 10 }}
              />{" "}
              icon in the top right corner.
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

      <View style={globalStyles.bottomView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <View style={globalStyles.centeredView}>
            <View style={globalStyles.modalView}>
              <TouchableOpacity
                style={globalStyles.secondaryButton}
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate("CreateGroup");
                }}
              >
                <Text style={globalStyles.secondaryButtonText}>
                  Create new group
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={globalStyles.secondaryButton}
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate("ViewAllGroups");
                }}
              >
                <Text style={globalStyles.secondaryButtonText}>
                  Discover public groups
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={globalStyles.secondaryButton}
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate("JoinGroup");
                }}
              >
                <Text style={globalStyles.secondaryButtonText}>
                  Join group with passcode
                </Text>
              </TouchableOpacity>
              <View style={{ marginVertical: 10 }}></View>

              <TouchableOpacity
                style={globalStyles.secondaryButton}
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                <Text style={globalStyles.secondaryButtonText}>
                  {"< "} Back
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}
