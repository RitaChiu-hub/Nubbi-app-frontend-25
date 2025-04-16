import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  TextInput,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function AnalyticsDatePicker({ onSubmit }) {
  const [showForm, setShowForm] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleSubmit = () => {
    if (!startDate || !endDate) {
      alert("Please select both a start and end date");
      return;
    }

    const formattedStart = new Date(startDate).toISOString().split("T")[0];
    const formattedEnd = new Date(endDate).toISOString().split("T")[0];
    onSubmit(formattedStart, formattedEnd);
  };

  return (
    <View style={{ padding: 16 }}>
      {!showForm ? (
        <TouchableOpacity
          onPress={() => setShowForm(true)}
          style={{
            backgroundColor: "#3B82F6",
            padding: 12,
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          <Text style={{ color: "white", textAlign: "center", fontSize: 16 }}>
            📊 Click here to generate weekly analytics
          </Text>
        </TouchableOpacity>
      ) : (
        <>
          {/* Start Date */}
          {Platform.OS === "web" ? (
            <>
              <Text style={{ marginBottom: 4 }}>Start Date:</Text>
              <input
                type="date"
                value={startDate.toISOString().split("T")[0]}
                onChange={(e) => setStartDate(new Date(e.target.value))}
                style={{ padding: 8, marginBottom: 12 }}
              />
            </>
          ) : (
            <>
              <TouchableOpacity
                onPress={() => setShowStartPicker(true)}
                style={{
                  backgroundColor: "#3B82F6",
                  padding: 10,
                  borderRadius: 6,
                  marginBottom: 10,
                }}
              >
                <Text style={{ color: "white", textAlign: "center" }}>
                  Start: {startDate.toDateString()}
                </Text>
              </TouchableOpacity>
              {showStartPicker && (
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowStartPicker(false);
                    if (selectedDate) setStartDate(selectedDate);
                  }}
                />
              )}
            </>
          )}

          {/* End Date */}
          {Platform.OS === "web" ? (
            <>
              <Text style={{ marginTop: 10, marginBottom: 4 }}>End Date:</Text>
              <input
                type="date"
                value={endDate.toISOString().split("T")[0]}
                onChange={(e) => setEndDate(new Date(e.target.value))}
                style={{ padding: 8, marginBottom: 12 }}
              />
            </>
          ) : (
            <>
              <TouchableOpacity
                onPress={() => setShowEndPicker(true)}
                style={{
                  backgroundColor: "#3B82F6",
                  padding: 10,
                  borderRadius: 6,
                  marginBottom: 10,
                }}
              >
                <Text style={{ color: "white", textAlign: "center" }}>
                  End: {endDate.toDateString()}
                </Text>
              </TouchableOpacity>
              {showEndPicker && (
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowEndPicker(false);
                    if (selectedDate) setEndDate(selectedDate);
                  }}
                />
              )}
            </>
          )}

          {/* Info */}
          <Text style={{ fontSize: 14, marginVertical: 10 }}>
            📅 Your analytics will be grouped by full weeks (Monday–Sunday).
            Partial weeks are excluded.
          </Text>

          {/* Submit */}
          <TouchableOpacity
            onPress={handleSubmit}
            style={{
              backgroundColor: "green",
              padding: 12,
              borderRadius: 8,
              marginTop: 10,
            }}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              ✅ Generate Analytics
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

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
