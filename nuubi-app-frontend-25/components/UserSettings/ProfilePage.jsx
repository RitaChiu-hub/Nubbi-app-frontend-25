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
import { AccountContext } from "../AccountContext";
import * as ImageManipulator from "expo-image-manipulator";

const cloudName = "dvvdc9evd";
const apiKey = "971765162862783";

export default function ProfilePageScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);
  const [pickedImage, setPickedImage] = React.useState(null);
  const [imageUploadInfo, setImageUploadInfo] = React.useState(null);
  const [avatarInfo, setAvatarInfo] = React.useState(null);

  const getUserAvatar = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/settings/getuseravatar",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...user }),
        }
      );
      const jsonData = await response.json();
      setAvatarInfo(jsonData.avatar_url.avatar_url);
    } catch (err) {
      console.error(err.message);
    }
  };

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

  const resetImage = () => {
    setPickedImage(null);
  };

  React.useEffect(() => {
    getUserAvatar();
    resetImage();
  }, [user]);

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
        <Text
          style={{
            color: "red",
            textAlign: "center",
          }}
        >
          {error}
        </Text>
        <View>
          {avatarInfo !== null && pickedImage === null ? (
            <Image style={styles.ImageContainer} source={{ uri: avatarInfo }} />
          ) : pickedImage !== null ? (
            <Image
              style={styles.ImageContainer}
              source={{ uri: pickedImage.uri }}
            />
          ) : (
            <Image
              style={styles.ImageContainer}
              source={require("../../assets/defaultAvatar.png")}
            />
          )}
        </View>

        {pickedImage !== null ? (
          <TouchableOpacity
            onPress={resetImage}
            style={globalStyles.secondaryButton}
          >
            <Text style={globalStyles.secondaryButtonText}>
              Clear picked image
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={pickImage}
            style={globalStyles.secondaryButton}
          >
            <Text style={globalStyles.secondaryButtonText}>
              Select new photo
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => {
            fetch(
              //  `https://coral-app-n96bn.ondigitalocean.app/groups/${user.currentGroup}/createpost`,
              `http://localhost:8080/settings/deleteavatar`,
              {
                method: "POST",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...user }),
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
                } else if (data.loggedIn) {
                  SecureStore.setItemAsync("token", data.token);
                }
              });
          }}
          style={globalStyles.secondaryButton}
        >
          <Text style={globalStyles.secondaryButtonText}>
            Delete Profile Picture
          </Text>
        </TouchableOpacity>

        {pickedImage !== null ? (
          <TouchableOpacity
            style={globalStyles.secondaryButton}
            onPress={() => {
              // upload the pickedimage to cloudinary

              // get the secure_url from cloudinary
              // send the secure_url and user id to the backend and store in the database

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
                  const vals = { imageUrl: uploadUrl };
                  fetch(
                    //  `https://coral-app-n96bn.ondigitalocean.app/groups/${user.currentGroup}/createpost`,
                    `http://localhost:8080/settings/updateavatar`,
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
                      setPickedImage(null);
                      if (data.status) {
                        setError(data.status);
                      } else if (data.loggedIn) {
                        SecureStore.setItemAsync("token", data.token);
                      }
                    });
                  return data["secure_url"];
                })
                .catch((err) => console.log(err));
            }}
          >
            <Text style={globalStyles.secondaryButtonText}>
              Save Profile Picture
            </Text>
          </TouchableOpacity>
        ) : null}

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
