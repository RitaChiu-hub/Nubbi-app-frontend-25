import React, { useState, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  Animated,
  Alert
} from "react-native";
import { Helmet } from "react-helmet";
import RenderHTML, { defaultSystemFonts } from "react-native-render-html";
import {
  useFonts,
  Poppins_100Thin,
  Poppins_100Thin_Italic,
  Poppins_200ExtraLight,
  Poppins_200ExtraLight_Italic,
  Poppins_300Light,
  Poppins_300Light_Italic,
  Poppins_400Regular,
  Poppins_400Regular_Italic,
  Poppins_500Medium,
  Poppins_500Medium_Italic,
  Poppins_600SemiBold,
  Poppins_600SemiBold_Italic,
  Poppins_700Bold,
  Poppins_700Bold_Italic,
  Poppins_800ExtraBold,
  Poppins_800ExtraBold_Italic,
  Poppins_900Black,
  Poppins_900Black_Italic,
} from "@expo-google-fonts/poppins";
import { globalStyles } from "../styles/global";
import * as SplashScreenExpo from "expo-splash-screen";
// import { AccountContext } from "./AccountContext";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
// import alert from './alert'

// SplashScreenExpo.preventAutoHideAsync();

export default function SplashScreen({ navigation }) {
  const [currCarouselIndex, setCurrCarouselIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);
  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrCarouselIndex(viewableItems[0].index);
  }).current;
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  // const { user, setUser } = React.useContext(AccountContext);

  let [fontsLoaded] = useFonts({
    Poppins_100Thin,
    Poppins_100Thin_Italic,
    Poppins_200ExtraLight,
    Poppins_200ExtraLight_Italic,
    Poppins_300Light,
    Poppins_300Light_Italic,
    Poppins_400Regular,
    Poppins_400Regular_Italic,
    Poppins_500Medium,
    Poppins_500Medium_Italic,
    Poppins_600SemiBold,
    Poppins_600SemiBold_Italic,
    Poppins_700Bold,
    Poppins_700Bold_Italic,
    Poppins_800ExtraBold,
    Poppins_800ExtraBold_Italic,
    Poppins_900Black,
    Poppins_900Black_Italic,
  });

  const onLayoutRootView = React.useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreenExpo.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const systemFonts = [...defaultSystemFonts, "Poppins_400Regular"];

  const htmlContent = `
    <h1 style="font-size: 16px; font-weight: normal; fontFamily: Poppins_400Regular; letterSpacing: 0.5">
      The chat platform for learning.
    </h1>
    <br />
`;

  const CarouselItem = ({ item, scrollX }) => {
    return (
      <View style={[stylesCarousel.container]}>
        <Image
          source={item.img}
          style={[stylesCarousel.img, { resizeMode: "contain" }]}
        />
        <View style={{ flex: 0.3 }}>
          <View style={{ marginTop: 16,
             }}>
            <Text style={globalStyles.h2HeadingMedium}>{item.title}</Text>
          </View>
          <View style={{ paddingHorizontal: 60 }}>
            <Text style={globalStyles.bodyRegular}>{item.desc}</Text>
          </View>
        </View>
      </View>
    );
  };

  const CarouselPaginator = ({ data }) => {
    return (
      <View style={{ flexDirection: "row", height: 64 }}>
        {data.map((_, i) => {
          const inputRange = [
            (i - 1) * deviceWidth,
            i * deviceWidth,
            (i + 1) * deviceWidth,
          ];
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [10, 20, 10],
            extrapolate: "clamp",
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              style={[stylesCarousel.dot, { width: dotWidth, opacity }]}
              key={i.toString()}
            />
          );
        })}
      </View>
    );
  };

  const carouselData = [
    {
      id: "1",
      title: "Team Learning.",
      desc: "Where students and teachers come together and help each other excel academically.",
      img: require("../assets/Carousel1.png"),
    },
    {
      id: "2",
      title: "Get Rewarded.",
      desc: "Earn extra credit with simple daily tasks, helping students, and participation.",
      img: require("../assets/Carousel2.png"),
    },
    {
      id: "3",
      title: "More Ways to Chat.",
      desc: "Collaborate with ease between live chats and group forums. Plus, easily search by tags.",
      img: require("../assets/Carousel3.png"),
    },
    {
      id: "4",
      title: "Questions Solved.",
      desc: "Find study groups, mentors, or ask your teacher. Either way, get your questions answered.",
      img: require("../assets/Carousel4.1.png"),
    },
  ];

  return (
    <LinearGradient
      colors={["#fdfdfd", "#fdfdfd", "#8bdae8"]}
      style={globalStyles.container}
      locations={[0.0, 0.46, 1.0]}
    >
      <SafeAreaView
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        onLayout={onLayoutRootView}
      >
        <Helmet>
          <meta
            name="Nuubi"
            content="EdTech chat app for students and teachers that fosters learning."
          />
        </Helmet>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Image
            style={{ width: 45, height: 45 }}
            source={require("../assets/nuubiTransparent45.png")}
            alt="The Nuubi logo, a green and blue chat bubble with an open book at the center."
          />

          <Text
            style={{
              fontSize: 32,
              fontFamily: "Poppins_600SemiBold",
              color: "#111111",
              marginHorizontal: 5,
            }}
          >
            NUUBI
          </Text>
        </View>
        <View style={{ marginTop: 2 }}></View>
        <RenderHTML
          source={{ html: htmlContent }}
          contentWidth={deviceWidth}
          systemFonts={systemFonts}
        />

        <View
          style={[stylesCarousel.container, { marginTop: platformMarginTop }]}
        >
          <View style={[stylesCarousel.secondaryContainer]}>
            <FlatList
              style={{ width: deviceWidth }}
              data={carouselData}
              renderItem={({ item }) => <CarouselItem item={item} />}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              bounces={false}
              keyExtractor={(item) => {
                return item.id.toString();
              }}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                {
                  useNativeDriver: false,
                }
              )}
              scrollEventThrottle={32}
              onViewableItemsChanged={viewableItemsChanged}
              viewabilityConfig={viewConfig}
              ref={slidesRef}
            />
          </View>
          <CarouselPaginator data={carouselData} scrollX={scrollX} />
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: "#2482aa",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 14,
            marginTop: 5,
            width: deviceWidth * 0.9,
            borderRadius: 60,
            elevation: 3,
          }}
          onPress={() => navigation.navigate("SignUp")}
        >
          <Text style={globalStyles.primaryButtonText}>Sign Up</Text>
        </TouchableOpacity>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Text style={globalStyles.caption}>Already have an account? </Text>
          <TouchableOpacity
            style={{ paddingHorizontal: 5, paddingVertical: 23 }}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={globalStyles.captionLink}>Log In</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Icon name="info-outline" size={20} color="#111111" />
          <TouchableOpacity
            style={{ paddingVertical: 13, paddingHorizontal: 5 }}
            onPress={() => navigation.navigate("LearnMore1")}
          >
            <Text style={globalStyles.captionLink}>Learn More</Text>
          </TouchableOpacity>

          <Text style={{ paddingHorizontal: 10, fontSize: 20 }}>|</Text>
          <Icon name="language" size={20} color="#111111" />
          <TouchableOpacity
            style={{ paddingVertical: 13, paddingHorizontal: 5 }}
            onPress={() => Alert.alert("Spanish Coming Soon!")}
          >
            <Text style={globalStyles.captionLink}>Language</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const deviceWidth = Dimensions.get("window").width;
const platformMarginTop = Platform.OS == "web" ? 0 : "-8%";
const stylesCarousel = StyleSheet.create({
  container: {
    flexGrow: 0.7,
    width: deviceWidth,
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryContainer: {
    flexGrow: 1,
    width: deviceWidth,
  },
  img: {
    flex: 0.5,
    flexDirection: "row",
    width: deviceWidth,
    ...Platform.select({
      ios: {
        flexBasis: 0,
      },
      android: {
        flexBasis: 0,
      },
      default: {
        flexBasis: 160,
      },
    }),
  },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "#24D265",
    marginHorizontal: 8,
    marginTop: 40,
  },
});
