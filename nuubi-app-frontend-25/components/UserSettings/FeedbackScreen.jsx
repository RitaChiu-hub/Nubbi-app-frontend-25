// Imported resources
import React, { useLayoutEffect, useState } from "react";
import {
    Keyboard,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text, TextInput, TouchableOpacity,
    View
} from "react-native";


export default function FeedbackScreen({ navigation }) {
    const { goBack, navigate } = navigation;
    const [userFeedback, setUserFeedback] = useState("");

    // This effect sets the navigation options when the component mounts or when the navigation prop changes
    React.useLayoutEffect(() => {
        navigation.setOptions({
          headerTitle: () => (
            <Text style={globalStyles.screenHeader}>Feedback</Text>
          ),
          headerTitleAlign: "center",
        });
      }, [navigation]);

    // Function to handle navigation to different routes
    // const handleNavigation = (navRoute, label) => {
    //     if (navRoute === "" || !navRoute) {
    //     } else if (navRoute == "comingSoonAlert") {
    //         if (Platform.OS === "web") {
    //             window.alert("Feature coming soon!");
    //             console.log("Web alert!");
    //         } else {
    //             Alert.alert("Feature coming soon!");
    //         }
    //     } else {
    //         navigate(navRoute);
    //     }
    // };

    return (
        <SafeAreaView style={styles.container} >
            <ScrollView >
                <View
                    style={{
                        height: 590,
                        paddingTop: 30
                    }}>
                    {/* Style addition syntax */}
                    <Text style={[styles.headerText]}>Share Your Feedback</Text>
                    <Text style={[styles.text, { color: "#888888" }]}>
                        Enter in your feedback in the text field below and submit. We appreciate and value all feedback provided!
                    </Text>

                    {/* Input box */}
                    <TextInput
                        style={[styles.textInput]}
                        multiline={true}
                        placeholder=""
                        onChangeText={(e) => setUserFeedback(e)}
                        maxLength={500}
                        onBlur={Keyboard.dismiss}
                        value={userFeedback}
                    />

                    {/* Align text count and max length text */}
                    <Text style={[styles.textCount,  { textAlign: "right" }, { fontSize: 17 }, { color: "#888" }]}>
                        {userFeedback.length} of {500} characters used
                    </Text>

                    {/* "Save" button, condition for active and inactive functiionality*/}
                    <TouchableOpacity
                        style={{
                            backgroundColor: userFeedback.length <= 0 ? "#fdfdfd" : "#2482aa",
                            borderColor: userFeedback.length <= 0 ? "#123234" : "",
                            borderWidth: userFeedback.length <= 0 ? 2 : 0,
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            paddingVertical: 14,
                            width: "94%",
                            marginTop: "auto",
                            borderRadius: 60,
                            alignSelf: "center"
                            }}
                        accessibilityRole="button"
                        onPress={() => { }}
                        disabled={userFeedback.length <= 0}
                    >
                        <Text style={[styles.primaryButtonText, {color: userFeedback.length <= 0 ? "#123234"  : "#fdfdfd"}]}>Save</Text>
                    </TouchableOpacity>

                        {/* goBack function for the Cancel button  */}
                    <TouchableOpacity
                        style={{
                            backgroundColor: "#fdfdfd",
                            alignItems: "center",
                            justifyContent: "center",
                            paddingVertical: 14,
                            marginTop: 10,
                            borderRadius: 60,
                            width: "94%",
                            elevation: 3,
                            borderWidth: 2,
                            borderColor: "#123234",
                            alignSelf: "center"
                        }}
                        accessibilityRole="button"
                        onPress={() => goBack()}>
                        <Text style={styles.primaryButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );

}



// This is the styles, call by Ex.. (styles.text)
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#f8f8f8",
        justifyContent: "center",
        alignItems: "center",
        flex: 1
    },
    textCount: {
        textAlign: "right",
        marginRight: 25,
        marginLeft: 15,
        fontSize: 17,
        color: "#4d4d4d",
        alignSelf: "flex-end",
    },
    text: {
        fontSize: 19,
        color: "#4d4d4d",
        marginLeft: 15,
        marginRight: 25
    },
    textInput: {
        borderWidth: 1,
        borderColor: "#123234",
        borderRadius: 20,
        padding: 10,
        fontSize: 18,
        marginTop: 10,
        marginLeft: 15,
        marginRight: 25,
        minWidth: "90%",
        maxWidth: "90%",
        width: "100%",
        height: 200,
        alignItems: "stretch",
        textAlignVertical: "top",
    },
    headerText: {
        fontSize: 25,
        color: "#333",
        marginLeft: 15,
        marginRight: 25,
        fontWeight: "bold",
        textAlign: "left",
    },
    primaryButtonText: {
        color: "#111111",
        fontSize: 14,
        fontFamily: "Poppins_700Bold",
        letterSpacing: 1.25,
    },
});
