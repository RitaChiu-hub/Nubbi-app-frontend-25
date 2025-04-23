import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

export default function AnalyticsDatePicker({
  onSubmit,
  members,
  weekColumns,
}) {
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

  const handleDownloadCSV = async () => {
    console.log(" DOWNLOADING CSV!!!! ");
    if (!members || members.length === 0) {
      Alert.alert("No data", "There is no analytics data to export.");
      return;
    }

    const flattened = members.map((member) => {
      const base = {
        Username: member.username,
        Email: member.email,
        "Total Points": member.total.points,
        "Total Posts": member.total.posts,
        "Total Replies": member.total.comments,
        "Total Chats": member.total.messages,
      };

      weekColumns?.forEach((week) => {
        const weekData = member[week] || {
          points: 0,
          posts: 0,
          comments: 0,
          messages: 0,
        };
        base[`${week}_points`] = weekData.points;
        base[`${week}_posts`] = weekData.posts;
        base[`${week}_replies`] = weekData.comments;
        base[`${week}_chats`] = weekData.messages;
      });

      return base;
    });

    const csv = Papa.unparse(flattened);

    console.log("  CSV!!!! :  " + csv);

    if (Platform.OS === "web") {
      console.log("  hi from web!!");

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, "group-analytics.csv");
    } else {
      const fileUri = FileSystem.documentDirectory + "group-analytics.csv";
      await FileSystem.writeAsStringAsync(fileUri, csv, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      await Sharing.shareAsync(fileUri);
    }
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

          {/* Generate Analytics Button */}
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

          {/* CSV Export Button */}
          <TouchableOpacity
            onPress={handleDownloadCSV}
            style={{
              backgroundColor: "#6366F1",
              padding: 12,
              borderRadius: 8,
              marginTop: 12,
            }}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              ⬇️ Download Analytics as CSV
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Platform,
//   TextInput,
// } from "react-native";
// import DateTimePicker from "@react-native-community/datetimepicker";

// export default function AnalyticsDatePicker({ onSubmit }) {
//   const [showForm, setShowForm] = useState(false);
//   const [startDate, setStartDate] = useState(new Date());
//   const [endDate, setEndDate] = useState(new Date());

//   const [showStartPicker, setShowStartPicker] = useState(false);
//   const [showEndPicker, setShowEndPicker] = useState(false);

//   const handleSubmit = () => {
//     if (!startDate || !endDate) {
//       alert("Please select both a start and end date");
//       return;
//     }

//     const formattedStart = new Date(startDate).toISOString().split("T")[0];
//     const formattedEnd = new Date(endDate).toISOString().split("T")[0];
//     onSubmit(formattedStart, formattedEnd);
//   };

//   return (
//     <View style={{ padding: 16 }}>
//       {!showForm ? (
//         <TouchableOpacity
//           onPress={() => setShowForm(true)}
//           style={{
//             backgroundColor: "#3B82F6",
//             padding: 12,
//             borderRadius: 8,
//             marginBottom: 16,
//           }}
//         >
//           <Text style={{ color: "white", textAlign: "center", fontSize: 16 }}>
//             📊 Click here to generate weekly analytics
//           </Text>
//         </TouchableOpacity>
//       ) : (
//         <>
//           {/* Start Date */}
//           {Platform.OS === "web" ? (
//             <>
//               <Text style={{ marginBottom: 4 }}>Start Date:</Text>
//               <input
//                 type="date"
//                 value={startDate.toISOString().split("T")[0]}
//                 onChange={(e) => setStartDate(new Date(e.target.value))}
//                 style={{ padding: 8, marginBottom: 12 }}
//               />
//             </>
//           ) : (
//             <>
//               <TouchableOpacity
//                 onPress={() => setShowStartPicker(true)}
//                 style={{
//                   backgroundColor: "#3B82F6",
//                   padding: 10,
//                   borderRadius: 6,
//                   marginBottom: 10,
//                 }}
//               >
//                 <Text style={{ color: "white", textAlign: "center" }}>
//                   Start: {startDate.toDateString()}
//                 </Text>
//               </TouchableOpacity>
//               {showStartPicker && (
//                 <DateTimePicker
//                   value={startDate}
//                   mode="date"
//                   display="default"
//                   onChange={(event, selectedDate) => {
//                     setShowStartPicker(false);
//                     if (selectedDate) setStartDate(selectedDate);
//                   }}
//                 />
//               )}
//             </>
//           )}

//           {/* End Date */}
//           {Platform.OS === "web" ? (
//             <>
//               <Text style={{ marginTop: 10, marginBottom: 4 }}>End Date:</Text>
//               <input
//                 type="date"
//                 value={endDate.toISOString().split("T")[0]}
//                 onChange={(e) => setEndDate(new Date(e.target.value))}
//                 style={{ padding: 8, marginBottom: 12 }}
//               />
//             </>
//           ) : (
//             <>
//               <TouchableOpacity
//                 onPress={() => setShowEndPicker(true)}
//                 style={{
//                   backgroundColor: "#3B82F6",
//                   padding: 10,
//                   borderRadius: 6,
//                   marginBottom: 10,
//                 }}
//               >
//                 <Text style={{ color: "white", textAlign: "center" }}>
//                   End: {endDate.toDateString()}
//                 </Text>
//               </TouchableOpacity>
//               {showEndPicker && (
//                 <DateTimePicker
//                   value={endDate}
//                   mode="date"
//                   display="default"
//                   onChange={(event, selectedDate) => {
//                     setShowEndPicker(false);
//                     if (selectedDate) setEndDate(selectedDate);
//                   }}
//                 />
//               )}
//             </>
//           )}

//           {/* Info */}
//           <Text style={{ fontSize: 14, marginVertical: 10 }}>
//             📅 Your analytics will be grouped by full weeks (Monday–Sunday).
//             Partial weeks are excluded.
//           </Text>

//           {/* Submit */}
//           <TouchableOpacity
//             onPress={handleSubmit}
//             style={{
//               backgroundColor: "green",
//               padding: 12,
//               borderRadius: 8,
//               marginTop: 10,
//             }}
//           >
//             <Text
//               style={{
//                 color: "white",
//                 textAlign: "center",
//                 fontWeight: "bold",
//               }}
//             >
//               ✅ Generate Analytics
//             </Text>
//           </TouchableOpacity>
//         </>
//       )}
//     </View>
//   );
// }
