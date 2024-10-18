import * as React from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Platform,
  Modal,
  StyleSheet,
} from "react-native";
import { AccountContext } from "../AccountContext";
import socket from "../../socket";
import { globalStyles } from "../../styles/global";
import { useIsFocused } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";

export default function MyGroupsScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const isFocused = useIsFocused();
  const [error, setError] = React.useState(null);
  const [groups, setGroups] = React.useState([]);
  const [selectedTab, setSelectedTab] = React.useState("Groups");
  const [modalVisible, setModalVisible] = React.useState(false);

  const screenWidth = Dimensions.get("window").width;

  const getGroups = async () => {
    const token =
      Platform.OS !== "web" ? await SecureStore.getItemAsync("token") : null;

    try {
      const response = await fetch(`https://coral-app-n96bn.ondigitalocean.app/groups/mygroups`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ ...user }),
      });
      const jsonData = await response.json();
      setGroups(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  React.useEffect(() => {
    getGroups();
  }, [isFocused]);

  React.useEffect(() => {
    setSelectedTab("Groups");
  }, [user]);

  const Item = ({ title, description, id, invitePasscode }) => (
    <View>
      <TouchableOpacity
        style={styles.groupItem}
        onPress={() => {
          setUser({
            ...user,
            currentGroup: id,
            groupName: title,
            invitePasscode: invitePasscode,
          });
          // navigation.navigate("Group Chat");
          // navigation.navigate("Group Tabs");
          navigation.navigate("Group Tabs", { groupName: title });
          if (Platform.OS === "web") {
            sessionStorage.setItem(
              "context",
              JSON.stringify({
                ...user,
                currentGroup: id,
                groupName: title,
                invitePasscode: invitePasscode,
              })
            );
          }
        }}
      >
        <Text style={globalStyles.h3HeadingRegular}>{title}</Text>
        <Text style={globalStyles.bodyRegular}>{description}</Text>
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
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingWhite}>My Groups</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <View style={{ flex: 1, paddingTop: 8, backgroundColor: "#fbfbfb" }}>
      <FlatList
        data={groups}
        renderItem={renderItem}
        keyExtractor={(item) => item.group_id}
        style={{ flex: 1 }}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={globalStyles.primaryButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={globalStyles.primaryButtonText}>
            Join or Create Group
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={globalStyles.centeredView}>
          <View style={globalStyles.modalView}>
            <TouchableOpacity
              style={[
                globalStyles.modalButton,
                { backgroundColor: "#2482AA", width: "100%", minWidth: 240 },
              ]}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("CreateGroup");
              }}
            >
              <Text
                style={[
                  globalStyles.primaryButtonText,
                  { textAlign: "center" },
                ]}
              >
                Create New Group
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                globalStyles.modalButton,
                {
                  backgroundColor: "#2482AA",
                  width: "100%",
                  minWidth: 240,
                  marginVertical: 10,
                },
              ]}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("JoinGroup");
              }}
            >
              <Text
                style={[
                  globalStyles.primaryButtonText,
                  { textAlign: "center" },
                ]}
              >
                Join Private Group
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                globalStyles.modalButton,
                {
                  backgroundColor: "#2482AA",
                  width: "100%",
                  minWidth: 240,
                  marginBottom: 10,
                },
              ]}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("ViewAllGroups");
              }}
            >
              <Text
                style={[
                  globalStyles.primaryButtonText,
                  { textAlign: "center" },
                ]}
              >
                Discover Public Groups
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                globalStyles.modalButton,
                { backgroundColor: "#f00", width: "100%", minWidth: 240 },
              ]}
              onPress={() => setModalVisible(false)}
            >
              <Text
                style={[
                  globalStyles.primaryButtonText,
                  { textAlign: "center" },
                ]}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  groupItem: {
    alignItems: "flex-start",
    justifyContent: "center",
    padding: 16,
    minWidth: 300,
    borderWidth: 1,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderColor: "#ddd",
    backgroundColor: "#fbfbfb",
    elevation: 15,
    shadowColor: "#333333",
    shadowOpacity: 0.5,
    shadowRadius: 2,
    shadowOffset: {
      width: 0.8,
      height: 0.8,
    },
  },
  buttonContainer: {
    backgroundColor: "#fbfbfb",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
});

// import * as React from "react";
// import {
//   Text,
//   View,
//   FlatList,
//   TouchableOpacity,
//   Dimensions,
//   Platform,
// } from "react-native";
// import { AccountContext } from "../AccountContext";
// import socket from "../../socket";
// import { globalStyles } from "../../styles/global";
// import { useIsFocused } from "@react-navigation/native";
// import * as SecureStore from "expo-secure-store";

// export default function MyGroupsScreen({ navigation }) {
//   const { user, setUser } = React.useContext(AccountContext);
//   const isFocused = useIsFocused();
//   const [error, setError] = React.useState(null);
//   const [groups, setGroups] = React.useState([]);
//   const [selectedTab, setSelectedTab] = React.useState("Groups");

//   const screenWidth = Dimensions.get("window").width;
//   const deviceWidth = Dimensions.get("window").width;

//   // if (user.token != null && user.token != "undefined") {
//   //   React.useEffect(() => {
//   //     socket.connect();
//   //   }, []);
//   // } else {
//   //   socket.disconnect();
//   // }

//   const getGroups = async () => {
//     const token =
//       Platform.OS !== "web" ? await SecureStore.getItemAsync("token") : null; // Get token only on mobile

//     try {
//       const response = await fetch(
//         `https://coral-app-n96bn.ondigitalocean.app/groups/mygroups`,
//         {
//           method: "POST",
//           credentials: "include",
//           headers: {
//             "Content-Type": "application/json",
//             ...(token ? { Authorization: `Bearer ${token}` } : {}),
//           },
//           body: JSON.stringify({ ...user }),
//         }
//       );
//       const jsonData = await response.json();
//       setGroups(jsonData);
//     } catch (err) {
//       console.error(err.message);
//     }
//   };

//   React.useEffect(() => {
//     getGroups();
//   }, [isFocused]);

//   React.useEffect(() => {
//     setSelectedTab("Groups");
//   }, [user]);

//   const Item = ({ title, description, id, invitePasscode }) => (
//     <View>
//       <TouchableOpacity
//         style={{
//           alignItems: "flex-start",
//           justifyContent: "center",
//           padding: 16,
//           minWidth: 300,
//           borderWidth: 1,
//           borderRadius: 16,
//           marginHorizontal: 16,
//           marginVertical: 8,
//           borderColor: "#ddd",
//           backgroundColor: "#fbfbfb",
//           elevation: 15,
//           shadowColor: "#333333",
//           shadowOpacity: 0.5,
//           shadowRadius: 2,
//           shadowOffset: {
//             width: 0.8,
//             height: 0.8,
//           },
//           overflow: "visible",
//         }}
//         onPress={() => {
//           setUser({
//             ...user,
//             currentGroup: id,
//             groupName: title,
//             invitePasscode: invitePasscode,
//           });
//           navigation.navigate("Group Chat");
//           if (Platform.OS === "web") {
//             sessionStorage.setItem(
//               "context",
//               JSON.stringify({
//                 ...user,
//                 currentGroup: id,
//                 groupName: title,
//                 invitePasscode: invitePasscode,
//               })
//             );
//           }
//         }}
//       >
//         <Text style={globalStyles.h3HeadingRegular}>{title}</Text>
//         <Text style={globalStyles.bodyRegular}>{description}</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   const renderItem = ({ item }) => (
//     <Item
//       title={item.name}
//       description={item.description}
//       id={item.group_id}
//       invitePasscode={item.invite_passcode}
//     />
//   );

//   React.useLayoutEffect(() => {
//     navigation.setOptions({
//       headerTitle: () => (
//         <Text style={globalStyles.h3HeadingWhite}>My Groups</Text>
//       ),
//       headerTitleAlign: "center",
//     });
//   }, [navigation]);

//   return (
//     <View
//       style={{
//         flex: 1,
//         paddingTop: 8,
//         backgroundColor: "#fbfbfb",
//       }}
//     >
//       <FlatList
//         data={groups}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.group_id}
//         style={{ flex: 1 }}
//       />
//       <View
//         style={{
//           backgroundColor: "#fbfbfb",
//           alignItems: "center",
//           justifyContent: "center",
//           padding: 10,
//         }}
//       >
//         {Platform.OS === "web" ? (
//           <View style={globalStyles.buttonContainer}>
//             <TouchableOpacity
//               style={{
//                 paddingVertical: 18,
//                 paddingHorizontal: 30,
//                 borderRadius: 60,
//                 elevation: 3,
//                 backgroundColor: "#2482AA",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 width: "30%",
//               }}
//               onPress={() => {
//                 navigation.navigate("CreateGroup");
//               }}
//             >
//               <Text style={globalStyles.primaryButtonText}>
//                 Create New Group
//               </Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={{
//                 paddingVertical: 18,
//                 paddingHorizontal: 30,
//                 borderRadius: 60,
//                 elevation: 3,
//                 backgroundColor: "#2482AA",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 width: "30%",
//               }}
//               onPress={() => {
//                 navigation.navigate("JoinGroup");
//               }}
//             >
//               <Text style={globalStyles.primaryButtonText}>
//                 Join Private Group
//               </Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={{
//                 paddingVertical: 18,
//                 paddingHorizontal: 30,
//                 borderRadius: 60,
//                 elevation: 3,
//                 backgroundColor: "#2482AA",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 width: "30%",
//               }}
//               onPress={() => {
//                 navigation.navigate("ViewAllGroups");
//               }}
//             >
//               <Text style={globalStyles.primaryButtonText}>
//                 Join Public Group
//               </Text>
//             </TouchableOpacity>
//           </View>
//         ) : (
//           <TouchableOpacity
//             style={globalStyles.primaryButton}
//             onPress={() => {
//               navigation.navigate("AddGroup");
//             }}
//           >
//             <Text style={globalStyles.primaryButtonText}>
//               Join or Create Group
//             </Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     </View>
//   );
// }
