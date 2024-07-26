import React, { useState, useEffect } from 'react';
import { View, Text, Image, Dimensions, StyleSheet } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import { globalStyles } from "../../styles/global";

export default function ToggleOutline({ texts, imagePath, enlargeImage  }) {
    const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
    const [margin, setMargin] = useState(getMargin());
    const [imageMargin, setImageMargin] = useState(getImageMargin());
    const [showPhone, setShowPhone] = useState(getShowPhone());
    const [textSize, setTextSize] = useState(getTextSize())


    useEffect(() => {
    const handleInitialScreenSize = () => {
      const { width } = Dimensions.get('window');

      setMargin(getMargin(width))
      setImageMargin(getImageMargin(width))
      setShowPhone(getShowPhone(width))
      setTextSize(getTextSize(width));
      const updateWidth = () => setScreenWidth(Dimensions.get('window').width);
      Dimensions.addEventListener('change', updateWidth);
    };

    handleInitialScreenSize();

    // Listen for window resize events
    const handleChangeListener = Dimensions.addEventListener('change', handleInitialScreenSize);

    // Clean up the event listener on component unmount
    return () => {
      handleChangeListener.remove();
    };
  }, []);


    function getMargin() {
        const windowWidth = Dimensions.get('window').width;
        return windowWidth > 1280 ? 100 : 20;
      }


    function getTextSize() {
      const windowWidth = Dimensions.get('window').width;
        if (windowWidth < 800) {
          return 20;
        }
        return windowWidth > 1280 ? 24 : 18;
    }


    function getImageMargin() {
        const windowWidth = Dimensions.get('window').width;
        return windowWidth > 1280 ? 0 : 100;
    }

    function getShowPhone() {
        const windowWidth = Dimensions.get('window').width;
        return windowWidth > 1030;
      }

    const isSmallScreen = screenWidth <= 1280;

    const imageStyle = enlargeImage
    ? {
        width: 280 * 1.2,
        height: 427 * 1.2, 
        marginBottom: -50,
        marginTop: -50,
        marginLeft: -100
      }
    : {
        width: 280,
        height: 427,
      };

return (
  <LinearGradient
    start={[0, 1]}
    end={[0, 1]}
    colors={["#7DDFA0", "#87ceeb"]}
    locations={[0.0, 1.0]}
    accessibilityRole="none"
    style={[styles.container, {marginBottom: 100}]}
  >
    <View style={styles.row}>
        <View style={[styles.column, !isSmallScreen && styles.textColumn]}>
          <Text style={[globalStyles.webpageCardText, styles.text, {marginBottom: margin, fontSize: textSize}]}>{texts[0]}</Text>
          <Text style={[globalStyles.webpageCardText, {fontSize: textSize}]}>{texts[1]}</Text>
          {isSmallScreen && (
            <>
              <Text style={[globalStyles.webpageCardText, styles.text, {marginBottom: margin, fontSize: textSize}]}>{texts[2]}</Text>
              <Text style={[globalStyles.webpageCardText, {fontSize: textSize, marginBottom: -30}]}>{texts[3]}</Text>
            </>
          )}
        </View>
        {showPhone && (<View style={[styles.column, styles.imageColumn, {marginLeft: imageMargin, marginTop: imageMargin}]}>
          <Image
            style={[styles.image, imageStyle]}
            source={imagePath}
            resizeMode="contain"
          />
        </View>)}
        {!isSmallScreen && (
          <View style={styles.column}>
            <Text style={[globalStyles.webpageCardText, styles.text, {marginBottom: margin}]}>{texts[2]}</Text>
            <Text style={[globalStyles.webpageCardText]}>{texts[3]}</Text>
          </View>
        )}
      </View>
    </LinearGradient>
);
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      borderRadius: 30,
      margin: '5%',
    },
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      padding: '5%',
    },
    column: {
      flex: 1,
      minWidth: 200,
    },
    textColumn: {
      marginRight: 110,
    },
    imageColumn: {
      alignItems: 'center',
    },
    text: {
      marginBottom: 250,
    },
    image: {
      aspectRatio: 266 / 407,
      width: 280,
      height: 427,
    },
  });