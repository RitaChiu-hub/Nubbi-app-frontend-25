import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    Image,
    Dimensions,
    StyleSheet
  } from "react-native";
import { globalStyles } from "../../styles/global";

export default function InformationSection() {

  const [webpageHeader2Size, setWebpageHeader2Size] = useState(getWebpageHeader2Size())
  const [webpageTextSize, setwebpageTextSize] = useState(getWebpageTextSize())
  const [orderReverse, setOrderReverse] = useState(getOrderReverse())
  const [order, setOrder] = useState(getOrder())
  const [format, setFormat] = useState(getFormat())
  const [imageWidth, setImageWidth] = useState(getImageWidth())
  const [imageHeight, setImageHeight] = useState(getImageHeight())
  const [marginMultiplier, setMarginMultiplier] = useState(getMarginMultiplier())

  useEffect(() => {
    const handleInitialScreenSize = () => {
      const { width } = Dimensions.get('window');

      setWebpageHeader2Size(getWebpageHeader2Size(width));
      setwebpageTextSize(getWebpageTextSize(width));
      setOrderReverse(getOrderReverse(width))
      setFormat(getFormat(width))
      setImageWidth(getImageWidth(width))
      setImageHeight(getImageHeight(width))
      setOrder(getOrder(width))
      setMarginMultiplier(getMarginMultiplier(width))
    };

    handleInitialScreenSize();

    // Listen for window resize events
    const handleChangeListener = Dimensions.addEventListener('change', handleInitialScreenSize);

    // Clean up the event listener on component unmount
    return () => {
      handleChangeListener.remove();
    };
  }, []);

  function getWebpageHeader2Size() {
    const windowWidth = Dimensions.get('window').width;
    if (windowWidth < 500) {
      return 18;
    }
    return windowWidth > 1240 ? 48 : 28;
  }

  function getWebpageTextSize() {
    const windowWidth = Dimensions.get('window').width;
    if (windowWidth < 500) {
      return 10;
    }
    return windowWidth > 1240 ? 28 : 16;
  }

  function getOrderReverse() {
    const windowWidth = Dimensions.get('window').width;
    return windowWidth > 1400 ? "row" : "column-reverse";
  }

  function getOrder() {
    const windowWidth = Dimensions.get('window').width;
    return windowWidth > 1400 ? "row" : "column";
  }

  function getFormat() {
    const windowWidth = Dimensions.get('window').width;
    return windowWidth > 10000 ? "space-between" : "center";
  }

  function getImageWidth() {
    const windowWidth = Dimensions.get('window').width;
    return windowWidth > 1240 ? 1 : 0.58;
  }

  function getImageHeight() {
    const windowWidth = Dimensions.get('window').width;
    return windowWidth > 1240 ? 1 : 0.58;
  }

  function getMarginMultiplier() {
    const windowWidth = Dimensions.get('window').width;
    return windowWidth > 1400 ? 1 : 0;
  }

    return (
      <View style={{
      }}>

        <View
          style={[styles.shadow, {
            flex: 1,
            flexDirection: orderReverse,
            alignItems: "center",
            justifyContent: format,
            marginVertical: 24,
            paddingTop: 10,
            //flexWrap: "wrap-reverse",
            marginBottom: 100
          }]}
        >
          <View style={{ width: "60%", marginTop: 50 * marginMultiplier, marginBottom: 20 * marginMultiplier }}>
              <Text style={[globalStyles.webpageHeader2, {fontSize:webpageHeader2Size, marginBottom: 30}]}>Benefits</Text>
              <Text style={[globalStyles.webpageText, {fontSize: webpageTextSize, marginBottom: 50}]}>
                  Nuubi boosts student success metrics, enhancing engagement
                  and retention rates through its gamified approach.
              </Text>
          </View>
            <View>
              <Image
                style={{ width: 377 * imageWidth, height: 201 * imageHeight, marginBottom: 70}}
                resizeMode="center"
                source={require("../../assets/Carousel2.png")}
              />
            </View>
        </View>


        <View
          style={[styles.shadow,{
            flex: 1,
            flexDirection: order,
            alignItems: "center",
            justifyContent: format,
            marginVertical: 24,
            //flexWrap: "wrap",
            marginBottom: 100
          }]}
        >

          <View style={{minWidth: 100}}>
            <Image
              style={{ width: 302 * imageWidth, height: 161 * imageHeight, marginRight: 60, marginBottom: 50, marginTop: 20}}
              resizeMode="center"
              source={require("../../assets/Carousel4.1.png")}
            />
          </View>

          <View style={{ width: "60%", marginTop: 50 * marginMultiplier, marginBottom: 10 * marginMultiplier }}>
            <Text style={[globalStyles.webpageHeader2, {fontSize:webpageHeader2Size, marginBottom: 30}]}>Statistics</Text>
            <Text style={[globalStyles.webpageText, {fontSize: webpageTextSize, marginBottom: 60}]}>
              Studies show that incentivized peer learning can increase
              retention by 16 times in online learning for college students.
            </Text>
          </View>
        </View>

        <View
          style={[styles.shadow, {
            flex: 1,
            flexDirection: orderReverse,
            alignItems: "center",
            justifyContent: format,
            marginVertical: 24,
            //flexWrap: "wrap-reverse",
            marginBottom: 100,
            minHeight: 250
          }]}
        >
          <View style={{ width: "60%", marginTop: 140 * marginMultiplier, marginBottom: 80 * marginMultiplier }}>
            <Text style={[globalStyles.webpageHeader2, {fontSize:webpageHeader2Size, marginBottom: 30}]}>Values</Text>
            <Text style={[globalStyles.webpageText, {fontSize: webpageTextSize, marginBottom: 60}]}>
              Nuubi is committed to accessibility, safety, inclusivity,
              empowerment and career-readiness. We adhere to the industry
              leading WCAG accessibility and HECVAT security standards.
            </Text>
          </View>
          <View>
            <Image
              style={{ width: 377 * imageWidth, height: 201 * imageHeight, marginBottom: 70 * marginMultiplier, marginTop: 60}}
              resizeMode="center"
              source={require("../../assets/Carousel1.png")}
            />
          </View>
        </View>

        <View
          style={[ styles.shadow,{
            flex: 1,
            flexDirection: order,
            alignItems: "center",
            justifyContent: format,
            marginVertical: 24,
            //flexWrap: "wrap",
            marginBottom: 100
          }]}
        >

          <View>
            <Image
              style={{ width: 377 * imageWidth, height: 201 * imageHeight, marginRight: 60, marginBottom: 30}}
              resizeMode="center"
              source={require("../../assets/Carousel3.png")}
            />
          </View>

          <View style={{ width: "60%" }}>
            <Text style={[globalStyles.webpageHeader2, {fontSize:webpageHeader2Size, marginBottom: 30}]}>Pricing</Text>
            <Text style={[globalStyles.webpageText, {fontSize: webpageTextSize, marginBottom: 20}]}>
              Nuubi is currently available for free beta testing with select
              universities.
            </Text>
          </View>
        </View>
        </View>
    )
}

export const styles = StyleSheet.create({
  shadow: {
    borderRadius: 30,
    shadowColor: "#000",
    borderWidth: 1.5,
    borderColor: "#C0C0C0",
    borderStyle: "solid",
    shadowOffset: {
      width: 7,
      height: 7,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 3,
      overflow: 'visible'
  }
})