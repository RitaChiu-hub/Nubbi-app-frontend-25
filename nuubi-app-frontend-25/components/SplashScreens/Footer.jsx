import React, { useState, useEffect } from "react";
import { View, Text, Image, Dimensions, TouchableOpacity } from "react-native";
import { globalStyles } from "../../styles/global";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome6 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Link from "./Link";

export default function Footer() {
  const navigation = useNavigation();

  // Track screen width
  const [width, setWidth] = useState(Dimensions.get("window").width);

  useEffect(() => {
    const handleResize = () => {
      setWidth(Dimensions.get("window").width);
    };
    handleResize();

    const subscription = Dimensions.addEventListener("change", handleResize);
    return () => subscription?.remove && subscription.remove();
  }, []);

  // For screens under 600px, use "small screen" layout
  const isSmallScreen = width < 600;

  // Scale down on small screens if desired
  const fontSizeMultiplier = isSmallScreen ? 0.75 : 1.0;

  return (
    // Footer: Contentinfo landmark for the welcome page, helping screen reader users access site information and footer links.
    <View role="contentinfo" aria-label="Welcome page footer" style={{ marginTop: 60 }}>
      <LinearGradient
        start={[0, 1]}
        end={[0, 1]}
        colors={["#7DDFA0", "#87ceeb"]}
        style={{ width: "100%", height: 2.5 }}
      />

      {/* TOP SECTION: FAQ + APP STORE BUTTONS */}
      <View
        style={{
          width: "100%",
          backgroundColor: "#2482AA1A",
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 20,
        }}
      >
        {/* Container for the FAQ and store buttons */}
        <View
          style={{
            width: "80%",
            paddingHorizontal: 20,
            flexDirection: isSmallScreen ? "column" : "row",
            justifyContent: isSmallScreen ? "center" : "space-between",
            alignItems: "center",
          }}
        >
          {/* FAQ Button */}
          <TouchableOpacity
            style={{
              paddingVertical: 13,
              paddingHorizontal: 14,
              marginBottom: isSmallScreen ? 20 : 0,
              marginRight: isSmallScreen ? 0 : 20,
            }}
            onPress={() => navigation.navigate("HelpLoggedOut")}
          >
            <Text
              style={[
                globalStyles.h3HeadingRegular,
                { fontSize: 22 * fontSizeMultiplier },
              ]}
            >
              Nuubi FAQ
            </Text>
          </TouchableOpacity>

          {/* APP STORE BUTTONS */}
          <View
            style={{
              flexDirection: isSmallScreen ? "column" : "row",
              alignItems: "center",
              justifyContent: isSmallScreen ? "center" : "space-evenly",
            }}
          >
            <Link
              url="https://play.google.com/store/apps/details?id=com.kittykat.nuubiapp&hl=en"
              style={{
                // If stacked, add bigger margin on bottom
                marginBottom: isSmallScreen ? 20 : 0,
              }}
            >
              <View
                style={{
                  // Add some padding to the container around the image
                  padding: 10,
                }}
              >
                <Image
                  style={{
                    width: 200 * fontSizeMultiplier,
                    height: 64 * fontSizeMultiplier,
                  }}
                  source={require("../../assets/GooglePlay.png")}
                />
              </View>
            </Link>

            <Link url="https://apps.apple.com/us/app/nuubi/id6447013076">
              <View
                style={{
                  padding: 10,
                }}
              >
                <Image
                  style={{
                    width: 200 * fontSizeMultiplier,
                    height: 64 * fontSizeMultiplier,
                  }}
                  source={require("../../assets/AppStore.png")}
                />
              </View>
            </Link>
          </View>
        </View>
      </View>

      {/* BOTTOM SECTION: Logo, links, social icons, etc. */}
      <View
        style={{
          backgroundColor: "#2482AA1A",
          paddingBottom: 30,
        }}
      >
        {/* LOGO / NUUBI TITLE */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20,
            flexWrap: "wrap",
          }}
        >
          <Image
            style={{
              width: 70 * fontSizeMultiplier,
              height: 70 * fontSizeMultiplier,
              marginRight: 10,
              marginBottom: 10,
            }}
            source={require("../../assets/nuubi_Logo_BW.png")}
          />
          <Text
            style={[
              globalStyles.webpageHeader2,
              { fontSize: 35 * fontSizeMultiplier },
            ]}
          >
            NUUBI
          </Text>
        </View>

        {/* PRIVACY & TERMS */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 20,
            flexWrap: "wrap",
          }}
        >
          <TouchableOpacity
            style={{
              paddingVertical: 13,
              paddingHorizontal: 14,
              marginHorizontal: 20,
              marginBottom: 10,
            }}
            onPress={() => navigation.navigate("AccessibilityScreen")}
          >
            <Text
              style={[
                globalStyles.caption,
                { fontSize: 22 * fontSizeMultiplier, color: "#050505" },
              ]}
            >
              Accessibility
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              paddingVertical: 13,
              paddingHorizontal: 14,
              marginHorizontal: 20,
              marginBottom: 10,
            }}
            onPress={() => navigation.navigate("PrivacyScreen")}
          >
            <Text
              style={[
                globalStyles.caption,
                { fontSize: 22 * fontSizeMultiplier, color: "#050505" },
              ]}
            >
              Privacy
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              paddingVertical: 13,
              paddingHorizontal: 14,
              marginHorizontal: 20,
              marginBottom: 10,
            }}
            onPress={() => navigation.navigate("TermsScreen")}
          >
            <Text
              style={[
                globalStyles.caption,
                { fontSize: 22 * fontSizeMultiplier, color: "#050505" },
              ]}
            >
              Terms Of Service
            </Text>
          </TouchableOpacity>
        </View>

        {/* SOCIAL MEDIA ICONS */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 30,
            flexWrap: "wrap",
          }}
        >
          <Link url="https://www.instagram.com/nuubi.app/">
            <FontAwesome6
              name="instagram"
              color="#050505"
              size={50 * fontSizeMultiplier}
              style={{ marginRight: 40, marginBottom: 10 }}
            />
          </Link>
          <Link url="https://www.facebook.com/nuubiapp/">
            <FontAwesome6
              name="facebook"
              color="#050505"
              size={50 * fontSizeMultiplier}
              style={{ marginRight: 40, marginBottom: 10 }}
            />
          </Link>
          <Link url="https://www.linkedin.com/company/nuubi-app/">
            <FontAwesome6
              name="linkedin"
              color="#050505"
              size={50 * fontSizeMultiplier}
              style={{ marginRight: 40, marginBottom: 10 }}
            />
          </Link>
          <Link url="https://www.tiktok.com/@nuubi.app">
            <FontAwesome6
              name="tiktok"
              color="#050505"
              size={50 * fontSizeMultiplier}
              style={{ marginRight: 40, marginBottom: 10 }}
            />
          </Link>
        </View>

        {/* COPYRIGHT */}
        <View style={{ width: "100%", alignItems: "center", marginTop: 20 }}>
          <Text
            style={[
              globalStyles.caption,
              { fontSize: 14 * fontSizeMultiplier, color: "#050505" },
            ]}
          >
            © {new Date().getFullYear()} Nuubi Inc. All rights reserved.
          </Text>
        </View>
      </View>
    </View>
  );
}
