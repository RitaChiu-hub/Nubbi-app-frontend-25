import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  Animated,
  ScrollView,
  ImageBackground,
} from "react-native";
import { useAssets } from "expo-asset";
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
import { LinearGradient } from "expo-linear-gradient";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import alert from "./alert";

SplashScreenExpo.preventAutoHideAsync();

export default function SplashScreen({ navigation }) {
  const [currCarouselIndex, setCurrCarouselIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);
  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrCarouselIndex(viewableItems[0].index);
  }).current;
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  let assets1 = useAssets([require("../assets/nuubiTransparent45.png")]);
  let assets2 = useAssets([require("../assets/Carousel1.png")]);
  let assets3 = useAssets([require("../assets/Carousel2.png")]);
  let assets4 = useAssets([require("../assets/Carousel3.png")]);
  let assets5 = useAssets([require("../assets/Carousel4.1.png")]);

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
      <View style={[stylesCarousel.container]} accessibilityRole="none">
        <Image
          source={item.img}
          alt={"Graphic images of people learning online"}
          style={[stylesCarousel.img, { resizeMode: "contain" }]}
        />
        <View style={{ flex: 0.3 }} accessibilityRole="none">
          <View style={{ marginTop: 16 }} accessibilityRole="none">
            <Text style={globalStyles.h2HeadingMedium}>{item.title}</Text>
          </View>
          <View
            style={{ paddingHorizontal: 50, paddingTop: 8 }}
            accessibilityRole="none"
          >
            <Text style={globalStyles.bodyRegular}>{item.desc}</Text>
          </View>
        </View>
      </View>
    );
  };

  const CarouselPaginator = ({ data }) => {
    return (
      <View style={{ flexDirection: "row" }} accessibilityRole="none">
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
              accessibilityRole="grid"
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
      //   img: require("../assets/Carousel1.png"),
      img:
        Platform.OS == "web" ? require("../assets/Carousel1.png") : assets2[0],
    },
    {
      id: "2",
      title: "Get Rewarded.",
      desc: "Earn extra credit with simple daily tasks, helping students, and participation.",
      //  img: require("../assets/Carousel2.png"),
      img:
        Platform.OS == "web" ? require("../assets/Carousel2.png") : assets3[0],
    },
    {
      id: "3",
      title: "More Ways to Chat.",
      desc: "Collaborate with ease between live chats and group forums. Plus, easily search by tags.",
      // img: require("../assets/Carousel3.png"),
      img:
        Platform.OS == "web" ? require("../assets/Carousel3.png") : assets4[0],
    },
    {
      id: "4",
      title: "Questions Solved.",
      desc: "Find study groups, mentors, or ask your teacher. Either way, get your questions answered.",
      //  img: require("../assets/Carousel4.1.png"),
      img:
        Platform.OS == "web"
          ? require("../assets/Carousel4.1.png")
          : assets5[0],
    },
  ];

  return Platform.OS == "web" ? (
    <ScrollView style={{ backgroundColor: "#fdfdfd" }}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 14,
        }}
      >
        <Image
          style={{ width: 52, height: 52 }}
          source={require("../assets/nuubiTransparent.png")}
        ></Image>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <TouchableOpacity
            style={{ paddingVertical: 13, paddingHorizontal: 14 }}
            accessibilityRole="button"
            onPress={() => navigation.navigate("SignUp")}
          >
            <Text style={globalStyles.h3HeadingRegular}>Sign up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ paddingVertical: 13, paddingHorizontal: 14 }}
            accessibilityRole="button"
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={globalStyles.h3HeadingRegular}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ paddingVertical: 13, paddingHorizontal: 24 }}
            accessibilityRole="button"
            onPress={() => alert("Spanish Coming Soon!")}
          >
            <MaterialIcons name="language" size={20} color="#111111" />
          </TouchableOpacity>
        </View>
      </View>
      <ImageBackground
        style={{
          width: "100%",
          maxHeight: 500,
          height: deviceWidth * 0.35,
          maxHeight: 300,
          minHeight: 250,
          marginTop: 20,
        }}
        resizeMode="cover"
        source={require("../assets/GroupSplash.png")}
      >
        <View
          style={{
            flex: "1",
            alignItems: "center",
            justifyContent: deviceWidth > 1000 ? null : "center",
            marginTop: deviceWidth > 1200 ? 60 : 20,
            marginBottom: 30,
          }}
        >
          <Text
            style={[
              globalStyles.secondaryButtonText,
              {
                width: "50%",
                fontSize: deviceWidth > 1000 ? 108 : 64,
                textAlign: "center",
                color: "#2482AA",
              },
            ]}
          >
            NUUBI
          </Text>
          <Text
            style={[
              globalStyles.h2HeadingMedium,
              {
                width: "50%",
                fontFamily: "Poppins_400Regular",
                fontSize: deviceWidth > 1000 ? 28 : 18,
                paddingBottom: 40,
              },
            ]}
          >
            Empowering university student success through gamified
            peer-learning. 
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: "#2482aa",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 14,
              marginTop: 5,
              width: "30%",
              borderRadius: 60,
              elevation: 3,
              maxWidth: 500,
            }}
            accessibilityRole="button"
            onPress={() => navigation.navigate("SignUp")}
          >
            <Text style={globalStyles.primaryButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </ScrollView>
  ) : (
    <LinearGradient
      colors={["#fdfdfd", "#fdfdfd", "#8bdae8"]}
      style={globalStyles.container}
      locations={[0.0, 0.46, 1.0]}
      accessibilityRole="none"
    >
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          alignItems: "center",
          justifyContent: "flex-start",
        }}
        onLayout={onLayoutRootView}
        accessibilityRole="none"
      >
        <Helmet>
          <title>
            Nuubi: The chat platform for incentivized peer learning.
          </title>

          <meta
            name="Nuubi"
            content="EdTech chat app for students and teachers that fosters learning."
          />

          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, user-scalable=yes, maximum-scale=2.0001"
          />
        </Helmet>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingTop: deviceWidth > 500 ? 60 : "25%",
          }}
          accessibilityRole="none"
        >
          <Image
            style={{ width: 45, height: 45 }}
            source={
              Platform.OS == "web"
                ? require("../assets/nuubiTransparent45.png")
                : assets1[0]
            }
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
        <RenderHTML
          source={{ html: htmlContent }}
          contentWidth={deviceWidth}
          systemFonts={systemFonts}
        />

        <View
          style={{
            flexGrow: 0.6,
            width: deviceWidth,
            alignItems: "center",
            justifyContent: "space-evenly",
            marginTop: platformMarginTop,
            height: 0,
            paddingBottom: deviceWidth > 500 ? 40 : 0,
          }}
          accessibilityRole="none"
        >
          <View style={[stylesCarousel.secondaryContainer]}>
            <FlatList
              style={{
                width: deviceWidth,
              }}
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

        <View
          style={{
            alignItems: "center",
            justifyContent: "space-between",
            //   marginBottom: Platform.OS == "web" ? 0 : "-50%",
            marginBottom: deviceWidth > 500 ? 0 : "-60%",
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "#2482aa",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 14,
              marginTop: 5,
              // width: deviceWidth * 0.9,
              width: deviceWidth > 500 ? deviceWidth * 0.6 : deviceWidth * 0.9,
              borderRadius: 60,
              elevation: 3,
              maxWidth: 500,
            }}
            accessibilityRole="button"
            onPress={() => navigation.navigate("SignUp")}
          >
            <Text style={globalStyles.primaryButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              paddingTop: 16,
              paddingBottom: 6,
            }}
            accessibilityRole="none"
          >
            <Text style={globalStyles.caption}>Already have an account? </Text>
            <TouchableOpacity
              style={{ paddingHorizontal: 5 }}
              accessibilityRole="button"
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
            accessibilityRole="none"
          >
            <MaterialIcons name="info-outline" size={20} color="#111111" />
            <TouchableOpacity
              style={{ paddingVertical: 13, paddingHorizontal: 5 }}
              accessibilityRole="button"
              onPress={() => navigation.navigate("LearnMore1")}
            >
              <Text style={globalStyles.captionLink}>Learn More</Text>
            </TouchableOpacity>

            <Text style={{ paddingHorizontal: 10, fontSize: 20 }}>|</Text>
            <MaterialIcons name="language" size={20} color="#111111" />
            <TouchableOpacity
              style={{ paddingVertical: 13, paddingHorizontal: 5 }}
              accessibilityRole="button"
              onPress={() => alert("Spanish Coming Soon!")}
            >
              <Text style={globalStyles.captionLink}>Language</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const deviceWidth = Dimensions.get("window").width;
const BannerHeight = deviceWidth * 0.9;
const platformMarginTop = Platform.OS == "web" ? 0 : "-8%";
const stylesCarousel = StyleSheet.create({
  container: {
    flexGrow: 0.6,
    width: deviceWidth,
    alignItems: "center",
  },
  secondaryContainer: {
    flexGrow: 0.8,
    width: deviceWidth,
  },
  img: {
    flex: 0.5,
    flexDirection: "row",
    width: deviceWidth * 0.7,
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
  },
});
