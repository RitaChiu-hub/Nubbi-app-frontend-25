import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
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
            });
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
        backgroundColor: "#fdfdfd",
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
