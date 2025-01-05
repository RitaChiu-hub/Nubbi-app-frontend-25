// import React, { useState, useEffect } from "react";
// import { View, Text, Image, Dimensions, TouchableOpacity } from "react-native";
// import { globalStyles } from "../../styles/global";
// import { LinearGradient } from "expo-linear-gradient";
// import { FontAwesome6 } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import Link from "./Link";

// export default function Footer({}) {
//   const navigation = useNavigation();
//   const [format, setFormat] = useState(getFormat());
//   const [alignment, setAlignment] = useState(getAlignment());
//   const [bottomFooterMargin, setBottomFooterMargin] = useState(
//     getBottomFooterMargin()
//   );
//   const [fontSize, setFontSize] = useState(getFontSize());
//   const [margin, setMargin] = useState(getMargin());
//   const [bottomFormat, setBottomFormat] = useState(getBottomFormat());
//   const [size, setSize] = useState(getSize());

//   useEffect(() => {
//     const handleInitialScreenSize = () => {
//       const { width } = Dimensions.get("window");
//       setFormat(getFormat(width));
//       setAlignment(getAlignment(width));
//       setBottomFooterMargin(getBottomFooterMargin(width));
//       setFontSize(getFontSize(width));
//       setMargin(getMargin(width));
//       setBottomFormat(getBottomFormat(width));
//       setSize(getSize(width));
//     };

//     handleInitialScreenSize();

//     const handleChangeListener = Dimensions.addEventListener(
//       "change",
//       handleInitialScreenSize
//     );

//     return () => {
//       handleChangeListener.remove();
//     };
//   }, []);

//   function getFormat() {
//     const windowWidth = Dimensions.get("window").width;
//     return windowWidth > 1260 ? "row" : "column";
//   }

//   function getBottomFormat() {
//     const windowWidth = Dimensions.get("window").width;
//     return windowWidth > 600 ? "row" : "column";
//   }

//   function getAlignment() {
//     const windowWidth = Dimensions.get("window").width;
//     return windowWidth > 1260 ? "flex-start" : "center";
//   }

//   function getBottomFooterMargin() {
//     const windowWidth = Dimensions.get("window").width;
//     return windowWidth > 1260 ? 0 : 40;
//   }

//   function getFooterTextMargin() {
//     const windowWidth = Dimensions.get("window").width;
//     return windowWidth > 1260 ? 0 : 40;
//   }

//   function getSize() {
//     const windowWidth = Dimensions.get("window").width;
//     return windowWidth > 1260 ? 350 : 600;
//   }

//   function getMargin() {
//     const windowWidth = Dimensions.get("window").width;
//     if (windowWidth <= 600) {
//       return 10;
//     }
//     return windowWidth > 1260 ? 10 : -20;
//   }

//   function getFontSize() {
//     const windowWidth = Dimensions.get("window").width;
//     return windowWidth > 600 ? 1 : 0.75;
//   }

//   return (
//     <View style={{ marginTop: 150 }}>
//       <LinearGradient
//         start={[0, 1]}
//         end={[0, 1]}
//         colors={["#7DDFA0", "#87ceeb"]}
//         locations={[0.0, 1.0]}
//         accessibilityRole="none"
//         style={{ width: "100%", height: 2.5 }}
//       />

//       {/* App Store Buttons - Positioned Below the Linear Gradient */}
//       <View
//         style={{
//           width: "100%",
//           backgroundColor: "#2482AA1A",
//           alignItems: "center",
//           justifyContent: "center",
//           paddingBottom: 20,
//         }}
//       >
//         {/* Row containing "Nuubi FAQ" button and app store buttons */}
//         <View
//           style={{
//             flexDirection: format === "row" ? "row" : "column", // Stack vertically on smaller screens
//             justifyContent: "space-between", // Space between the Nuubi FAQ button and the App Store buttons
//             width: "80%",
//             marginTop: 20,
//             paddingHorizontal: 20, // Add padding to avoid too tight alignment
//           }}
//         >
//           {/* "Nuubi FAQ" Button */}
//           <TouchableOpacity
//             style={{
//               paddingVertical: 13,
//               paddingHorizontal: 14,
//             }}
//             accessibilityRole="button"
//             onPress={() => navigation.navigate("HelpLoggedOut")}
//           >
//             <Text
//               style={[
//                 globalStyles.h3HeadingRegular,
//                 { fontSize: 22 * fontSize },
//               ]}
//             >
//               Nuubi FAQ
//             </Text>
//           </TouchableOpacity>

//           {/* App Store Buttons */}
//           <View
//             style={{
//               flexDirection: "row",
//               justifyContent: "space-between", // Ensure some space between the App Store buttons
//               gap: 15, // Add consistent gap between the two app store buttons
//             }}
//           >
//             <Link url="https://play.google.com/store/apps/details?id=com.kittykat.nuubiapp&hl=en">
//               <Image
//                 style={{
//                   width: 200 * fontSize,
//                   height: 64 * fontSize,
//                 }}
//                 source={require("../../assets/GooglePlay.png")}
//               />
//             </Link>
//             <Link url="https://apps.apple.com/us/app/nuubi/id6447013076">
//               <Image
//                 style={{
//                   width: 200 * fontSize,
//                   height: 64 * fontSize,
//                 }}
//                 source={require("../../assets/AppStore.png")}
//               />
//             </Link>
//           </View>
//         </View>
//       </View>

//       {/* Footer Content Below - Extended Background */}
//       <View
//         style={{
//           marginTop: 0, // Ensure there is no extra space above
//           backgroundColor: "#2482AA1A", // Extended background color
//           paddingBottom: 30, // Space for social media links
//         }}
//       >
//         <View
//           style={{
//             flexDirection: "row",
//             justifyContent: "center",
//             alignItems: "center",
//             marginBottom: 20,
//           }}
//         >
//           <Image
//             style={{
//               width: 70 * fontSize,
//               height: 70 * fontSize,
//               marginRight: 10,
//             }}
//             source={require("../../assets/nuubi_Logo_BW.png")}
//           />
//           <Text
//             style={[globalStyles.webpageHeader2, { fontSize: 35 * fontSize }]}
//           >
//             NUUBI
//           </Text>
//         </View>

//         {/* Privacy and Terms Links */}
//         <View
//           style={{
//             flexDirection: "row",
//             justifyContent: "center",
//             marginBottom: 20,
//           }}
//         >
//           <TouchableOpacity
//             style={{
//               paddingVertical: 13,
//               paddingHorizontal: 14,
//               marginRight: 40,
//             }}
//             accessibilityRole="button"
//             onPress={() => navigation.navigate("PrivacyScreen")}
//           >
//             <Text
//               style={[
//                 globalStyles.caption,
//                 { fontSize: 22 * fontSize, color: "#050505" },
//               ]}
//             >
//               Privacy
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={{
//               paddingVertical: 13,
//               paddingHorizontal: 14,
//             }}
//             accessibilityRole="button"
//             onPress={() => navigation.navigate("TermsScreen")}
//           >
//             <Text
//               style={[
//                 globalStyles.caption,
//                 { fontSize: 22 * fontSize, color: "#050505" },
//               ]}
//             >
//               Terms Of Service
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {/* Social Media Icons */}
//         <View
//           style={{
//             flexDirection: "row",
//             justifyContent: "center",
//             marginBottom: 30,
//           }}
//         >
//           <Link url="https://www.instagram.com/nuubi.app/">
//             <FontAwesome6
//               name="instagram"
//               color="#050505"
//               size={50 * fontSize}
//               style={{ marginRight: 40 }}
//             />
//           </Link>
//           <Link url="https://www.facebook.com/nuubiapp/">
//             <FontAwesome6
//               name="facebook"
//               color="#050505"
//               size={50 * fontSize}
//               style={{ marginRight: 40 }}
//             />
//           </Link>
//           <Link url="https://www.linkedin.com/company/nuubi-app/">
//             <FontAwesome6
//               name="linkedin"
//               color="#050505"
//               size={50 * fontSize}
//               style={{ marginRight: 40 }}
//             />
//           </Link>
//           <Link url="https://www.tiktok.com/@nuubi.app">
//             <FontAwesome6
//               name="tiktok"
//               color="#050505"
//               size={50 * fontSize}
//               style={{ marginRight: 40 }}
//             />
//           </Link>
//         </View>

//         {/* Copyright Section */}
//         <View
//           style={{
//             width: "100%",
//             alignItems: "center",
//             marginTop: 20,
//             paddingBottom: 10,
//           }}
//         >
//           <Text
//             style={[
//               globalStyles.caption,
//               { fontSize: 14 * fontSize, color: "#050505" },
//             ]}
//           >
//             © {new Date().getFullYear()} Nuubi Inc. All rights reserved.
//           </Text>
//         </View>
//       </View>
//     </View>
//   );
// }

import React, { useState, useEffect } from "react";
import { View, Text, Image, Dimensions, TouchableOpacity } from "react-native";
import { globalStyles } from "../../styles/global";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome6 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Link from "./Link";

export default function Footer({}) {
  const navigation = useNavigation();
  const [format, setFormat] = useState(getFormat());
  const [alignment, setAlignment] = useState(getAlignment());
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
      setAlignment(getAlignment(width));
      setBottomFooterMargin(getBottomFooterMargin(width));
      setFontSize(getFontSize(width));
      setMargin(getMargin(width));
      setBottomFormat(getBottomFormat(width));
      setSize(getSize(width));
    };

    handleInitialScreenSize();

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

  function getAlignment() {
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
      />

      {/* App Store Buttons - Positioned Below the Linear Gradient */}
      <View
        style={{
          width: "100%",
          backgroundColor: "#2482AA1A",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 20,
        }}
      >
        {/* Row containing "Nuubi FAQ" button and app store buttons */}
        <View
          style={{
            flexDirection: format === "row" ? "row" : "column", // Row for larger screens, column for smaller
            justifyContent: format === "row" ? "space-between" : "center", // Space between for larger screens, center for smaller
            width: "80%",
            marginTop: 20,
            paddingHorizontal: 20, // Add padding to avoid tight alignment
            alignItems: format === "row" ? "flex-start" : "center", // Align left for row, center for column
            flexWrap: "wrap", // Prevent overflow on very small screens
          }}
        >
          {/* "Nuubi FAQ" Button */}
          <TouchableOpacity
            style={{
              paddingVertical: 13,
              paddingHorizontal: 14,
              marginRight: format === "row" ? 20 : 0, // Space between FAQ and app store buttons (only in row layout)
              marginBottom: format !== "row" ? 10 : 0, // Margin bottom when stacking vertically
            }}
            accessibilityRole="button"
            onPress={() => navigation.navigate("HelpLoggedOut")}
          >
            <Text
              style={[
                globalStyles.h3HeadingRegular,
                { fontSize: 22 * fontSize },
              ]}
            >
              Nuubi FAQ
            </Text>
          </TouchableOpacity>

          {/* App Store Buttons */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between", // Space between the app store buttons
              width: format === "row" ? "40%" : "100%", // Adjust width for row vs column
              marginTop: format === "row" ? 0 : 10, // Add margin for stacking on small screens
              flexWrap: "wrap", // Allow buttons to wrap on small screens
            }}
          >
            <Link
              url="https://play.google.com/store/apps/details?id=com.kittykat.nuubiapp&hl=en"
              style={{ marginRight: 10 }} // Adds space between the app store buttons
            >
              <Image
                style={{
                  width: 200 * fontSize,
                  height: 64 * fontSize,
                }}
                source={require("../../assets/GooglePlay.png")}
              />
            </Link>
            <Link url="https://apps.apple.com/us/app/nuubi/id6447013076">
              <Image
                style={{
                  width: 200 * fontSize,
                  height: 64 * fontSize,
                }}
                source={require("../../assets/AppStore.png")}
              />
            </Link>
          </View>
        </View>
      </View>

      {/* Footer Content Below - Extended Background */}
      <View
        style={{
          marginTop: 0, // Ensure there is no extra space above
          backgroundColor: "#2482AA1A", // Extended background color
          paddingBottom: 30, // Space for social media links
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20,
            flexWrap: "wrap", // Prevent overflow for small screens
          }}
        >
          <Image
            style={{
              width: 70 * fontSize,
              height: 70 * fontSize,
              marginRight: 10,
              marginBottom: 10, // Ensure spacing for small screens
            }}
            source={require("../../assets/nuubi_Logo_BW.png")}
          />
          <Text
            style={[globalStyles.webpageHeader2, { fontSize: 35 * fontSize }]}
          >
            NUUBI
          </Text>
        </View>

        {/* Privacy and Terms Links */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 20,
            flexWrap: "wrap", // Prevent overflow on small screens
          }}
        >
          <TouchableOpacity
            style={{
              paddingVertical: 13,
              paddingHorizontal: 14,
              marginRight: 40,
              marginBottom: 10, // Add spacing for wrapping
            }}
            accessibilityRole="button"
            onPress={() => navigation.navigate("PrivacyScreen")}
          >
            <Text
              style={[
                globalStyles.caption,
                { fontSize: 22 * fontSize, color: "#050505" },
              ]}
            >
              Privacy
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              paddingVertical: 13,
              paddingHorizontal: 14,
              marginBottom: 10, // Add spacing for wrapping
            }}
            accessibilityRole="button"
            onPress={() => navigation.navigate("TermsScreen")}
          >
            <Text
              style={[
                globalStyles.caption,
                { fontSize: 22 * fontSize, color: "#050505" },
              ]}
            >
              Terms Of Service
            </Text>
          </TouchableOpacity>
        </View>

        {/* Social Media Icons */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 30,
            flexWrap: "wrap", // Prevent overflow for small screens
          }}
        >
          <Link url="https://www.instagram.com/nuubi.app/">
            <FontAwesome6
              name="instagram"
              color="#050505"
              size={50 * fontSize}
              style={{ marginRight: 40, marginBottom: 10 }}
            />
          </Link>
          <Link url="https://www.facebook.com/nuubiapp/">
            <FontAwesome6
              name="facebook"
              color="#050505"
              size={50 * fontSize}
              style={{ marginRight: 40, marginBottom: 10 }}
            />
          </Link>
          <Link url="https://www.linkedin.com/company/nuubi-app/">
            <FontAwesome6
              name="linkedin"
              color="#050505"
              size={50 * fontSize}
              style={{ marginRight: 40, marginBottom: 10 }}
            />
          </Link>
          <Link url="https://www.tiktok.com/@nuubi.app">
            <FontAwesome6
              name="tiktok"
              color="#050505"
              size={50 * fontSize}
              style={{ marginRight: 40, marginBottom: 10 }}
            />
          </Link>
        </View>

        {/* Copyright Section */}
        <View
          style={{
            width: "100%",
            alignItems: "center",
            marginTop: 20,
            paddingBottom: 10,
          }}
        >
          <Text
            style={[
              globalStyles.caption,
              { fontSize: 14 * fontSize, color: "#050505" },
            ]}
          >
            © {new Date().getFullYear()} Nuubi Inc. All rights reserved.
          </Text>
        </View>
      </View>
    </View>
  );
}
