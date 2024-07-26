import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ToggleOutline from './ToggleOutline';

export default function ToggleSection() {
  const [selected, setSelected] = useState('Teacher');

  const options = ['Teacher', 'Students', 'Admin'];

  // Text and images to fill in toggle outline
  const sections = {
    Teacher: {
      texts: [
        "Group Chat for dynamic, community building conversations",
        "Forums for discussion posts and homework help",
        "Gamification to incentivize positive outcomes",
        "Anonymity and mobile friendly design to encourage participation"
      ],
      imagePath: require("../../assets/PhoneScreen8.png")
    },
    Students: {
      texts: [
        "Anonymous discussions with your peers",
        "Earn points and badges for participation",
        "Get help with your homework questions",
        "Mobile Friendly design so you can learn on the go"
      ],
      imagePath: require("../../assets/PhoneScreen6.png")
    },
    Admin: {
      texts: [
        "Boost student engagement with gamification",
        "Seamless integration with your LMS",
        "Reach more students with push notifications",
        "Reward actions that promote student retention"
      ],
      imagePath: require("../../assets/PhoneScreen7.png")
    }
  };

  // Render outline with text and image
  const renderContent = () => {
    const section = sections[selected];
    return (
      <ToggleOutline 
        texts={section.texts}
        imagePath={section.imagePath}
        enlargeImage={selected === 'Admin' || selected === 'Teacher'}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.toggleWrapper}>
        <View style={styles.toggleContainer}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.toggleButton,
                selected === option && styles.toggleButtonActive,
              ]}
              onPress={() => setSelected(option)}
            >
              <Text
                style={[
                  styles.toggleText,
                  selected === option && styles.toggleTextActive,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.content}>{renderContent()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  toggleWrapper: {
    width: '80%',
    maxWidth: 500,
    minWidth: 300
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
    borderRadius: 30,
    padding: 2,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 30,
  },
  toggleButtonActive: {
    backgroundColor: 'white',
  },
  toggleText: {
    color: '#050505',
    fontSize: 20,
    fontFamily: "Poppins_500Medium",
  },
  toggleTextActive: {
    color: '#895EC5',
  },
  content: {
    marginTop: 20,
    alignItems: 'center',
    flex: 1,
    width: '100%',
  },
});