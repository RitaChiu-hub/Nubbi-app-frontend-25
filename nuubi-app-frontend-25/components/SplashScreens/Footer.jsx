import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { globalStyles } from "../../styles/global";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome6 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Link from "./Link";

export default function Footer({}) {
  const navigation = useNavigation();
  const [format, setFormat] = useState(getFormat());
  const [allignment, setAllignment] = useState(getAllignment());
  const [bottomFooterMargin, setBottomFooterMargin] = useState(
    getBottomFooterMargin()
  );
  const [fontSize, setFontSize] = useState(getFontSize());
  const [margin, setMargin] = useState(getMargin());
  const [bottomFormat, setBottomFormat] = useState(getBottomFormat());
  const [size, setSize] = useState(getSize());

  useEffect(() => {
    const handleInitialScreenSize = () => {
      const { width } = Dimensions.get("window");
      setFormat(getFormat(width));
      setAllignment(getAllignment(width));
      setBottomFooterMargin(getBottomFooterMargin(width));
      setFontSize(getFontSize(width));
      setMargin(getMargin(width));
      setBottomFormat(getBottomFormat(width));
      setSize(getSize(width));
    };

    handleInitialScreenSize();

    // Listen for window resize events
    const handleChangeListener = Dimensions.addEventListener(
      "change",
      handleInitialScreenSize
    );

    return () => {
      handleChangeListener.remove();
    };
  }, []);

  function getFormat() {
    const windowWidth = Dimensions.get("window").width;
    return windowWidth > 1260 ? "row" : "column";
  }

  function getBottomFormat() {
    const windowWidth = Dimensions.get("window").width;
    return windowWidth > 600 ? "row" : "column";
  }

  function getAllignment() {
    const windowWidth = Dimensions.get("window").width;
    return windowWidth > 1260 ? "flex-start" : "center";
  }

  function getBottomFooterMargin() {
    const windowWidth = Dimensions.get("window").width;
    return windowWidth > 1260 ? 0 : 40;
  }

  function getFooterTextMargin() {
    const windowWidth = Dimensions.get("window").width;
    return windowWidth > 1260 ? 0 : 40;
  }

  function getSize() {
    const windowWidth = Dimensions.get("window").width;
    return windowWidth > 1260 ? 350 : 600;
  }

  function getMargin() {
    const windowWidth = Dimensions.get("window").width;
    if (windowWidth <= 600) {
      return 10;
    }
    return windowWidth > 1260 ? 10 : -20;
  }

  function getFontSize() {
    const windowWidth = Dimensions.get("window").width;
    return windowWidth > 600 ? 1 : 0.75;
  }

  return (
    <View style={{ marginTop: 150 }}>
      <LinearGradient
        start={[0, 1]}
        end={[0, 1]}
        colors={["#7DDFA0", "#87ceeb"]}
        locations={[0.0, 1.0]}
        accessibilityRole="none"
        style={{ width: "100%", height: 2.5 }}
      ></LinearGradient>
      <View
        style={{
          width: "100%",
          height: size,
          backgroundColor: "#2482AA1A",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: "100%",
            alignItems: "center",
            marginTop: -80,
          }}
        >
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: "black",
              flexDirection: format,
              width: "80%",
              alignItems: allignment,
              justifyContent: "space-between",
              paddingBottom: 70, // Add padding to ensure content is above the border
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
              <TouchableOpacity
                style={{
                  paddingVertical: 13,
                  paddingHorizontal: 14,
                }}
                accessibilityRole="button"
                onPress={() => navigation.navigate("HelpLoggedOut")}
              >
                <Text
                  style={[
                    globalStyles.h3HeadingRegular,
                    { fontSize: 22 * fontSize, marginTop: 80 },
                  ]}
                >
                  Help
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
              <Link
                url="https://play.google.com/store/apps/details?id=com.kittykat.nuubiapp&hl=en"
                style={{ marginRight: 80 }}
              >
                <Image
                  style={{
                    width: 200 * fontSize,
                    height: 64 * fontSize,
                    marginTop: 70,
                    marginRight: 60,
                  }}
                  source={require("../../assets/GooglePlay.png")}
                />
              </Link>
              <Link url="https://apps.apple.com/us/app/nuubi/id6447013076">
                <Image
                  style={{ width: 200, height: 64, marginTop: 70 }}
                  source={require("../../assets/AppStore.png")}
                />
              </Link>
            </View>
          </View>
        </View>

        <View
          style={{
            width: "100%",
            flexDirection: format,
            marginTop: 60,
            justifyContent: "space-between",
            alignItems: allignment,
            paddingHorizontal: "10%",
          }}
        >
          <View
            style={{
              flex: 1,
              alignItems: allignment,
              flexDirection: bottomFormat,
              marginBottom: bottomFooterMargin,
              marginRight: 50,
            }}
          >
            <View style={{ flexDirection: "row", marginRight: 40 }}>
              <Image
                style={{
                  width: 70 * fontSize,
                  height: 70 * fontSize,
                  marginRight: 12,
                }}
                source={require("../../assets/nuubi_Logo_BW.png")}
              />
              <Text
                style={[
                  globalStyles.webpageHeader2,
                  {
                    fontSize: 35 * fontSize,
                    alignSelf: "center",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                ]}
              >
                NUUBI
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  paddingVertical: 13,
                  paddingHorizontal: 14,
                }}
                accessibilityRole="button"
                onPress={() => navigation.navigate("PrivacyScreen")}
              >
                <Text
                  style={[
                    globalStyles.caption,
                    { fontSize: 22 * fontSize, marginRight: 40 },
                  ]}
                >
                  Privacy
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  paddingVertical: 13,
                  paddingHorizontal: 14,
                }}
                accessibilityRole="button"
                onPress={() => navigation.navigate("TermsScreen")}
              >
                <Text
                  style={[
                    globalStyles.caption,
                    { fontSize: 22 * fontSize, paddingRight: 40 },
                  ]}
                >
                  Terms Of Service
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <Link url="https://www.instagram.com/nuubi.app/">
              <FontAwesome6
                name="instagram"
                color="#050505"
                size={50 * fontSize}
                style={{ marginRight: 40 }}
              />
            </Link>
            <Link url="https://www.facebook.com/nuubiapp/">
              <FontAwesome6
                name="facebook"
                color="#050505"
                size={50 * fontSize}
                style={{ marginRight: 40 }}
              />
            </Link>
            <Link url="https://www.linkedin.com/company/nuubi-app/">
              <FontAwesome6
                name="linkedin"
                color="#050505"
                size={50 * fontSize}
                style={{ marginRight: 40 }}
              />
            </Link>
            <Link url="https://www.tiktok.com/@nuubi.app">
              <FontAwesome6
                name="tiktok"
                color="#050505"
                size={50 * fontSize}
                style={{ marginRight: 40 }}
              />
            </Link>
          </View>
        </View>
      </View>
    </View>
  );
}
