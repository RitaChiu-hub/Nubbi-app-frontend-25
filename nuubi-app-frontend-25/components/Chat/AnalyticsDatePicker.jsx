import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Alert,
  StyleSheet,
  Dimensions,
} from "react-native";
import { nuubiColors, globalStyles } from "../../styles/global";
import DateTimePicker from "@react-native-community/datetimepicker";
import Papa from "papaparse";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

let downloadCSVWeb;
if (Platform.OS === "web") {
  downloadCSVWeb = require("./DownloadCsvWeb").downloadCSVWeb;
}

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
    console.log("Download button clicked");

    if (!members || members.length === 0) {
      console.log("no members");
      Alert.alert("No data", "There is no analytics data to export.");
      return;
    }

    console.log("Members:", members);

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
    console.log("Generated CSV:", csv);

    if (Platform.OS === "web") {
      downloadCSVWeb(csv);
    } else {
      try {
        const fileUri = FileSystem.documentDirectory + "group-analytics.csv";
        await FileSystem.writeAsStringAsync(fileUri, csv, {
          encoding: FileSystem.EncodingType.UTF8,
        });

        console.log("CSV saved to:", fileUri);

        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
          await Sharing.shareAsync(fileUri);
        } else {
          Alert.alert("Saved", `CSV saved to ${fileUri}`);
        }
      } catch (e) {
        console.error("Mobile CSV download failed:", e);
        Alert.alert("Error", "Could not export CSV on mobile.");
      }
    }
  };

  return (
    <View style={styles.wrapper}>
      {/* ───── collapsed button ───── */}
      {!showForm && (
        <TouchableOpacity
          style={styles.expandBtn}
          onPress={() => setShowForm(true)}
        >
          <Text
            style={[
              globalStyles.primaryButtonText,
              { fontFamily: "Poppins_600SemiBold" }, // or "Poppins_500Medium"
            ]}
          >
            📊 Generate Analytics
          </Text>
        </TouchableOpacity>
      )}

      {/* ───── expanded form ───── */}
      {showForm && (
        <View style={styles.formBox}>
          {/* Start date ‑ platform branch */}
          {Platform.OS === "web" ? (
            <>
              <Text style={styles.label}>Start Date:</Text>
              <input
                type="date"
                value={startDate.toISOString().split("T")[0]}
                onChange={(e) => setStartDate(new Date(e.target.value))}
                style={styles.dateInput}
              />
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.dateBtn}
                onPress={() => setShowStartPicker(true)}
              >
                <Text style={styles.dateBtnText}>
                  Start: {startDate.toDateString()}
                </Text>
              </TouchableOpacity>
              {showStartPicker && (
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  display="default"
                  onChange={(e, d) => {
                    setShowStartPicker(false);
                    if (d) setStartDate(d);
                  }}
                />
              )}
            </>
          )}

          {/* End date */}
          {Platform.OS === "web" ? (
            <>
              <Text style={styles.label}>End Date:</Text>
              <input
                type="date"
                value={endDate.toISOString().split("T")[0]}
                onChange={(e) => setEndDate(new Date(e.target.value))}
                style={styles.dateInput}
              />
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.dateBtn}
                onPress={() => setShowEndPicker(true)}
              >
                <Text style={styles.dateBtnText}>
                  End: {endDate.toDateString()}
                </Text>
              </TouchableOpacity>
              {showEndPicker && (
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  display="default"
                  onChange={(e, d) => {
                    setShowEndPicker(false);
                    if (d) setEndDate(d);
                  }}
                />
              )}
            </>
          )}

          <Text style={styles.helper}>
            📅 Analytics are grouped by full weeks (Monday to Sunday)
          </Text>

          <TouchableOpacity style={styles.actionBtn} onPress={handleSubmit}>
            <Text
              style={[
                globalStyles.primaryButtonText,
                { fontFamily: "Poppins_600SemiBold" }, // or "Poppins_500Medium"
              ]}
            >
              ✅ Generate Analytics
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.csvBtn} onPress={handleDownloadCSV}>
            <Text
              style={[
                globalStyles.primaryButtonText,
                { fontFamily: "Poppins_600SemiBold" }, // or "Poppins_500Medium"
              ]}
            >
              ⬇️ Download CSV
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const deviceWidth = Dimensions.get("window").width;
/* ---------- Nuubi‑styled local styles ---------- */
const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    maxWidth: Platform.OS === "web" ? 600 : deviceWidth - 32, // 16 px padding on each side
    alignSelf: "center",
  },

  expandBtn: {
    backgroundColor: nuubiColors.darkerBlue,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 60,
    alignItems: "center",
  },

  formBox: {
    borderWidth: 4,
    borderColor: nuubiColors.darkerBlue,
    borderRadius: 12,
    padding: 16,
    backgroundColor: nuubiColors.white,
    width: Platform.OS === "web" ? "100%" : deviceWidth * 0.9, // 90 % width on mobile
    alignSelf: "center",
  },

  label: {
    ...globalStyles.bodyRegular,
    marginBottom: 4,
  },

  dateInput: {
    padding: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: nuubiColors.lightestGray,
    borderRadius: 8,
    fontFamily: "Poppins_400Regular",
  },

  dateBtn: {
    backgroundColor: nuubiColors.primaryBlue,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },

  dateBtnText: {
    color: nuubiColors.white,
    textAlign: "center",
    fontFamily: "Poppins_500Medium",
  },

  helper: {
    ...globalStyles.caption,
    marginVertical: 10,
  },

  actionBtn: {
    backgroundColor: nuubiColors.darkerGreen,
    paddingVertical: 14,
    borderRadius: 60,
    alignItems: "center",
    marginTop: 10,
  },

  csvBtn: {
    backgroundColor: nuubiColors.darkerBlue,
    paddingVertical: 14,
    borderRadius: 60,
    alignItems: "center",
    marginTop: 12,
  },
});

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
//           </Text>

//           {/* Generate Analytics Button */}
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

//           {/* CSV Export Button */}
//           <TouchableOpacity
//             onPress={handleDownloadCSV}
//             style={{
//               backgroundColor: "#2482AA",
//               padding: 12,
//               borderRadius: 8,
//               marginTop: 12,
//             }}
//           >
//             <Text
//               style={{
//                 color: "white",
//                 textAlign: "center",
//                 fontWeight: "bold",
//               }}
//             >
//               ⬇️ Download Analytics as CSV
//             </Text>
//           </TouchableOpacity>
//         </>
//       )}
//     </View>
//   );
// }
