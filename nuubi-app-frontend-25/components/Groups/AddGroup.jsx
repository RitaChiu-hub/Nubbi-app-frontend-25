import * as React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { globalStyles } from "../../styles/global";

export default function AddGroupScreen({ navigation }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "Add Group",
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
        }}
      >
        <TouchableOpacity
          style={globalStyles.secondaryButton}
          onPress={() => {
            navigation.navigate("JoinGroup");
          }}
        >
          <Text style={globalStyles.secondaryButtonText}>
            Join Group With Passcode
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={globalStyles.secondaryButton}
          onPress={() => {
            navigation.navigate("CreateGroup");
          }}
        >
          <Text style={globalStyles.secondaryButtonText}>Create New Group</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
