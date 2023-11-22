import * as React from "react";
import {
  Button,
  TextInput,
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
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

  const getGroups = async () => {
    try {
      const response = await fetch(
        "https://coral-app-n96bn.ondigitalocean.app/groups/getpublicgroups",
        {
          credentials: "include",
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
  }, []);

  const Item = ({ title, description, id }) => (
    <View
      style={{
        paddingHorizontal: 5,
        paddingTop: 10,
        backgroundColor: "#f1f1f1",
      }}
    >
      <TouchableOpacity
        style={{
          paddingVertical: 10,
          paddingHorizontal: 10,
          width: "100%",
          minWidth: 200,
          borderWidth: 1,
          borderRadius: 6,

          borderColor: "#ddd",
          backgroundColor: "#fdfdfd",
        }}
        onPress={() => {
          setUser({ ...user, currentGroup: id, groupName: title }),
            navigation.navigate("Group Chat");
          const joinGroupId = id;
          fetch("https://coral-app-n96bn.ondigitalocean.app/groups/joingroup", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...user,
              joinGroupId,
              currentGroup: id,
              groupName: title,
            }),
          })
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
              console.log(data);
              setUser({ ...data });
              if (data.status) {
                setError(data.status);
              }
              // else if (data.loggedIn) {
              //   SecureStore.setItemAsync("token", data.token);
              // }
            });
        }}
      >
        <View>
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
        </View>
        <View>
          <Text
            style={{ color: "#228ee7", fontSize: 18, alignSelf: "flex-end" }}
          >
            Join
          </Text>
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
        marginHorizontal: 10,
      }}
    >
      <View
        style={{
          width: "100%",
        }}
      >
        <FlatList
          data={groups}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
}
