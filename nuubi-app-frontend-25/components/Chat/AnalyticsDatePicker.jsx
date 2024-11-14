import React, { useState } from "react";
import { View, Button, Text, Platform } from "react-native";
import { DatePickerModal } from "react-native-paper-dates"; // Date picker modal
import { useTheme } from "react-native-paper"; // Optional for theme customization
import { registerTranslation } from "react-native-paper-dates";
registerTranslation("en", {
  save: "Save",
  selectSingle: "Select date",
  selectMultiple: "Select dates",
  selectRange: "Select period",
  notAccordingToDateFormat: (inputFormat) =>
    `Date format must be ${inputFormat}`,
  mustBeHigherThan: (date) => `Must be later then ${date}`,
  mustBeLowerThan: (date) => `Must be earlier then ${date}`,
  mustBeBetween: (startDate, endDate) =>
    `Must be between ${startDate} - ${endDate}`,
  dateIsDisabled: "Day is not allowed",
  previous: "Previous",
  next: "Next",
  typeInDate: "Type in date",
  pickDateFromCalendar: "Pick date from calendar",
  close: "Close",
});
const AnalyticsDatePicker = ({ onSubmit }) => {
  //const { colors } = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [visible, setVisible] = useState(false); // Show or hide the modal

  const onDateChange = (date) => {
    setSelectedDate(date);
    setVisible(false); // Close the modal after selection
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
      <Button title="Select Start Date" onPress={() => setVisible(true)} />

      {/* Date Picker Modal */}
      <DatePickerModal
        mode="single"
        label="Select Date"
        saveLabel="Save"
        locale="en"
        visible={visible}
        date={selectedDate}
        onDismiss={() => setVisible(false)} // Dismiss modal without changing date
        onConfirm={({ date }) => onDateChange(date)} // Confirm date selection
      />

      <Text
        style={{ marginVertical: 5, marginLeft: Platform.OS !== "web" ? 8 : 0 }}
      >
        Selected Start Date: {selectedDate.toDateString()}
      </Text>
      <Button title="Get Analytics for 8 Weeks" onPress={handleSubmit} />
    </View>
  );
};

export default AnalyticsDatePicker;

// import React, { useState } from "react";
// import { View, Button, Text } from "react-native";
// import DateTimePicker from "@react-native-community/datetimepicker";

// const AnalyticsDatePicker = ({ onSubmit }) => {
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [showPicker, setShowPicker] = useState(false);

//   const onChange = (event, date) => {
//     const currentDate = date || selectedDate;
//     setShowPicker(false);
//     setSelectedDate(currentDate);
//   };

//   const handleSubmit = () => {
//     onSubmit(selectedDate);
//   };

//   return (
//     <View
//       style={{
//         alignSelf: "flex-start",
//         justifyContent: "flex-start",
//         alignItems: "flex-start",
//       }}
//     >
//       <Button onPress={() => setShowPicker(true)} title="Select Start Date" />
//       {showPicker && (
//         <DateTimePicker
//           value={selectedDate}
//           mode="date"
//           display="default"
//           onChange={onChange}
//         />
//       )}
//       <Text
//         style={{
//           paddingLeft: 8,
//         }}
//       >
//         Selected Start Date: {selectedDate.toDateString()}
//       </Text>
//       <Button title="Get Analytics for 8 Weeks" onPress={handleSubmit} />
//     </View>
//   );
// };

// export default AnalyticsDatePicker;
