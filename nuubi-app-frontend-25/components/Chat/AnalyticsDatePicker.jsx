import React, { useState } from "react";
import { View, Button, Text } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const AnalyticsDatePicker = ({ onSubmit }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const onChange = (event, date) => {
    const currentDate = date || selectedDate;
    setShowPicker(false);
    setSelectedDate(currentDate);
  };

  const handleSubmit = () => {
    onSubmit(selectedDate);
  };

  return (
    <View
      style={{
        alignSelf: "flex-start",
        justifyContent: "flex-start",
        alignItems: "flex-start",
      }}
    >
      <Button onPress={() => setShowPicker(true)} title="Select Start Date" />
      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}
      <Text
        style={{
          paddingLeft: 8,
        }}
      >
        Selected Start Date: {selectedDate.toDateString()}
      </Text>
      <Button title="Get Analytics for 8 Weeks" onPress={handleSubmit} />
    </View>
  );
};

export default AnalyticsDatePicker;
