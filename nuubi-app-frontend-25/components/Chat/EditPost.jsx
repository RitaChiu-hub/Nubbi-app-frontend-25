import * as React from "react";
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  StatusBar,
  ScrollView,
  Platform,
  Image,
  Dimensions,
} from "react-native";
import { Formik, ErrorMessage } from "formik";
import { globalStyles } from "../../styles/global";
import { AccountContext } from "../AccountContext";
const { createPostSchema } = require("../validationSchema");
import * as ImagePicker from "expo-image-picker";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";

const cloudName = "dvvdc9evd";
const apiKey = "971765162862783";

export default function EditPostScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);
  const [pickedImage, setPickedImage] = React.useState(null);
  const [imageUploadInfo, setImageUploadInfo] = React.useState(null);

  const deviceWidth = Dimensions.get("window").width;

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
      setUser({
        ...user,
        image_url: result.assets[0].uri,
      });
    }
  };

  const resetApp = () => {
    setPickedImage(null);
    setImageUploadInfo(null);
    setUser({
      ...user,
      image_url: null,
    });
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingWhite}>Edit Post</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <ScrollView style={{ backgroundColor: "#fbfbfb" }}>
      <View
        style={{
          flex: 1,
          backgroundColor: "#fbfbfb",
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
            initialValues={{
              title: user.post_title,
              body_text: user.post_body,
            }}
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
                      `https://coral-app-n96bn.ondigitalocean.app/groups/editpost`,

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
                    return data["secure_url"];
                  })
                  .catch((err) => console.log(err));
              } else {
                const vals = { ...values, imageUrl: null };
                actions.resetForm();
                fetch(
                  `https://coral-app-n96bn.ondigitalocean.app/groups/editpost`,
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
                  });
              }
            }}
          >
            {(props) => (
              <View>
                <Text style={globalStyles.captionError}>{error}</Text>
                <Text style={globalStyles.textInputLabel}>Post Title</Text>
                <TextInput
                  style={globalStyles.textInput}
                  placeholder="Enter post title"
                  onChangeText={props.handleChange("title")}
                  value={props.values.title}
                  onBlur={Keyboard.dismiss}
                />
                <View style={{ marginVertical: 5 }}></View>
                <Text style={globalStyles.captionError}>
                  <ErrorMessage name="title" />
                </Text>
                <Text style={globalStyles.textInputLabel}>Post</Text>
                <View style={globalStyles.postContainer}>
                  <TextInput
                    style={globalStyles.postTextInput}
                    multiline={true}
                    placeholder="Enter text"
                    onChangeText={props.handleChange("body_text")}
                    value={props.values.body_text}
                    onBlur={Keyboard.dismiss}
                  />
                  <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    {user.image_url !== null ? (
                      <Image
                        style={{
                          borderRadius: 10,
                          width: 250,
                          height: 250,
                          justifyContent: "center",
                          alignItems: "center",
                          marginVertical: 10,
                        }}
                        source={{ uri: user.image_url }}
                      />
                    ) : null}
                  </View>
                </View>
                <Text style={globalStyles.captionError}>
                  <ErrorMessage name="body_text" />
                </Text>
                <View
                  style={[
                    globalStyles.widthContainer,
                    {
                      flexDirection: "row",
                      justifyContent: "space-around",
                      alignItems: "center",
                      marginTop: 10,
                    },
                  ]}
                >
                  {user.image_url !== null ? (
                    <TouchableOpacity
                      onPress={resetApp}
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        paddingVertical: 10,
                        paddingHorizontal: 12,
                        borderRadius: 12,
                        elevation: 3,
                        backgroundColor: "#2482AA",
                      }}
                    >
                      <MaterialIcon
                        name="no-photography"
                        size={30}
                        color="#fbfbfb"
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
                        borderRadius: 20,
                        elevation: 3,
                        backgroundColor: "#2482AA",
                      }}
                    >
                      <MaterialIcon
                        name="add-a-photo"
                        size={30}
                        color="#fbfbfb"
                      />
                    </TouchableOpacity>
                  )}
                  <View style={{ marginVertical: 10 }}></View>

                  <TouchableOpacity
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      paddingVertical: 16,
                      paddingHorizontal: 20,
                      borderRadius: 20,
                      elevation: 3,
                      backgroundColor: "#2482AA",
                      width: "80%",
                    }}
                    onPress={props.handleSubmit}
                  >
                    <Text style={globalStyles.primaryButtonText}>
                      Update Post
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
