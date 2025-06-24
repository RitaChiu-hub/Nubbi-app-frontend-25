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
import FeatherIcon from "@expo/vector-icons/FontAwesome6";
import * as SecureStore from "expo-secure-store";

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

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingWhite}>Profile</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  let assets1 = useAssets([require("../../assets/defaultAvatar.png")]);

  const getUserPoints = async () => {
    const token =
      Platform.OS !== "web"
        ? await SecureStore.getItemAsync("token")
        : sessionStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:8080/groups/getuserpoints`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
    const token =
      Platform.OS !== "web"
        ? await SecureStore.getItemAsync("token")
        : sessionStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:8080/settings/getuseravatar",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ ...user }),
        }
      );
      const jsonData = await response.json();
      setAvatarInfo(jsonData.avatar_url);
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
      title: "Profile",
      headerTitleAlign: "center",
    });
  }, [navigation]);

  const handleNavigation = (navRoute, label) => {
    if (navRoute === "" || !navRoute) {
    } else if (navRoute == "comingSoonAlert") {
      alert("Feature coming soon!");
    } else {
      navigation.navigate(navRoute);
    }
  };

  return (
    <ScrollView style={{ backgroundColor: "#fbfbfb" }}>
      <View
        style={{
          flex: 1,
          backgroundColor: "#fbfbfb",
          alignItems: "center",
          marginTop: 12,
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

        <Text style={[globalStyles.h2HeadingMedium, { textAlign: "center" }]}>
          Hi {myUsername}!
        </Text>
        <Text style={[globalStyles.bodyRegular, { marginBottom: 20 }]}>
          You have {userPoints} total points 🎉
        </Text>
        <View style={globalStyles.widthContainer}>
          <View style={globalStyles.sectionBody}>
            <View>
              <View style={[globalStyles.rowWrapper, globalStyles.rowFirst]}>
                {pickedImage !== null ? (
                  <TouchableOpacity
                    onPress={resetImage}
                    style={globalStyles.row}
                  >
                    <View style={[globalStyles.row]}>
                      <FeatherIcon
                        color="#616161"
                        solid
                        name="user-xmark"
                        style={globalStyles.rowIcon}
                        size={22}
                      />
                      <Text style={globalStyles.headingTextRows}>
                        Cancel Update
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={pickImage}
                    style={globalStyles.row}
                  >
                    <View style={[globalStyles.row]}>
                      <FeatherIcon
                        color="#616161"
                        solid
                        name="user-pen"
                        style={globalStyles.rowIcon}
                        size={22}
                      />
                      <Text style={globalStyles.headingTextRows}>
                        Update Avatar
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
              {/* 
            <TouchableOpacity
              onPress={() => {
                fetch(
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
                    setUser({ ...data });
                    if (data.status) {
                      setError(data.status);
                    }
                  });
              }}
              style={[globalStyles.secondaryButton, {width: "45%"}]}
            >
              <Text style={globalStyles.secondaryButtonText}>
                Delete Avatar
              </Text>
            </TouchableOpacity> */}

              {pickedImage !== null ? (
                <View style={globalStyles.rowWrapper}>
                  <TouchableOpacity
                    style={globalStyles.row}
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
                          const token =
                            Platform.OS !== "web"
                              ? await SecureStore.getItemAsync("token")
                              : null; // Get token only on mobile

                          fetch(
                            `http://localhost:8080/settings/updateavatar`,
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
                    <View style={[globalStyles.row]}>
                      <FeatherIcon
                        color="#616161"
                        solid
                        name="user-lock"
                        style={globalStyles.rowIcon}
                        size={22}
                      />
                      <Text style={globalStyles.headingTextRows}>
                        Save Avatar
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>

            {/* <View style={globalStyles.rowWrapper}>
              <TouchableOpacity
                style={globalStyles.row}
                onPress={() => navigation.navigate("OverallAchievements")}
              >
                <View style={[globalStyles.row]}>
                  <FeatherIcon
                    color="#616161"
                    solid
                    name="trophy"
                    style={globalStyles.rowIcon}
                    size={22}
                  />
                  <Text style={globalStyles.headingTextRows}>Achievements</Text>
                </View>
                <FeatherIcon name="chevron-right" color="#C6C6C6" size={20} />
              </TouchableOpacity>
            </View> */}

            <View style={globalStyles.rowWrapper}>
              <TouchableOpacity
                style={globalStyles.row}
                onPress={() => navigation.navigate("FeedbackScreen")}
              >
                <View style={[globalStyles.row]}>
                  <FeatherIcon
                    color="#616161"
                    solid
                    name="paper-plane"
                    style={globalStyles.rowIcon}
                    size={22}
                  />
                  <Text style={globalStyles.headingTextRows}>Contact Us</Text>
                </View>
                <FeatherIcon name="chevron-right" color="#C6C6C6" size={20} />
              </TouchableOpacity>
            </View>

            <View style={globalStyles.rowWrapper}>
              <TouchableOpacity
                style={globalStyles.row}
                onPress={() => navigation.navigate("HelpLoggedIn")}
              >
                <View style={[globalStyles.row]}>
                  <FeatherIcon
                    color="#616161"
                    solid
                    name="circle-question"
                    style={globalStyles.rowIcon}
                    size={22}
                  />
                  <Text style={globalStyles.headingTextRows}>Nuubi FAQ</Text>
                </View>
                <FeatherIcon name="chevron-right" color="#C6C6C6" size={20} />
              </TouchableOpacity>
            </View>

            <View style={[globalStyles.rowWrapper, globalStyles.rowLast]}>
              <TouchableOpacity
                style={globalStyles.row}
                onPress={() => navigation.navigate("Settings")}
              >
                <View style={[globalStyles.row]}>
                  <FeatherIcon
                    color="#616161"
                    solid
                    name="gear"
                    style={globalStyles.rowIcon}
                    size={22}
                  />
                  <Text style={globalStyles.headingTextRows}>Settings</Text>
                </View>
                <FeatherIcon name="chevron-right" color="#C6C6C6" size={20} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
