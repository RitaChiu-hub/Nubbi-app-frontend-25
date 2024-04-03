import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  Image,
  Dimensions,
} from "react-native";
import { AccountContext } from "../AccountContext";
import FeatherIcon from "@expo/vector-icons/Feather";
import { globalStyles } from "../../styles/global";
import { useIsFocused } from "@react-navigation/native";

export default function GroupAnalytics({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [value, setValue] = useState(0);
  const [memberCount, setMemberCount] = React.useState(0);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [groupTitle, setGroupTitle] = React.useState(user.groupName);
  const [members, setMembers] = React.useState([user.members]);
  const [invitePasscode, setInvitePasscode] = React.useState(user.inviteCode);
  const [selectedTab, setSelectedTab] = React.useState("Group");
  const screenWidth = Dimensions.get("window").width;
  const isFocused = useIsFocused();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.screenHeader}>Group Analytics</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={{ uri: "https://via.placeholder.com/140" }}
            style={styles.groupPhoto}
          />

          <Text style={styles.title}>{groupTitle}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: "#ffffff",
    },
    container: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 12,
      marginTop: 10,
      marginBottom: 10,
    },
    header: {
      marginBottom: 12,
      alignItems: "center",
    },
    groupPhoto: {
      width: 140,
      height: 140,
      borderRadius: 75,
      marginBottom: 12,
    },
    title: {
      fontSize: 24,
      fontWeight: "700",
      color: "#1d1d1d",
      marginBottom: 6,
      fontFamily: "Poppins_400Regular",
    },
    subtitle: {
      fontSize: 15,
      fontFamily: "Poppins_400Regular",
      fontWeight: "500",
      color: "#929292",
    },
    passcodeLabel: {
      fontFamily: "Poppins_500Medium",
      fontSize: 16,
      color: "#333",
    },
    tabs: {
      flexDirection: "row",
      backgroundColor: "#fff",
      marginBottom: 12,
    },
    tab: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 10,
      paddingBottom: 10,
      paddingHorizontal: 20,
      borderBottomWidth: 2,
      borderColor: "#e5e7eb",
    },
    activeTab: {
      borderBottomColor: "#33b7f0",
    },
    tabText: {
      fontSize: 16,
      fontFamily: "Poppins_400Regular",
      fontWeight: "600",
      color: "#6b7280",
      marginLeft: 5,
    },
    tabIcon: {
      color: "#6b7280",
    },
    activeTabIcon: {
      color: "#33b7f0",
    },
    activeTabText: {
      color: "#33b7f0",
    },
    label: {
      fontSize: 16,
      fontFamily: "Poppins_400Regular",
      fontWeight: "500",
      marginBottom: 10,
    },
    member: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottomWidth: 1,
      borderColor: "#ccc",
      paddingVertical: 10,
    },
    memberText: {
      fontSize: 16,
      fontFamily: "Poppins_400Regular",
      fontWeight: "500",
      marginRight: 10,
      color: "#333",
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22,
    },
    modalView: {
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      elevation: 5,
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center",
    },
    modalButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
    },
    modalButton: {
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 10,
      elevation: 2,
      marginBottom: 10,
    },
    buttonText: {
      color: "white",
      fontWeight: "bold",
      fontFamily: "Poppins_400Regular",
      textAlign: "center",
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottomWidth: 1,
      borderColor: "#ccc",
      paddingVertical: 10,
    },
    rowLabel: {
      fontFamily: "Poppins_400Regular",
      fontSize: 16,
      fontWeight: "500",
      color: "#333",
    },
  });