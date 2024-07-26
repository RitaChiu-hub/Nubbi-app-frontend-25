import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    Image,
    Dimensions,
    StyleSheet
  } from "react-native";
import { globalStyles } from "../../styles/global";
import { LinearGradient } from "expo-linear-gradient";
import Link from "./Link";

export default function Footer() {
    const [format, setFormat] = useState(getFormat())
    const [allignment, setAllignment] = useState(getAllignment())
    const [bottomFooterMargin, setBottomFooterMargin] = useState(getBottomFooterMargin())
    const [footerTextMargin, setFooterTextMargin] = useState(getFooterTextMargin())
    const [bottomFormat, setBottomFormat] = useState(getBottomFormat())
    const [size, setSize] = useState(getSize())

    useEffect(() => {
        const handleInitialScreenSize = () => {
        const { width } = Dimensions.get('window');
        setFormat(getFormat(width))
        setAllignment(getAllignment(width))
        setBottomFooterMargin(getBottomFooterMargin(width))
        setFooterTextMargin(getFooterTextMargin(width))
        setBottomFormat(getBottomFormat(width))
        setSize(getSize(width))
    };

    handleInitialScreenSize();

    // Listen for window resize events
    const handleChangeListener = Dimensions.addEventListener('change', handleInitialScreenSize);

    return () => {
      handleChangeListener.remove();
    };
    }, []);

  function getFormat() {
    const windowWidth = Dimensions.get('window').width;
    return windowWidth > 1260 ? "row" : "column";
  }

  function getBottomFormat() {
    const windowWidth = Dimensions.get('window').width;
    return windowWidth > 600 ? "row" : "column";
  }

  function getAllignment() {
    const windowWidth = Dimensions.get('window').width;
    return windowWidth > 1260 ? "flex-start" : "center";
  }

  function getBottomFooterMargin() {
    const windowWidth = Dimensions.get('window').width;
    return windowWidth > 1260 ? 0 : 40;
  }

  function getFooterTextMargin() {
    const windowWidth = Dimensions.get('window').width;
    return windowWidth > 1260 ? 0 : 40;
  }

  function getSize() {
    const windowWidth = Dimensions.get('window').width;
    return windowWidth > 1260 ? 350 : 600;
  }

    return (
    <View style={{marginTop: 150}}>
        <LinearGradient 
            start={[0, 1]}
            end={[0, 1]}
            colors={["#7DDFA0", "#87ceeb"]}
            locations={[0.0, 1.0]}
            accessibilityRole="none"
            style={{ width: '100%', height: 2.5}}>
        </LinearGradient>
        <View style={{width: "100%", height: size, backgroundColor:"#2482AA1A", alignItems: "center", justifyContent: "center"}}>

           {/* <View style={{borderBottomWidth:1, height: "50%", borderBottomColor: "black", flexDirection: format, width: "80%", alignItems: allignment, justifyContent: "space-between", marginTop: -80}}>
                <View style={{flexDirection: "row", alignItems: "flex-start", width: "15%"}}>
                    <Text style={[globalStyles.h3HeadingRegular, {marginLeft: 25, marginBottom: 70, fontSize: 22, marginTop: 80, marginRight: 80}]}>About</Text>
                    <Text style={[globalStyles.h3HeadingRegular, {marginBottom: 70, fontSize: 22, marginTop: 80}]}>Help</Text>
                </View>
                <View style={{flexDirection: "row", alignItems: "flex-start", width: "35%"}}>
                    <Link url="https://play.google.com/store/apps/details?id=com.kittykat.nuubiapp&hl=en">
                        <Image
                            style={{ width: 200, height: 64, marginTop: 70, marginRight: 80}}
                            source={require("../../assets/GooglePlay.png")}
                        />
                    </Link>
                    <Link url="https://apps.apple.com/us/app/nuubi/id6447013076">
                        <Image
                            style={{ width: 200, height: 64, marginRight: 25, marginTop: 70}}
                            source={require("../../assets/AppStore.png")}
                        />
                    </Link>
                </View>
           </View> */}

<View style={{
  width: "100%",
  alignItems: "center",
  marginTop: -80
}}>
  <View style={{
    borderBottomWidth: 1,
    borderBottomColor: "black",
    flexDirection: format,
    width: "80%",
    alignItems: allignment,
    justifyContent: "space-between",
    paddingBottom: 70  // Add padding to ensure content is above the border
  }}>
    <View style={{flexDirection: "row", alignItems: "flex-start"}}>
      <Text style={[globalStyles.h3HeadingRegular, {marginRight: 80, fontSize: 22, marginTop: 80}]}>About</Text>
      <Text style={[globalStyles.h3HeadingRegular, {fontSize: 22, marginTop: 80}]}>Help</Text>
    </View>
    <View style={{flexDirection: "row", alignItems: "flex-start"}}>
      <Link url="https://play.google.com/store/apps/details?id=com.kittykat.nuubiapp&hl=en" style={{marginRight: 80}}>
        <Image
          style={{ width: 200, height: 64, marginTop: 70, marginRight: 60}}
          source={require("../../assets/GooglePlay.png")}
        />
      </Link>
      <Link url="https://apps.apple.com/us/app/nuubi/id6447013076">
        <Image
          style={{ width: 200, height: 64, marginTop: 70}}
          source={require("../../assets/AppStore.png")}
        />
      </Link>
    </View>
  </View>
</View>

           <View style={{
                width: "100%",
                flexDirection: format,
                marginTop: 60,
                justifyContent: "space-between",
                alignItems: allignment,
                paddingHorizontal: "10%"
            }}>
                <View style={{flex: 1, alignItems: allignment, flexDirection: bottomFormat, marginBottom: bottomFooterMargin}}>
                    <View style={{flexDirection: "row", marginRight: 40}}>
                        <Image
                            style={{ width: 60, height: 60, marginRight: 12}}
                            source={require("../../assets/nuubi_Logo_BW.png")}
                        />
                        <Text style={[globalStyles.webpageHeader2, {fontSize: 35, alignSelf: "flex-start"}]}>NUUBI</Text>
                    </View>
                    <View style={{flex: 1, flexDirection: "row"}}>
                        <Link url="https://www.nuubi.app/">
                            <Text style={[globalStyles.caption, {fontSize: 20, marginTop: 10, marginRight: 40}]}>Privacy</Text>
                        </Link>
                        <Link url="https://www.nuubi.app/">
                            <Text style={[globalStyles.caption, {fontSize: 20, marginTop: 10}]}>Terms Of Service</Text>
                        </Link>
                    </View>
                </View>
                <View style={{flex: 1, flexDirection: "row", justifyContent: "flex-end"}}>
                    <Link url="https://www.instagram.com/nuubi.app/">
                        <Image
                            style={{ width: 50, height: 50, marginRight: 40}}
                            source={require("../../assets/Instagram.png")}
                        />
                    </Link>
                    <Link url="https://www.facebook.com/nuubiapp/">
                        <Image
                            style={{ width: 55, height: 55, marginTop: -5, marginRight: 40}}
                            source={require("../../assets/Facebook.png")}
                        />
                    </Link>
                    <Link url="https://www.linkedin.com/company/nuubi-app/">
                        <Image
                            style={{ width: 40, height: 40, marginTop: 3, marginRight: 40}}
                            source={require("../../assets/Linkedin.png")}
                        />
                    </Link>
                    <Link url="https://www.tiktok.com/@nuubi.app">
                        <Image
                            style={{ width: 40, height: 40, marginTop: 5, marginRight: 40}}
                            source={require("../../assets/TikTok.png")}
                        />
                    </Link>
                </View>
            </View>
        </View>
    </View>
    );
}