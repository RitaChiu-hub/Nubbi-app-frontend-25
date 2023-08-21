import * as React from "react";
import {
  TextInput,
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Keyboard,
  Platform,
  Image,
  PixelRatio,
  StyleSheet,
  Button,
} from "react-native";
import { Formik, ErrorMessage } from "formik";
import { globalStyles } from "../../styles/global";
import { AccountContext } from "../AccountContext";
import * as SecureStore from "expo-secure-store";
import * as ImagePicker from "expo-image-picker";
const { createPostSchema } = require("../validationSchema");

const cloudName = "dvvdc9evd";
const apiKey = "971765162862783";
const uploadPreset = "msuif5u0";
const cloudinaryBaseUrl = `https://api.cloudinary.com/v1_1/${cloudName}/document/postimages`;

export default function CreatePostScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);
  const [pickedImage, setPickedImage] = React.useState(null);
  const [imageUploadInfo, setImageUploadInfo] = React.useState(null);

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

  const resetApp = () => {
    setPickedImage(null);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "Create Post",
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
          paddingTop: 20,
        }}
      >
        <View
          style={{
            marginTop: StatusBar.currentHeight || 15,
            marginBottom: 10,
            minWidth: 300,
            marginBottom: Platform.OS === "android" ? 100 : 400,
          }}
        >
          <Formik
            initialValues={{ title: "", body_text: "" }}
            validationSchema={createPostSchema}
            onSubmit={(values, actions) => {
              const vals = { ...values };
              actions.resetForm();
              fetch(
                `https://coral-app-n96bn.ondigitalocean.app/groups/${user.currentGroup}/createpost`,
                {
                  method: "POST",
                  credentials: "include",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ ...user, ...vals }),
                }
              )
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
                  } else if (data.loggedIn) {
                    SecureStore.setItemAsync("token", data.token);
                  }
                });
            }}
          >
            {(props) => (
              <View>
                <Text
                  style={{
                    color: "red",
                    textAlign: "center",
                  }}
                >
                  {error}
                </Text>
                <Text>Post Title</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: "#ddd",
                    padding: 10,
                    fontSize: 18,
                    borderRadius: 6,
                    width: "100%",
                    alignItems: "stretch",
                  }}
                  placeholder="Enter post title"
                  onChangeText={props.handleChange("title")}
                  value={props.values.title}
                  onBlur={Keyboard.dismiss}
                />
                <View style={{ marginVertical: 5 }}></View>
                <Text
                  style={{
                    color: "red",
                    textAlign: "center",
                  }}
                >
                  <ErrorMessage name="title" />
                </Text>
                <Text>Post</Text>
                <View
                  style={{
                    borderRadius: 6,
                    borderWidth: 1,
                    borderColor: "#ddd",
                    alignItems: "center",
                  }}
                >
                  <TextInput
                    style={{
                      padding: 10,
                      fontSize: 18,
                      width: "100%",
                      height: 250,
                      alignItems: "stretch",
                      textAlignVertical: "top",
                      marginBottom: 5,
                    }}
                    multiline={true}
                    placeholder="Enter text"
                    onChangeText={props.handleChange("body_text")}
                    value={props.values.body_text}
                    onBlur={Keyboard.dismiss}
                  />
                  {pickedImage && (
                    <Image
                      source={{ uri: pickedImage.uri }}
                      style={styles.ImageContainer}
                    />
                  )}

                  {pickedImage === null ? (
                    <Button title="Pick Image" onPress={pickImage} />
                  ) : null}
                </View>
                <Text
                  style={{
                    color: "red",
                    textAlign: "center",
                  }}
                >
                  <ErrorMessage name="body_text" />
                </Text>
                <View style={{ marginVertical: 10 }}></View>
                <TouchableOpacity
                  style={globalStyles.primaryButton}
                  onPress={props.handleSubmit}
                >
                  <Text style={globalStyles.primaryButtonText}>
                    Create Post
                  </Text>
                </TouchableOpacity>
                {pickedImage !== null ? (
                  <Button title="Clear Selected Image" onPress={resetApp} />
                ) : null}
              </View>
            )}
          </Formik>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
    padding: 8,
    alignItems: "center",
  },
  readyText: {
    marginTop: 20,
    textAlign: "center",
  },
  image: {
    width: 300,
    height: 300,
  },
  ImageContainer: {
    borderRadius: 10,
    width: 250,
    height: 250,
    borderColor: "#9B9B9B",
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#CDDC39",
  },
});
