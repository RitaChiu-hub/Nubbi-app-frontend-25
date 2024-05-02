import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
} from "react-native";
import { globalStyles } from "../../styles/global";
import * as ImagePicker from "expo-image-picker";
import { AccountContext } from "../AccountContext";
import * as ImageManipulator from "expo-image-manipulator";
import { useAssets } from "expo-asset";

const cloudName = "dvvdc9evd";
const apiKey = "971765162862783";

export default function ProfilePageScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);
  const [pickedImage, setPickedImage] = React.useState(null);
  const [imageUploadInfo, setImageUploadInfo] = React.useState(null);
  const [avatarInfo, setAvatarInfo] = React.useState(null);
  const [userPoints, setUserPoints] = React.useState(0);
  const [myUsername, setMyUsername] = React.useState("");

  let assets1 = useAssets([require("../../assets/defaultAvatar.png")]);

  const getUserPoints = async () => {
    try {
      const response = await fetch(
        `https://coral-app-n96bn.ondigitalocean.app/groups/getuserpoints`,
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
      setUserPoints(jsonData.userPoints);
      setMyUsername(jsonData.username);
    } catch (err) {
      console.error(err.message);
    }
  };

  React.useEffect(() => {
    getUserPoints();
  }, []);

  const getUserAvatar = async () => {
    try {
      const response = await fetch(
        "https://coral-app-n96bn.ondigitalocean.app/settings/getuseravatar",
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
        <Text style={globalStyles.captionError}>{error}</Text>
        <View>
          {avatarInfo !== null && pickedImage === null ? (
            <Image
              style={globalStyles.roundImageContainer}
              source={{ uri: avatarInfo }}
            />
          ) : pickedImage !== null ? (
            <Image
              style={globalStyles.roundImageContainer}
              source={{ uri: pickedImage.uri }}
              // source={
              //   Platform.OS == "web"
              //     ? require("../../assets/defaultAvatar.png")
              //     : assets2[0]
              // }
            />
          ) : (
            <Image
              style={globalStyles.roundImageContainer}
              source={
                Platform.OS == "web"
                  ? require("../../assets/defaultAvatar.png")
                  : assets1[0]
              }
            />
          )}
        </View>

        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "#333",
            padding: 20,
            marginLeft: 25,
            marginRight: 25,
            textAlign: "center",
          }}
        >
          Hi {myUsername}!
        </Text>
        <Text style={{ marginBottom: 20 }}>
          You have {userPoints} total points 🎉
        </Text>
        <View style={globalStyles.widthContainer}>
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
            <Text style={globalStyles.secondaryButtonText}>Select New Photo</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => {
            fetch(
              `https://coral-app-n96bn.ondigitalocean.app/settings/deleteavatar`,
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
                setUser({ ...data });
                if (data.status) {
                  setError(data.status);
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
                    `https://coral-app-n96bn.ondigitalocean.app/settings/updateavatar`,
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
                      setUser({ ...data });
                      setPickedImage(null);
                      if (data.status) {
                        setError(data.status);
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

        <TouchableOpacity
          style={globalStyles.secondaryButton}
          onPress={() => {
            alert("Coming soon!");
          }}
        >
          <Text style={globalStyles.secondaryButtonText}>My Analytics</Text>
        </TouchableOpacity>
      </View>
  </View>
    </ScrollView>
  );
}
