import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    Image,
    Dimensions,
  } from "react-native";
import { globalStyles } from "../../styles/global";
import { LinearGradient } from "expo-linear-gradient";

export default function FeatureCard() {


const [cardOrientation, setCardOrientation] = useState(getCardOrientation())

useEffect(() => {
    const handleInitialScreenSize = () => {
      const { width } = Dimensions.get('window');

      setCardOrientation(getCardOrientation(width))
    };

    handleInitialScreenSize();

    // Listen for window resize events
    const handleChangeListener = Dimensions.addEventListener('change', handleInitialScreenSize);

    // Clean up the event listener on component unmount
    return () => {
      handleChangeListener.remove();
    };
  }, []);

  function getCardOrientation() {
    const windowWidth = Dimensions.get('window').width;
    return windowWidth > 1265 ? "row" : "column";
  }

    return (
    <View
        style={{
          flexDirection: "row",
          //flexDirection: cardOrientation,
          justifyContent: "center",
          flexWrap: "wrap",
          marginBottom: 100,
          marginTop: 60,
          flex: 1
        }}
      >


        <LinearGradient
          start={[0, 1]}
          end={[0, 1]}
          colors={["#7DDFA0", "#87ceeb"]}
          locations={[0.0, 1.0]}
          accessibilityRole="none"
          style={{ width: 270, height: 540, borderRadius: 30, marginRight: 40, marginBottom: 40}}
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
          colors={["#7DDFA0", "#87ceeb"]}
          locations={[0.0, 1.0]}
          accessibilityRole="none"
          style={{ width: 270, height: 540, borderRadius: 30 , marginRight: 40, marginBottom: 40}}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "space-between",
              alignItems: "center"
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
          colors={["#7DDFA0", "#87ceeb"]}
          locations={[0.0, 1.0]}
          accessibilityRole="none"
          style={{ width: 270, height: 540, borderRadius: 30, marginRight: 40, marginBottom: 40}}
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
          colors={["#7DDFA0", "#87ceeb"]}
          locations={[0.0, 1.0]}
          accessibilityRole="none"
          style={{ width: 270, height: 540, borderRadius: 30, marginRight: 40}}
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
    )
}