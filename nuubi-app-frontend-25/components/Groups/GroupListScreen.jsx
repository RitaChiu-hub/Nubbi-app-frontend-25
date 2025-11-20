import * as React from "react";
import { API_URL } from "../../config";
import { apiFetch } from "../../api/api";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Platform,
} from "react-native";
import { Formik, ErrorMessage } from "formik";
import { globalStyles } from "../../styles/global";
const { formSchema } = require("../validationSchema");
import { AccountContext } from "../AccountContext";
import * as SecureStore from "expo-secure-store";

export default function GroupListScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);
  const [groups, setGroups] = React.useState([]);
  const screenWidth = Dimensions.get("window").width;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingWhite}>Discover Public Groups</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  const getGroups = async () => {
    try {
      const data = await fetch(`${API_URL}/groups/getpublicgroups`, {
        method: "POST",
        credentials: "include",
      });

      if (!data) return;

      setGroups(data);
    }

    catch (err) {
      console.error("getGroups error", err.message);
    }
  };

  React.useEffect(() => {
    getGroups();
  }, []);

  const Item = ({ title, description, id }) => (
    <View>
      <TouchableOpacity
        style={{
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
          overflow: "visible",
        }}
        onPress={async () => {
          setUser({ ...user, currentGroup: id, groupName: title }),
            //  navigation.navigate("Group Chat");
            navigation.navigate("Group Tabs", { groupName: title });
          const joinGroupId = id;
          const token =
            Platform.OS !== "web"
              ? await SecureStore.getItemAsync("token")
              : null; // Get token only on mobile


          try {
            const data = await fetch(`${API_URL}/groups/joingroup`, {
              method: "POST",
              credentials: "include",
              body: JSON.stringify({ ...user, joinGroupId, currentGroup: id, groupName: title,}), 
              headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
            });

            if (!data) return;

            setUser({ ...data });

            if (data.status) {
              setError(data.status);
            }
          }
          catch (err) {
            console.error("GroupListScreen.jsx - Item error", err.message);
          }
        }}
      >
        <View>
          <Text
            style={[globalStyles.h3HeadingRegular, { alignSelf: "flex-start" }]}
          >
            {title}
          </Text>
          <Text style={globalStyles.bodyRegular}>{description}</Text>
        </View>

        <View
          style={{
            paddingVertical: 14,
            paddingHorizontal: 30,
            borderRadius: 60,
            elevation: 3,
            backgroundColor: "#2482AA",
            alignSelf: "flex-end",
          }}
        >
          <Text style={globalStyles.primaryButtonText}>Join</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => (
    <Item title={item.name} description={item.description} id={item.id} />
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "Discover Public Groups",
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <View
      style={{
        flex: 1,
        paddingTop: 8,
        backgroundColor: "#fbfbfb",
        overflow: "hidden",
        width: "100%",
      }}
    >
      {/* <View
        style={{
          width: "100%",
        }}
      > */}
      <FlatList
        data={groups}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={true}
      />
    </View>
    // </View>
  );
}
