import * as React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { globalStyles } from "../../styles/global";

export default function AddGroupScreen({ navigation }) {

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.screenHeader}>Add Group</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <ScrollView style={{ backgroundColor: "#fdfdfd" }}>
      <View
        style={{
          flex: 1,
          backgroundColor: "#fdfdfd",
          alignItems: "center",
          marginTop: 40,
          padding: 20,
          justifyContent: "center",
        }}
      >
        <TouchableOpacity
          style={globalStyles.loginButton}
          onPress={() => {
            navigation.navigate("JoinGroup");
          }}
        >
          <Text style={globalStyles.primaryButtonText}>
            Join Private Group
          </Text>
        </TouchableOpacity>
        <View style={{ padding: 10 }}></View>
        <TouchableOpacity
          style={globalStyles.loginButton}
          onPress={() => {
            navigation.navigate("CreateGroup");
          }}
        >
          <Text style={globalStyles.primaryButtonText}>Create New Group</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
