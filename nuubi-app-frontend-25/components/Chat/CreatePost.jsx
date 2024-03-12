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
} from "react-native";
import { Formik, ErrorMessage } from "formik";
import { globalStyles } from "../../styles/global";
import { AccountContext } from "../AccountContext";
import * as SecureStore from "expo-secure-store";
import * as ImagePicker from "expo-image-picker";
const { createPostSchema } = require("../validationSchema");
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

const cloudName = "dvvdc9evd";
const apiKey = "971765162862783";

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
    setImageUploadInfo(null);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.screenHeader}>Create Post</Text>
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
              if (pickedImage !== null) {
                // upload image to cloudinary
                let base64Img = `data:image/jpg;base64,${pickedImage.base64}`;

                //Add your cloud name
                let apiUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

                let data = {
                  file: base64Img,
                  upload_preset: "ehsnm9es",
                  api_key: apiKey,
                };

                fetch(apiUrl, {
                  body: JSON.stringify(data),
                  headers: {
                    "content-type": "application/json",
                  },
                  method: "POST",
                })
                  .then(async (r) => {
                    let data = await r.json();
                    setImageUploadInfo({ ...data });
                    let uploadUrl = data["secure_url"];
                    const vals = { ...values, imageUrl: uploadUrl };
                    fetch(
                      `https://coral-app-n96bn.ondigitalocean.app/groups/${user.currentGroup}/createpost`,
                      //   `https://coral-app-n96bn.ondigitalocean.app/groups/${user.currentGroup}/createpost`,
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
                        //    console.log(data);
                        setUser({ ...data });
                        if (data.status) {
                          setError(data.status);
                        }
                        // else if (data.loggedIn) {
                        //   SecureStore.setItemAsync("token", data.token);
                        // }
                      });
                    return data["secure_url"];
                  })
                  .catch((err) => console.log(err));
              } else {
                const vals = { ...values, imageUrl: null };
                actions.resetForm();
                fetch(
                  `https://coral-app-n96bn.ondigitalocean.app/groups/${user.currentGroup}/createpost`,
                  // `https://coral-app-n96bn.ondigitalocean.app/groups/${user.currentGroup}/createpost`,
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
                    //   console.log(data);
                    setUser({ ...data });
                    if (data.status) {
                      setError(data.status);
                    }
                    // else if (data.loggedIn) {
                    //   SecureStore.setItemAsync("token", data.token);
                    // }
                  });
              }
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
                      height: 200,
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
                  <View>
                    {pickedImage === null ? null : (
                      <Image
                        style={styles.ImageContainer}
                        source={{ uri: pickedImage.uri }}
                      />
                    )}
                  </View>
                </View>
                <Text
                  style={{
                    color: "red",
                    textAlign: "center",
                  }}
                >
                  <ErrorMessage name="body_text" />
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  {pickedImage !== null ? (
                    <TouchableOpacity
                      onPress={resetApp}
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
                      <MaterialIcon
                        name="no-photography"
                        size={30}
                        color="#fdfdfd"
                      />
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
                      <MaterialIcon
                        name="add-a-photo"
                        size={30}
                        color="#fdfdfd"
                      />
                    </TouchableOpacity>
                  )}
                  <View style={{ marginVertical: 10 }}></View>

                  <TouchableOpacity
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      paddingVertical: 14,
                      paddingHorizontal: 20,
                      borderRadius: 12,
                      elevation: 3,
                      backgroundColor: "#1aa7ec",
                      width: "80%",
                    }}
                    onPress={props.handleSubmit}
                  >
                    <Text
                      style={{
                        color: "#fdfdfd",
                        fontSize: 18,
                        fontWeight: "bold",
                      }}
                    >
                      Create Post
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>
        </View>
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
