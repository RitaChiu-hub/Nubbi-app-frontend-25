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
} from "react-native";
import { Formik, ErrorMessage } from "formik";
import { globalStyles } from "../../styles/global";
import { AccountContext } from "../AccountContext";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
const { createPostSchema } = require("../validationSchema");
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import IonIcon from "@expo/vector-icons/Ionicons";
import * as ImageManipulator from "expo-image-manipulator";
import alert from "./../alert";
import * as SecureStore from "expo-secure-store";

const cloudName = "dvvdc9evd";
const apiKey = "971765162862783";

export default function CreatePostScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  // const [error, setError] = React.useState(null);
  const [status, setStatus] = React.useState(null);
  const [statusColor, setStatusColor] = React.useState(
    globalStyles.captionError
  );
  const [pickedImage, setPickedImage] = React.useState(null);
  const [imageUploadInfo, setImageUploadInfo] = React.useState(null);
  const [pickedFile, setPickedFile] = React.useState(null);
  const [fileUploadInfo, setFileUploadInfo] = React.useState(null);

  const resizeImage = async (imageInfo, resizeAmount) => {
    const resizedPhoto = await ImageManipulator.manipulateAsync(
      imageInfo.uri,
      [{ resize: { width: imageInfo.width * resizeAmount } }],
      { compress: 0.7, format: "jpeg", base64: true }
    );

    setPickedImage({
      uri: resizedPhoto.uri,
      base64: resizedPhoto.base64,
    });

    const fileImg = await fetch(resizedPhoto.uri).then((r) => r.blob());
    if (fileImg.size > 10400000) {
      resizeImage(imageInfo, resizeAmount * 0.5);
    }
  };

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
        width: result.assets[0].width,
      });

      if (result.assets[0].fileSize > 10400000) {
        resizeImage(result.assets[0], 0.5);
      }
    }
  };

  const pickFile = async () => {
    try {
      const filePickResponse = await DocumentPicker.getDocumentAsync({
        type: "*/*",
      });
      if (
        filePickResponse.canceled === false ||
        filePickResponse.type == "success"
      ) {
        setPickedFile({
          name: filePickResponse.name || filePickResponse.assets[0].name,
          type:
            filePickResponse.mimeType || filePickResponse.assets[0].mimeType,
          uri: filePickResponse.uri || filePickResponse.assets[0].uri,
          size: filePickResponse.size || filePickResponse.assets[0].size,
        });
        if (
          (filePickResponse.size || filePickResponse.assets[0].size) > 10400000
        ) {
          alert(
            "This file is too big to upload. At this time, we are limited to 10MB maximum file uploads. Please resize your document or select a smaller portion of it and try again. I'm sorry for the inconvenience!"
          );
        }
      }
    } catch (error) {
      console.log("my error is: " + error);
    }
  };

  const uploadFile = async () => {
    if (Platform.OS === "web") {
      let apiUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

      let data = {
        file: pickedFile.uri,
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
          setFileUploadInfo({ ...data });
          let fileUploadUrl = data["secure_url"];
          return data;
        })
        .catch((err) => console.log(err));
    } else {
      let apiUrl = "https://api.cloudinary.com/v1_1/${cloudName}/auto/upload";
      const formData = new FormData();
      formData.append("file", pickedFile);
      formData.append("api_key", apiKey);
      formData.append("upload_preset", "ehsnm9es");

      fetch(apiUrl, {
        body: formData,
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
        method: "POST",
      })
        .then(async (r) => {
          let data = await r.json();
          setFileUploadInfo({ ...data });
          let fileUploadUrl = data["secure_url"];
          return data;
        })
        .catch((err) => console.log(err));
    }
  };

  const resetApp = () => {
    setPickedImage(null);
    setImageUploadInfo(null);
  };

  const resetFile = () => {
    setPickedFile(null);
    setFileUploadInfo(null);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingWhite}>Create Post</Text>
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
            initialValues={{ title: "", body_text: "" }}
            //  initialValues={{ title: "Testing", body_text: "Test" }}
            validationSchema={createPostSchema}
            onSubmit={async (values, actions) => {
              if (pickedImage !== null && pickedFile == null) {
                // post submission with image but with no file attachment
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
                    const vals = {
                      ...values,
                      imageUrl: uploadUrl,
                      fileUrl: null,
                    };

                    const token =
                      Platform.OS !== "web"
                        ? await SecureStore.getItemAsync("token")
                        : null; // Get token only on mobile
                    fetch(
                      `http://localhost:8080/groups/${user.currentGroup}/createpost`,
                      {
                        method: "POST",
                        credentials: "include",
                        headers: {
                          "Content-Type": "application/json",
                          ...(token
                            ? { Authorization: `Bearer ${token}` }
                            : {}),
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
                        setUser({ ...data });
                        if (data.status) {
                          //  setError(data.status);
                          if (data.status.includes("successfully")) {
                            setStatusColor(globalStyles.captionErrorSuccess);
                          } else {
                            setStatusColor(globalStyles.captionError);
                          }
                          setStatus(data.status);
                        }
                      });
                    return data["secure_url"];
                  })
                  .catch((err) => console.log(err));
              } else if (pickedImage !== null && pickedFile !== null) {
                // post with image and file attachment

                if (Platform.OS === "web") {
                  let apiUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

                  let data = {
                    file: pickedFile.uri,
                    upload_preset: "ehsnm9es",
                    api_key: apiKey,
                  };

                  fetch(apiUrl, {
                    body: JSON.stringify(data),
                    headers: {
                      "content-type": "application/json",
                    },
                    method: "POST",
                  }).then(async (r) => {
                    let data = await r.json();
                    setFileUploadInfo({ ...data });
                    let fileUploadUrl = data["secure_url"];

                    // now upload the image
                    let base64Img = `data:image/jpg;base64,${pickedImage.base64}`;

                    //Add your cloud name
                    let apiUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

                    let imageData = {
                      file: base64Img,
                      upload_preset: "ehsnm9es",
                      api_key: apiKey,
                    };

                    fetch(apiUrl, {
                      body: JSON.stringify(imageData),
                      headers: {
                        "content-type": "application/json",
                      },
                      method: "POST",
                    })
                      .then(async (r) => {
                        let data = await r.json();
                        setImageUploadInfo({ ...data });
                        let uploadUrl = data["secure_url"];
                        const vals = {
                          ...values,
                          imageUrl: uploadUrl,
                          fileUrl: fileUploadUrl,
                        };
                        const token =
                          Platform.OS !== "web"
                            ? await SecureStore.getItemAsync("token")
                            : null; // Get token only on mobile
                        fetch(
                          `http://localhost:8080/groups/${user.currentGroup}/createpost`,
                          {
                            method: "POST",
                            credentials: "include",
                            headers: {
                              "Content-Type": "application/json",
                              ...(token
                                ? { Authorization: `Bearer ${token}` }
                                : {}),
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
                            setUser({ ...data });
                            if (data.status) {
                              //  setError(data.status);
                              if (data.status.includes("successfully")) {
                                setStatusColor(
                                  globalStyles.captionErrorSuccess
                                );
                              } else {
                                setStatusColor(globalStyles.captionError);
                              }
                              setStatus(data.status);
                            }
                          });
                        return data["secure_url"];
                      })
                      .catch((err) => console.log(err));
                  });
                } else {
                  let apiUrl =
                    "https://api.cloudinary.com/v1_1/${cloudName}/auto/upload";
                  const formData = new FormData();
                  formData.append("file", pickedFile);
                  formData.append("api_key", apiKey);
                  formData.append("upload_preset", "ehsnm9es");

                  fetch(apiUrl, {
                    body: formData,
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "multipart/form-data",
                    },
                    method: "POST",
                  }).then(async (r) => {
                    let data = await r.json();
                    setFileUploadInfo({ ...data });
                    let fileUploadUrl = data["secure_url"];

                    // now upload the image
                    let base64Img = `data:image/jpg;base64,${pickedImage.base64}`;

                    //Add your cloud name
                    let apiUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

                    let imageData = {
                      file: base64Img,
                      upload_preset: "ehsnm9es",
                      api_key: apiKey,
                    };

                    fetch(apiUrl, {
                      body: JSON.stringify(imageData),
                      headers: {
                        "content-type": "application/json",
                      },
                      method: "POST",
                    })
                      .then(async (r) => {
                        let data = await r.json();
                        setImageUploadInfo({ ...data });
                        let uploadUrl = data["secure_url"];
                        const vals = {
                          ...values,
                          imageUrl: uploadUrl,
                          fileUrl: fileUploadUrl,
                        };
                        const token =
                          Platform.OS !== "web"
                            ? await SecureStore.getItemAsync("token")
                            : null; // Get token only on mobile
                        fetch(
                          `http://localhost:8080/groups/${user.currentGroup}/createpost`,
                          {
                            method: "POST",
                            credentials: "include",
                            headers: {
                              "Content-Type": "application/json",
                              ...(token
                                ? { Authorization: `Bearer ${token}` }
                                : {}),
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
                            setUser({ ...data });
                            if (data.status) {
                              //  setError(data.status);
                              if (data.status.includes("successfully")) {
                                setStatusColor(
                                  globalStyles.captionErrorSuccess
                                );
                              } else {
                                setStatusColor(globalStyles.captionError);
                              }
                              setStatus(data.status);
                            }
                          });
                        return data["secure_url"];
                      })
                      .catch((err) => console.log(err));
                  });
                }
              } else if (pickedImage == null && pickedFile !== null) {
                // post with no image and with a file attachment

                if (Platform.OS === "web") {
                  let apiUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

                  let data = {
                    file: pickedFile.uri,
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
                      setFileUploadInfo({ ...data });
                      let fileUploadUrl = data["secure_url"];
                      const vals = {
                        ...values,
                        imageUrl: null,
                        fileUrl: fileUploadUrl,
                      };
                      const token =
                        Platform.OS !== "web"
                          ? await SecureStore.getItemAsync("token")
                          : null; // Get token only on mobile

                      fetch(
                        `http://localhost:8080/groups/${user.currentGroup}/createpost`,
                        {
                          method: "POST",
                          credentials: "include",
                          headers: {
                            "Content-Type": "application/json",
                            ...(token
                              ? { Authorization: `Bearer ${token}` }
                              : {}),
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
                          setUser({ ...data });
                          if (data.status) {
                            //   setError(data.status);
                            if (data.status.includes("successfully")) {
                              setStatusColor(globalStyles.captionErrorSuccess);
                            } else {
                              setStatusColor(globalStyles.captionError);
                            }
                            setStatus(data.status);
                          }
                        });
                      return data["secure_url"];
                    })
                    .catch((err) => console.log(err));
                } else {
                  let apiUrl =
                    "https://api.cloudinary.com/v1_1/${cloudName}/auto/upload";
                  const formData = new FormData();
                  formData.append("file", pickedFile);
                  formData.append("api_key", apiKey);
                  formData.append("upload_preset", "ehsnm9es");

                  fetch(apiUrl, {
                    body: formData,
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "multipart/form-data",
                    },
                    method: "POST",
                  })
                    .then(async (r) => {
                      let data = await r.json();
                      setFileUploadInfo({ ...data });
                      let fileUploadUrl = data["secure_url"];
                      const vals = {
                        ...values,
                        imageUrl: null,
                        fileUrl: fileUploadUrl,
                      };
                      const token =
                        Platform.OS !== "web"
                          ? await SecureStore.getItemAsync("token")
                          : null; // Get token only on mobile

                      fetch(
                        `http://localhost:8080/groups/${user.currentGroup}/createpost`,
                        {
                          method: "POST",
                          credentials: "include",
                          headers: {
                            "Content-Type": "application/json",
                            ...(token
                              ? { Authorization: `Bearer ${token}` }
                              : {}),
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
                          setUser({ ...data });
                          if (data.status) {
                            //   setError(data.status);
                            if (data.status.includes("successfully")) {
                              setStatusColor(globalStyles.captionErrorSuccess);
                            } else {
                              setStatusColor(globalStyles.captionError);
                            }
                            setStatus(data.status);
                          }
                        });
                      return data["secure_url"];
                    })
                    .catch((err) => console.log(err));
                }
              } else {
                // regular post with no image and no file attachment
                const vals = { ...values, imageUrl: null, fileUrl: null };
                actions.resetForm();
                const token =
                  Platform.OS !== "web"
                    ? await SecureStore.getItemAsync("token")
                    : null; // Get token only on mobile
                fetch(
                  `http://localhost:8080/groups/${user.currentGroup}/createpost`,
                  {
                    method: "POST",
                    credentials: "include",
                    headers: {
                      "Content-Type": "application/json",
                      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
                    setUser({ ...data });
                    if (data.status) {
                      //  setError(data.status);
                      if (data.status.includes("successfully")) {
                        setStatusColor(globalStyles.captionErrorSuccess);
                      } else {
                        setStatusColor(globalStyles.captionError);
                      }
                      setStatus(data.status);
                    }
                  });
              }
            }}
          >
            {(props) => (
              <View>
                {/* <Text style={globalStyles.captionError}>{error}</Text> */}
                <Text style={statusColor}>{status}</Text>
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
                    {pickedImage === null ? null : (
                      <Image
                        style={globalStyles.squareImageContainer}
                        source={{ uri: pickedImage.uri }}
                      />
                    )}
                    {pickedFile === null ? null : (
                      <Text style={globalStyles.captionError}>
                        {pickedFile.name}
                      </Text>
                    )}
                  </View>
                </View>
                <Text style={globalStyles.captionError}>
                  <ErrorMessage name="body_text" />
                </Text>

                <View
                  style={{
                    marginTop: 12,
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
                        borderRadius: 20,
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
                  {pickedFile !== null ? (
                    <TouchableOpacity
                      onPress={resetFile}
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
                        name="edit-document"
                        size={30}
                        color="#fbfbfb"
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={pickFile}
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
                      <IonIcon
                        name="document-attach"
                        size={30}
                        color="#fbfbfb"
                      />
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      paddingVertical: 14,
                      paddingHorizontal: 12,
                      borderRadius: 20,
                      elevation: 3,
                      backgroundColor: "#2482AA",
                      width: "65%",
                    }}
                    onPress={props.handleSubmit}
                  >
                    <Text style={globalStyles.primaryButtonText}>
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
