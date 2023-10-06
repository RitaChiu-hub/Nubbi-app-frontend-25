import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";
import { globalStyles } from "../../styles/global";
import * as ImagePicker from "expo-image-picker";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

export default function ProfilePageScreen({ navigation }) {
  const [pickedImage, setPickedImage] = React.useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setPickedImage({
        uri: result.assets[0].uri,
        base64: result.assets[0].base64,
      });
    }
  };

  const resetImage = () => {
    setPickedImage(null);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "Profile Page",
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
        <View>
          {pickedImage === null ? (
            <Image
              style={styles.ImageContainer}
              source={require("../../assets/defaultAvatar.png")}
            />
          ) : (
            <Image
              style={styles.ImageContainer}
              source={{ uri: pickedImage.uri }}
            />
          )}
        </View>

        {pickedImage !== null ? (
          <TouchableOpacity
            onPress={resetImage}
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 10,
              paddingHorizontal: 12,
              borderRadius: 12,
              elevation: 3,
              backgroundColor: "#1aa7ec",
            }}
          >
            <MaterialIcon name="no-photography" size={30} color="#fdfdfd" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={pickImage}
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 10,
              paddingHorizontal: 12,
              borderRadius: 12,
              elevation: 3,
              backgroundColor: "#1aa7ec",
            }}
          >
            <MaterialIcon name="add-a-photo" size={30} color="#fdfdfd" />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={globalStyles.secondaryButton}
          onPress={() => {
            navigation.navigate("Settings");
          }}
        >
          <Text style={globalStyles.secondaryButtonText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  ImageContainer: {
    borderRadius: 10,
    width: 250,
    height: 250,
    // borderWidth: 1 / PixelRatio.get(),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
});
