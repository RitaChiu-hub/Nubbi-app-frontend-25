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
  ImageBackground,
  ScrollView,
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
import { globalStyles } from "../../styles/global";
import * as SplashScreenExpo from "expo-splash-screen";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome6 } from "@expo/vector-icons";
import alert from "../alert";

SplashScreenExpo.preventAutoHideAsync();

export default function SplashScreen({ navigation }) {
  const [currCarouselIndex, setCurrCarouselIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);
  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrCarouselIndex(viewableItems[0].index);
  }).current;
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  let assets1 = useAssets([require("../../assets/nuubiTransparent45.png")]);
  let assets2 = useAssets([require("../../assets/Carousel1.png")]);
  let assets3 = useAssets([require("../../assets/Carousel2.png")]);
  let assets4 = useAssets([require("../../assets/Carousel3.png")]);
  let assets5 = useAssets([require("../../assets/Carousel4.1.png")]);

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

  const htmlContentWeb = `
<h1 style="font-size: 28; font-weight: normal; font-family: Poppins_500Medium; letterSpacing: 0.5; text-align: center">
Empowering university student success through gamified peer-learning. 
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
        <View accessibilityRole="none">
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
      //   img: require("../../assets/Carousel1.png"),
      img:
        Platform.OS == "web"
          ? require("../../assets/Carousel1.png")
          : assets2[0],
    },
    {
      id: "2",
      title: "Get Rewarded.",
      desc: "Earn extra credit with simple daily tasks, helping students, and participation.",
      //  img: require("../../assets/Carousel2.png"),
      img:
        Platform.OS == "web"
          ? require("../../assets/Carousel2.png")
          : assets3[0],
    },
    {
      id: "3",
      title: "More Ways to Chat.",
      desc: "Collaborate with ease between live chats and group forums. Plus, easily search by tags.",
      // img: require("../../assets/Carousel3.png"),
      img:
        Platform.OS == "web"
          ? require("../../assets/Carousel3.png")
          : assets4[0],
    },
    {
      id: "4",
      title: "Questions Solved.",
      desc: "Find study groups, mentors, or ask your teacher. Either way, get your questions answered.",
      //  img: require("../../assets/Carousel4.1.png"),
      img:
        Platform.OS == "web"
          ? require("../../assets/Carousel4.1.png")
          : assets5[0],
    },
  ];

  return Platform.OS == "web" && deviceWidth > 1000 ? (
    <ScrollView style={{ backgroundColor: "#fdfdfd" }}>
      <Helmet>
        <title>Nuubi: The chat platform for incentivized peer learning.</title>

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
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 14,
        }}
      >
        <Image
          style={{ width: 52, height: 52 }}
          source={require("../../assets/nuubiTransparent.png")}
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
            <Text style={globalStyles.h3HeadingRegular}>Sign Up</Text>
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
            <FontAwesome6 name="globe" color="#111111" size={20} />
          </TouchableOpacity>
        </View>
      </View>
      <ImageBackground
        style={{
          width: "100%",
          height: deviceWidth / 2.4,
          maxHeight: 600,
          minHeight: 250,
          marginTop: 20,
          marginBottom: 50,
        }}
        resizeMode="cover"
        source={require("../../assets/GroupSplash.png")}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
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
                marginTop: deviceWidth * 0.03,
              },
            ]}
          >
            NUUBI
          </Text>
          {/* <Text
          style={[
            globalStyles.h2HeadingMedium,
            {
              width: "50%",
              fontFamily: "Poppins_400Regular",
              fontSize: deviceWidth > 1000 ? 28 : 18,
              paddingBottom: 24,
              marginTop: deviceWidth * 0.02,
            },
          ]}
        >
          Empowering university student success through gamified
          peer-learning. 
        </Text> */}
          <View
            style={{
              width: "50%",
              paddingBottom: deviceWidth * 0.015,
              marginTop: deviceWidth * 0.02,
            }}
          >
            <RenderHTML
              source={{ html: htmlContentWeb }}
              contentWidth={deviceWidth}
              systemFonts={systemFonts}
            />
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: "#2482aa",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 14,
              width: "30%",
              borderRadius: 60,
              elevation: 3,
              maxWidth: 500,
              marginTop: deviceWidth * 0.015,
            }}
            accessibilityRole="button"
            onPress={() => navigation.navigate("SignUp")}
          >
            <Text style={globalStyles.webButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
      <View style={{ paddingHorizontal: 144, marginTop: deviceWidth * 0.06 }}>
        <Text style={globalStyles.webpageHeader}>Features</Text>
        <View style={{ paddingTop: 12 }}></View>
        <Text style={globalStyles.webpageText}>
          Nuubi provides group chats, forums for discussion and Q&A,
          gamification, anonymity, and mobile-friendly accessibility.
          Gamification includes a point system, badges, and leaderboards.
        </Text>
        <View style={{ paddingTop: 24 }}></View>
        <Text style={globalStyles.webpageText}>
          Nuubi can be used as a standalone app, or we can work with your
          university to integrate into your existing LMS, such as Canvas or
          Blackboard.
        </Text>
        <View style={{ paddingTop: 24 }}></View>

        {/*  insert the toggle here when it's ready */}
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 300,
            marginTop: 60,
          }}
        >
          <LinearGradient
            start={[0, 1]}
            end={[0, 1]}
            colors={["#24D265", "#33B7F0"]}
            locations={[0.0, 1.0]}
            accessibilityRole="none"
            style={{ width: 270, height: 540, borderRadius: 30 }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={globalStyles.webpageCardText}>
                Group Chat for dynamic, community building conversations
              </Text>
              <Image
                style={{ width: 210, height: 268, justifyContent: "center" }}
                source={require("../../assets/phoneScreen1.png")}
              />
            </View>
          </LinearGradient>
          <LinearGradient
            start={[0, 1]}
            end={[0, 1]}
            colors={["#24D265", "#33B7F0"]}
            locations={[0.0, 1.0]}
            accessibilityRole="none"
            style={{ width: 270, height: 540, borderRadius: 30 }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={globalStyles.webpageCardText}>
                Forums for discussion posts and homework help
              </Text>
              <Image
                style={{ width: 210, height: 268 }}
                source={require("../../assets/phoneScreen2.png")}
              />
            </View>
          </LinearGradient>
          <LinearGradient
            start={[0, 1]}
            end={[0, 1]}
            colors={["#24D265", "#33B7F0"]}
            locations={[0.0, 1.0]}
            accessibilityRole="none"
            style={{ width: 270, height: 540, borderRadius: 30 }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={globalStyles.webpageCardText}>
                Gamification to incentivize positive outcomes
              </Text>
              <Image
                style={{ width: 210, height: 268, justifyContent: "center" }}
                source={require("../../assets/phoneScreen3.png")}
              />
            </View>
          </LinearGradient>
          <LinearGradient
            start={[0, 1]}
            end={[0, 1]}
            colors={["#24D265", "#33B7F0"]}
            locations={[0.0, 1.0]}
            accessibilityRole="none"
            style={{ width: 270, height: 540, borderRadius: 30 }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={globalStyles.webpageCardText}>
                Anonymity and mobile friendly design to encourage participation
              </Text>
              <Image
                style={{ width: 210, height: 268, justifyContent: "center" }}
                source={require("../../assets/phoneScreen3.png")}
              />
            </View>
          </LinearGradient>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginVertical: 24,
          }}
        >
          <View style={{ width: "60%" }}>
            <Text style={globalStyles.webpageHeader2}>Benefits</Text>
            <Text style={globalStyles.webpageText}>
              Anonymity and mobile friendly design to encourage participation
            </Text>
          </View>
          <View>
            <Image
              style={{ width: 251, height: 134 }}
              resizeMode="center"
              source={require("../../assets/Carousel2.png")}
            />
          </View>
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginVertical: 24,
          }}
        >
          <View>
            <Image
              style={{ width: 251, height: 134 }}
              resizeMode="center"
              source={require("../../assets/Carousel4.1.png")}
            />
          </View>

          <View style={{ width: "60%" }}>
            <Text style={globalStyles.webpageHeader2}>Values</Text>
            <Text style={globalStyles.webpageText}>
              Nuubi is committed to accessibility, safety, inclusivity,
              empowerment and career-readiness. We adhere to the industry
              leading WCAG accessibility and HECVAT security standards.
            </Text>
          </View>
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginVertical: 24,
          }}
        >
          <View style={{ width: "60%" }}>
            <Text style={globalStyles.webpageHeader2}>Statistics</Text>
            <Text style={globalStyles.webpageText}>
              Studies show that incentivized peer learning can increase
              retention by 16 times in online learning for college students.
            </Text>
          </View>
          <View>
            <Image
              style={{ width: 251, height: 134 }}
              resizeMode="center"
              source={require("../../assets/Carousel3.png")}
            />
          </View>
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginVertical: 24,
          }}
        >
          <View>
            <Image
              style={{ width: 251, height: 134 }}
              resizeMode="center"
              source={require("../../assets/Carousel1.png")}
            />
          </View>

          <View style={{ width: "60%" }}>
            <Text style={globalStyles.webpageHeader2}>Pricing</Text>
            <Text style={globalStyles.webpageText}>
              Nuubi is currently available for free beta testing with select
              universities.
            </Text>
          </View>
        </View>

        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View style={{ paddingTop: 24 }}></View>
          <Text style={globalStyles.webpageHeader2}>
            Test it out now with a free account!
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: "#2482aa",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 14,
              marginTop: deviceWidth * 0.02,
              width: "30%",
              borderRadius: 60,
              elevation: 3,
              maxWidth: 500,
            }}
            accessibilityRole="button"
            onPress={() => navigation.navigate("SignUp")}
          >
            <Text style={globalStyles.webButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
      <LinearGradient
        start={[0, 1]}
        end={[0, 1]}
        colors={["#24D265", "#33B7F0"]}
        locations={[0.0, 1.0]}
        accessibilityRole="none"
        style={{ width: "100%", height: 350 }}
      ></LinearGradient>
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
                ? require("../../assets/nuubiTransparent45.png")
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
          {/* <TouchableOpacity
            style={{ paddingHorizontal: 5 }}
            accessibilityRole="button"
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={globalStyles.captionLink}>Log In</Text>
          </TouchableOpacity> */}
        </View>
        <RenderHTML
          source={{ html: htmlContent }}
          contentWidth={deviceWidth}
          systemFonts={systemFonts}
        />

        <View
          style={{
            width: deviceWidth,
            alignItems: "center",
            justifyContent: "space-evenly",
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
              paddingBottom: 40,
            }}
            accessibilityRole="none"
          >
            <FontAwesome6
              name="circle-info"
              color="#111111"
              size={20}
              style={{ paddingTop: 2 }}
            />
            <TouchableOpacity
              style={{ paddingVertical: 13, paddingHorizontal: 5 }}
              accessibilityRole="button"
              onPress={() => navigation.navigate("LearnMore1")}
            >
              <Text style={globalStyles.captionLink}>Learn More</Text>
            </TouchableOpacity>

            <Text style={{ paddingHorizontal: 10, fontSize: 20 }}>|</Text>
            <FontAwesome6
              name="globe"
              color="#111111"
              size={20}
              style={{ paddingTop: 2 }}
            />
            <TouchableOpacity
              style={{
                paddingVertical: 13,
                paddingHorizontal: 5,
              }}
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
const stylesCarousel = StyleSheet.create({
  container: {
    width: deviceWidth,
    alignItems: "center",
  },
  secondaryContainer: {
    width: deviceWidth,
  },
  img: {
    width: deviceWidth * 0.7,
    maxWidth: 250,
    height: deviceWidth * 0.3,
    maxHeight: 150,
  },
  dot: {
    marginTop: 24,
    marginBottom: 24,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#24D265",
    marginHorizontal: 8,
  },
});
