import * as React from "react";
import {
  Text,
  View,
  SafeAreaView,
  Button,
  Modal,
  Alert,
  TouchableOpacity,
  Platform,
} from "react-native";
import { AccountContext } from "../AccountContext";
import { globalStyles } from "../../styles/global";
import socket from "../../socket";
import * as SecureStore from "expo-secure-store";

export default function SettingsScreen({ navigation }) {
  const [modalVisible, setModalVisible] = React.useState(false);
  const { user, setUser } = React.useContext(AccountContext);
  // const myUsername = user.username;
  const [userPoints, setUserPoints] = React.useState(0);
  const [myUsername, setMyUsername] = React.useState("");

  const getUserPoints = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/groups/getuserpoints`,
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
      setUserPoints(jsonData.userPoints);
      setMyUsername(jsonData.username);
    } catch (err) {
      console.error(err.message);
    }
  };

  React.useEffect(() => {
    getUserPoints();
  }, []);

  const signOut = () => {
    setUser({ token: null });
    if (Platform.OS === "web") {
      localStorage.removeItem("token");
    } else {
      SecureStore.deleteItemAsync("token");
    }
    socket.disconnect();
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "Account & Settings",
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <SafeAreaView style={globalStyles.container}>
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(false);
          }}
        >
          <View style={globalStyles.centeredView}>
            <View style={globalStyles.modalView}>
              <Text style={{ textAlign: "center" }}>
                Are you sure you want to PERMANENTLY delete your account? This
                action cannot be undone.
              </Text>
              <View style={{ marginTop: 10 }}></View>
              <TouchableOpacity
                style={globalStyles.primaryButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={globalStyles.primaryButtonText}>No, go back</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={globalStyles.secondaryButton}
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate("DeleteAccount");
                }}
              >
                <Text
                  style={{
                    color: "red",
                    fontSize: 18,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Yes, I want to delete my account.
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View style={globalStyles.innerContainer}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "#333",
              padding: 20,
              marginLeft: 25,
              marginRight: 25,
              textAlign: "center",
            }}
          >
            Hi {myUsername}!
          </Text>
          <Text>You have {userPoints} total points 🎉</Text>
          <TouchableOpacity
            style={globalStyles.secondaryButton}
            onPress={() => {
              navigation.navigate("ChangeUsernameScreen");
            }}
          >
            <Text style={globalStyles.secondaryButtonText}>
              Change username
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={globalStyles.secondaryButton}
            onPress={() => {
              navigation.navigate("ChangePasswordScreen");
            }}
          >
            <Text style={globalStyles.secondaryButtonText}>
              Change password
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={globalStyles.secondaryButton}
            onPress={() => {
              navigation.navigate("ForgotPassword");
            }}
          >
            <Text style={globalStyles.secondaryButtonText}>
              Forgot password
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={globalStyles.secondaryButton}
            onPress={() => {
              navigation.navigate("HelpLoggedIn");
            }}
          >
            <Text style={globalStyles.secondaryButtonText}>Help</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={globalStyles.secondaryButton}
            onPress={signOut}
          >
            <Text style={globalStyles.secondaryButtonText}>Sign out</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={globalStyles.secondaryButton}
            onPress={() => {
              setModalVisible(true);
            }}
          >
            <Text style={globalStyles.secondaryButtonText}>Delete account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
