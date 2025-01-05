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

export default function InformationSection() {
  const [webpageHeader2Size, setWebpageHeader2Size] = useState(
    getWebpageHeader2Size()
  );
  const [webpageTextSize, setwebpageTextSize] = useState(getWebpageTextSize());
  const [orderReverse, setOrderReverse] = useState(getOrderReverse());
  const [order, setOrder] = useState(getOrder());
  const [format, setFormat] = useState(getFormat());
  const [imageWidth, setImageWidth] = useState(getImageWidth());
  const [imageHeight, setImageHeight] = useState(getImageHeight());
  const [marginMultiplier, setMarginMultiplier] = useState(
    getMarginMultiplier()
  );

  useEffect(() => {
    const handleInitialScreenSize = () => {
      const { width } = Dimensions.get("window");

      setWebpageHeader2Size(getWebpageHeader2Size(width));
      setwebpageTextSize(getWebpageTextSize(width));
      setOrderReverse(getOrderReverse(width));
      setFormat(getFormat(width));
      setImageWidth(getImageWidth(width));
      setImageHeight(getImageHeight(width));
      setOrder(getOrder(width));
      setMarginMultiplier(getMarginMultiplier(width));
    };

    handleInitialScreenSize();

    // Listen for window resize events
    const handleChangeListener = Dimensions.addEventListener(
      "change",
      handleInitialScreenSize
    );

    // Clean up the event listener on component unmount
    return () => {
      handleChangeListener.remove();
    };
  }, []);

  function getWebpageHeader2Size() {
    const windowWidth = Dimensions.get("window").width;
    if (windowWidth < 500) {
      return 18;
    }
    return windowWidth > 1240 ? 48 : 28;
  }

  function getWebpageTextSize() {
    const windowWidth = Dimensions.get("window").width;
    if (windowWidth < 500) {
      return 10;
    }
    return windowWidth > 1240 ? 28 : 16;
  }

  function getOrderReverse() {
    const windowWidth = Dimensions.get("window").width;
    return windowWidth > 1400 ? "row" : "column-reverse";
  }

  function getOrder() {
    const windowWidth = Dimensions.get("window").width;
    return windowWidth > 1400 ? "row" : "column";
  }

  function getFormat() {
    const windowWidth = Dimensions.get("window").width;
    return windowWidth > 10000 ? "space-between" : "center";
  }

  function getImageWidth() {
    const windowWidth = Dimensions.get("window").width;
    return windowWidth > 1240 ? 1 : 0.58;
  }

  function getImageHeight() {
    const windowWidth = Dimensions.get("window").width;
    return windowWidth > 1240 ? 1 : 0.58;
  }

  function getMarginMultiplier() {
    const windowWidth = Dimensions.get("window").width;
    return windowWidth > 1400 ? 1 : 0;
  }

  return (
    <View style={{}}>
      <View
        style={[
          styles.shadow,
          {
            flex: 1,
            flexDirection: orderReverse,
            alignItems: "center",
            justifyContent: format,
            marginVertical: 24,
            paddingTop: 10,
            marginBottom: 100,
          },
        ]}
      >
        <View
          style={{
            width: "60%",
            marginTop: 50 * marginMultiplier,
            marginBottom: 20 * marginMultiplier,
          }}
        >
          <Text
            style={[
              globalStyles.webpageHeader2,
              { fontSize: webpageHeader2Size, marginBottom: 30 },
            ]}
          >
            Learners
          </Text>
          <Text
            style={[
              globalStyles.webpageText,
              { fontSize: webpageTextSize, marginBottom: 50 },
            ]}
          >
            Nuubi helps students stay on track with our built-in features that
            boost engagement.
          </Text>
        </View>
        <View>
          <Image
            style={{
              width: 377 * imageWidth,
              height: 201 * imageHeight,
              marginBottom: 70,
            }}
            resizeMode="center"
            source={require("../../assets/Carousel2.png")}
          />
        </View>
      </View>

      <View
        style={[
          styles.shadow,
          {
            flex: 1,
            flexDirection: order,
            alignItems: "center",
            justifyContent: format,
            marginVertical: 24,
            marginBottom: 100,
          },
        ]}
      >
        <View style={{ minWidth: 100 }}>
          <Image
            style={{
              width: 302 * imageWidth,
              height: 161 * imageHeight,
              marginRight: 60,
              marginBottom: 50,
              marginTop: 20,
            }}
            resizeMode="center"
            source={require("../../assets/Carousel4.1.png")}
          />
        </View>

        <View
          style={{
            width: "60%",
            marginTop: 50 * marginMultiplier,
            marginBottom: 10 * marginMultiplier,
          }}
        >
          <Text
            style={[
              globalStyles.webpageHeader2,
              { fontSize: webpageHeader2Size, marginBottom: 30 },
            ]}
          >
            Educators
          </Text>
          <Text
            style={[
              globalStyles.webpageText,
              { fontSize: webpageTextSize, marginBottom: 60 },
            ]}
          >
            Nuubi takes care of community engagement and outreach on your behalf
            to save you time.
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.shadow,
          {
            flex: 1,
            flexDirection: orderReverse,
            alignItems: "center",
            justifyContent: format,
            marginVertical: 24,
            marginBottom: 100,
            minHeight: 250,
          },
        ]}
      >
        <View
          style={{
            width: "60%",
            marginTop: 140 * marginMultiplier,
            marginBottom: 80 * marginMultiplier,
          }}
        >
          <Text
            style={[
              globalStyles.webpageHeader2,
              { fontSize: webpageHeader2Size, marginBottom: 30 },
            ]}
          >
            Analytics
          </Text>
          <Text
            style={[
              globalStyles.webpageText,
              { fontSize: webpageTextSize, marginBottom: 60 },
            ]}
          >
            Nuubi uses AI behind the scenes to highlight your progress and show
            areas for improvement.
          </Text>
        </View>
        <View>
          <Image
            style={{
              width: 377 * imageWidth,
              height: 201 * imageHeight,
              marginBottom: 70 * marginMultiplier,
              marginTop: 60,
            }}
            resizeMode="center"
            source={require("../../assets/Carousel1.png")}
          />
        </View>
      </View>

      <View
        style={[
          styles.shadow,
          {
            flex: 1,
            flexDirection: order,
            alignItems: "center",
            justifyContent: format,
            marginVertical: 24,
            marginBottom: 100,
            paddingBottom: 20,
            paddingTop: 30,
          },
        ]}
      >
        <View>
          <Image
            style={{
              width: 377 * imageWidth,
              height: 201 * imageHeight,
              marginRight: 60,
              marginBottom: 30,
            }}
            resizeMode="center"
            source={require("../../assets/Carousel3.png")}
          />
        </View>

        <View style={{ width: "60%" }}>
          <Text
            style={[
              globalStyles.webpageHeader2,
              { fontSize: webpageHeader2Size, marginBottom: 30 },
            ]}
          >
            Nuubi Group Spotlight
          </Text>
          <Text
            style={[
              globalStyles.webpageText,
              { fontSize: webpageTextSize, marginBottom: 20 },
            ]}
          >
            Sign up for our Data Science Program to 10x your career at your own
            pace.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("LandingPage")}
            style={{
              backgroundColor: "#2482AA", // Button background color
              paddingVertical: 16, // Adjusted vertical padding
              paddingHorizontal: 40, // Adjusted horizontal padding
              borderRadius: 30, // Rounded corners
              alignSelf: "center", // Center alignment
              shadowColor: "#000", // Shadow color
              shadowOffset: { width: 0, height: 4 }, // Shadow depth
              shadowOpacity: 0.2, // Shadow intensity
              shadowRadius: 4, // Shadow softness
              elevation: 6, // Elevation for Android devices
              minWidth: "50%", // Adjusted width for larger screens
              maxWidth: "70%", // Avoids the button getting too wide on large screens
              marginBottom: 20, // Prevents overlap
            }}
          >
            <Text
              style={{
                fontSize: 18, // Increased text size
                color: "#fff", // White text color
                fontWeight: "bold", // Bold text for emphasis
                textAlign: "center", // Center text alignment
              }}
            >
              Learn More
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
});

// import React, { useState, useRef, useEffect } from "react";
// import {
//   View,
//   Text,
//   Image,
//   Dimensions,
//   StyleSheet,
//   TouchableOpacity,
// } from "react-native";
// import { globalStyles } from "../../styles/global";

// export default function InformationSection() {
//   const [webpageHeader2Size, setWebpageHeader2Size] = useState(
//     getWebpageHeader2Size()
//   );
//   const [webpageTextSize, setwebpageTextSize] = useState(getWebpageTextSize());
//   const [orderReverse, setOrderReverse] = useState(getOrderReverse());
//   const [order, setOrder] = useState(getOrder());
//   const [format, setFormat] = useState(getFormat());
//   const [imageWidth, setImageWidth] = useState(getImageWidth());
//   const [imageHeight, setImageHeight] = useState(getImageHeight());
//   const [marginMultiplier, setMarginMultiplier] = useState(
//     getMarginMultiplier()
//   );

//   useEffect(() => {
//     const handleInitialScreenSize = () => {
//       const { width } = Dimensions.get("window");

//       setWebpageHeader2Size(getWebpageHeader2Size(width));
//       setwebpageTextSize(getWebpageTextSize(width));
//       setOrderReverse(getOrderReverse(width));
//       setFormat(getFormat(width));
//       setImageWidth(getImageWidth(width));
//       setImageHeight(getImageHeight(width));
//       setOrder(getOrder(width));
//       setMarginMultiplier(getMarginMultiplier(width));
//     };

//     handleInitialScreenSize();

//     // Listen for window resize events
//     const handleChangeListener = Dimensions.addEventListener(
//       "change",
//       handleInitialScreenSize
//     );

//     // Clean up the event listener on component unmount
//     return () => {
//       handleChangeListener.remove();
//     };
//   }, []);

//   function getWebpageHeader2Size() {
//     const windowWidth = Dimensions.get("window").width;
//     if (windowWidth < 500) {
//       return 18;
//     }
//     return windowWidth > 1240 ? 48 : 28;
//   }

//   function getWebpageTextSize() {
//     const windowWidth = Dimensions.get("window").width;
//     if (windowWidth < 500) {
//       return 10;
//     }
//     return windowWidth > 1240 ? 28 : 16;
//   }

//   function getOrderReverse() {
//     const windowWidth = Dimensions.get("window").width;
//     return windowWidth > 1400 ? "row" : "column-reverse";
//   }

//   function getOrder() {
//     const windowWidth = Dimensions.get("window").width;
//     return windowWidth > 1400 ? "row" : "column";
//   }

//   function getFormat() {
//     const windowWidth = Dimensions.get("window").width;
//     return windowWidth > 10000 ? "space-between" : "center";
//   }

//   function getImageWidth() {
//     const windowWidth = Dimensions.get("window").width;
//     return windowWidth > 1240 ? 1 : 0.58;
//   }

//   function getImageHeight() {
//     const windowWidth = Dimensions.get("window").width;
//     return windowWidth > 1240 ? 1 : 0.58;
//   }

//   function getMarginMultiplier() {
//     const windowWidth = Dimensions.get("window").width;
//     return windowWidth > 1400 ? 1 : 0;
//   }

//   return (
//     <View style={{}}>
//       <View
//         style={[
//           styles.shadow,
//           {
//             flex: 1,
//             flexDirection: orderReverse,
//             alignItems: "center",
//             justifyContent: format,
//             marginVertical: 24,
//             paddingTop: 10,
//             //flexWrap: "wrap-reverse",
//             marginBottom: 100,
//           },
//         ]}
//       >
//         <View
//           style={{
//             width: "60%",
//             marginTop: 50 * marginMultiplier,
//             marginBottom: 20 * marginMultiplier,
//           }}
//         >
//           <Text
//             style={[
//               globalStyles.webpageHeader2,
//               { fontSize: webpageHeader2Size, marginBottom: 30 },
//             ]}
//           >
//             Learners
//           </Text>
//           <Text
//             style={[
//               globalStyles.webpageText,
//               { fontSize: webpageTextSize, marginBottom: 50 },
//             ]}
//           >
//             Nuubi helps students stay on track with our built-in features that
//             boost engagement.
//           </Text>
//         </View>
//         <View>
//           <Image
//             style={{
//               width: 377 * imageWidth,
//               height: 201 * imageHeight,
//               marginBottom: 70,
//             }}
//             resizeMode="center"
//             source={require("../../assets/Carousel2.png")}
//           />
//         </View>
//       </View>

//       <View
//         style={[
//           styles.shadow,
//           {
//             flex: 1,
//             flexDirection: order,
//             alignItems: "center",
//             justifyContent: format,
//             marginVertical: 24,
//             //flexWrap: "wrap",
//             marginBottom: 100,
//           },
//         ]}
//       >
//         <View style={{ minWidth: 100 }}>
//           <Image
//             style={{
//               width: 302 * imageWidth,
//               height: 161 * imageHeight,
//               marginRight: 60,
//               marginBottom: 50,
//               marginTop: 20,
//             }}
//             resizeMode="center"
//             source={require("../../assets/Carousel4.1.png")}
//           />
//         </View>

//         <View
//           style={{
//             width: "60%",
//             marginTop: 50 * marginMultiplier,
//             marginBottom: 10 * marginMultiplier,
//           }}
//         >
//           <Text
//             style={[
//               globalStyles.webpageHeader2,
//               { fontSize: webpageHeader2Size, marginBottom: 30 },
//             ]}
//           >
//             Educators
//           </Text>
//           <Text
//             style={[
//               globalStyles.webpageText,
//               { fontSize: webpageTextSize, marginBottom: 60 },
//             ]}
//           >
//             Nuubi takes care of community engagement and outreach on your behalf
//             to save you time.
//           </Text>
//         </View>
//       </View>

//       <View
//         style={[
//           styles.shadow,
//           {
//             flex: 1,
//             flexDirection: orderReverse,
//             alignItems: "center",
//             justifyContent: format,
//             marginVertical: 24,
//             //flexWrap: "wrap-reverse",
//             marginBottom: 100,
//             minHeight: 250,
//           },
//         ]}
//       >
//         <View
//           style={{
//             width: "60%",
//             marginTop: 140 * marginMultiplier,
//             marginBottom: 80 * marginMultiplier,
//           }}
//         >
//           <Text
//             style={[
//               globalStyles.webpageHeader2,
//               { fontSize: webpageHeader2Size, marginBottom: 30 },
//             ]}
//           >
//             Analytics
//           </Text>
//           <Text
//             style={[
//               globalStyles.webpageText,
//               { fontSize: webpageTextSize, marginBottom: 60 },
//             ]}
//           >
//             Nuubi uses AI behind the scenes to highlight your progress and show
//             areas for improvement.
//           </Text>
//         </View>
//         <View>
//           <Image
//             style={{
//               width: 377 * imageWidth,
//               height: 201 * imageHeight,
//               marginBottom: 70 * marginMultiplier,
//               marginTop: 60,
//             }}
//             resizeMode="center"
//             source={require("../../assets/Carousel1.png")}
//           />
//         </View>
//       </View>

//       <View
//         style={[
//           styles.shadow,
//           {
//             flex: 1,
//             flexDirection: order,
//             alignItems: "center",
//             justifyContent: format,
//             marginVertical: 24,
//             //flexWrap: "wrap",
//             marginBottom: 100,
//           },
//         ]}
//       >
//         <View>
//           <Image
//             style={{
//               width: 377 * imageWidth,
//               height: 201 * imageHeight,
//               marginRight: 60,
//               marginBottom: 30,
//             }}
//             resizeMode="center"
//             source={require("../../assets/Carousel3.png")}
//           />
//         </View>

//         {/* <View style={{ width: "60%" }}>
//           <Text
//             style={[
//               globalStyles.webpageHeader2,
//               { fontSize: webpageHeader2Size, marginBottom: 30 },
//             ]}
//           >
//            Nuubi Group Spotlight
//           </Text>
//           <Text
//             style={[
//               globalStyles.webpageText,
//               { fontSize: webpageTextSize, marginBottom: 20 },
//             ]}
//           >
//             Join the Data Science Program to 10x your career at your own pace.
//           </Text>
//         </View> */}

//         <View style={{ width: "60%" }}>
//           <Text
//             style={[
//               globalStyles.webpageHeader2,
//               { fontSize: webpageHeader2Size, marginBottom: 30 },
//             ]}
//           >
//             Nuubi Group Spotlight
//           </Text>
//           <Text
//             style={[
//               globalStyles.webpageText,
//               { fontSize: webpageTextSize, marginBottom: 20 },
//             ]}
//           >
//             Sign up for our Data Science Program to 10x your career at your own
//             pace.
//           </Text>
//           <TouchableOpacity
//             onPress={() => navigation.navigate("LandingPage")}
//             style={{
//               backgroundColor: "#2482AA", // Button background color
//               paddingVertical: 20, // Vertical padding for height
//               paddingHorizontal: 60, // Horizontal padding for width
//               borderRadius: 30, // Rounded corners
//               alignSelf: "center", // Center alignment
//               shadowColor: "#000", // Shadow color
//               shadowOffset: { width: 0, height: 4 }, // Shadow depth
//               shadowOpacity: 0.2, // Shadow intensity
//               shadowRadius: 4, // Shadow softness
//               elevation: 6, // Elevation for Android devices
//             }}
//           >
//             <Text
//               style={{
//                 fontSize: 16, // Text size
//                 color: "#fff", // White text color
//                 fontWeight: "bold", // Bold text for emphasis
//                 textAlign: "center", // Center text alignment
//               }}
//             >
//               Learn More
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// }

// export const styles = StyleSheet.create({
//   shadow: {
//     borderRadius: 30,
//     shadowColor: "#000",
//     borderWidth: 1.5,
//     borderColor: "#C0C0C0",
//     borderStyle: "solid",
//     shadowOffset: {
//       width: 7,
//       height: 7,
//     },
//     shadowOpacity: 0.3,
//     shadowRadius: 4.65,
//     elevation: 3,
//     overflow: "visible",
//   },
// });
