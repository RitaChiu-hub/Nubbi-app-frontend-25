import * as React from "react";
import {
  Text,
  View,
  FlatList,
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { AccountContext } from "../AccountContext";
import { globalStyles } from "../../styles/global";
import { useIsFocused } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import AnalyticsDatePicker from "./AnalyticsDatePicker";

export default function GroupAnalytics({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [members, setMembers] = React.useState([]);
  const isFocused = useIsFocused();
  const [loading, setLoading] = React.useState(false);

  const getWeeklyGroupInfo = async (startDate, endDate) => {
    setLoading(true);
    const token =
      Platform.OS !== "web"
        ? await SecureStore.getItemAsync("token")
        : sessionStorage.getItem("token");

    try {
      const response = await fetch(
        `https://coral-app-n96bn.ondigitalocean.app/groups/getweeklygroupinfo`,
        //  `http://localhost:8080/groups/getweeklygroupinfo`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            currentGroup: user.currentGroup,
            startDate,
            endDate,
          }),
        }
      );

      const jsonData = await response.json();
      setMembers(jsonData);
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
    }
    setLoading(false);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingWhite}>Group Analytics</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  React.useEffect(() => {
    // Clear out previous group’s data whenever group changes or screen is focused
    setMembers([]);
  }, [user.currentGroup, isFocused]);

  const maxUsernameWidth = React.useMemo(
    () =>
      Math.max(120, ...members.map((member) => member.username.length * 10)),
    [members]
  );
  const maxEmailWidth = React.useMemo(
    () => Math.max(120, ...members.map((member) => member.email.length * 10)),
    [members]
  );

  // const weekColumns = Array.from({ length: 8 }, (_, i) => `week_${i + 1}`);

  const weekColumns = React.useMemo(() => {
    if (members.length === 0) return [];

    return Object.keys(members[0])
      .filter((key) => key.startsWith("week_"))
      .sort((a, b) => {
        const weekA = parseInt(a.split("_")[1]);
        const weekB = parseInt(b.split("_")[1]);
        return weekA - weekB;
      });
  }, [members]);

  const totalColumnWidth = 210;
  const weeklyColumnWidth = 230;
  const labelWidth = 60;
  const columnSpacing = 20;

  const renderItem = ({ item }) => (
    <View
      style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}
    >
      <View
        style={{ width: maxUsernameWidth, marginHorizontal: columnSpacing }}
      >
        <Text style={{ fontSize: 16 }}>{item.username}</Text>
      </View>
      <View style={{ width: maxEmailWidth, marginHorizontal: columnSpacing }}>
        <Text style={{ fontSize: 16 }}>{item.email}</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          width: totalColumnWidth + 12,
          marginHorizontal: columnSpacing,
        }}
      >
        <Text style={{ fontSize: 14, width: labelWidth }}>
          {item.total.points}
        </Text>
        <Text style={{ fontSize: 14, width: labelWidth }}>
          {item.total.posts}
        </Text>
        <Text style={{ fontSize: 14, width: labelWidth }}>
          {item.total.comments}
        </Text>
        <Text style={{ fontSize: 14, width: labelWidth }}>
          {item.total.messages}
        </Text>
      </View>
      {weekColumns.map((week) => {
        const weekData = item[week] || {
          points: 0,
          posts: 0,
          comments: 0,
          messages: 0,
        };
        return (
          <View
            key={week}
            style={{
              flexDirection: "row",
              width: weeklyColumnWidth,
              marginHorizontal: columnSpacing,
            }}
          >
            <Text style={{ fontSize: 14, width: labelWidth }}>
              {weekData.points}
            </Text>
            <Text style={{ fontSize: 14, width: labelWidth }}>
              {weekData.posts}
            </Text>
            <Text style={{ fontSize: 14, width: labelWidth }}>
              {weekData.comments}
            </Text>
            <Text style={{ fontSize: 14, width: labelWidth }}>
              {weekData.messages}
            </Text>
          </View>
        );
      })}
      {/* {weekColumns.map((week) => (
        <View
          key={week}
          style={{
            flexDirection: "row",
            width: weeklyColumnWidth,
            marginHorizontal: columnSpacing,
          }}
        >
          <Text style={{ fontSize: 14, width: labelWidth }}>
            {item[week].points}
          </Text>
          <Text style={{ fontSize: 14, width: labelWidth }}>
            {item[week].posts}
          </Text>
          <Text style={{ fontSize: 14, width: labelWidth }}>
            {item[week].comments}
          </Text>
          <Text style={{ fontSize: 14, width: labelWidth }}>
            {item[week].messages}
          </Text>
        </View>
      ))} */}
    </View>
  );

  return (
    <ScrollView style={{ backgroundColor: "#fbfbfb" }} horizontal>
      <View style={globalStyles.container}>
        <View style={{ padding: 15, alignSelf: "flex-start" }}>
          <AnalyticsDatePicker onSubmit={getWeeklyGroupInfo} />
        </View>

        <View style={[globalStyles.row, { alignItems: "center" }]}>
          <View
            style={{ width: maxUsernameWidth, marginHorizontal: columnSpacing }}
          />
          <View
            style={{ width: maxEmailWidth, marginHorizontal: columnSpacing }}
          />
          <View
            style={{ width: totalColumnWidth, marginHorizontal: columnSpacing }}
          >
            <Text style={globalStyles.headingText}>Total</Text>
          </View>
          {weekColumns.map((_, index) => (
            <View
              key={index}
              style={{
                width: weeklyColumnWidth,
                marginHorizontal: columnSpacing,
              }}
            >
              <Text style={globalStyles.headingText}>Week {index + 1}</Text>
            </View>
          ))}
        </View>

        <View style={[globalStyles.row, { alignItems: "center" }]}>
          <View
            style={{ width: maxUsernameWidth, marginHorizontal: columnSpacing }}
          >
            <Text style={globalStyles.headingText}>Username</Text>
          </View>
          <View
            style={{ width: maxEmailWidth, marginHorizontal: columnSpacing }}
          >
            <Text style={globalStyles.headingText}>Email</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              width: totalColumnWidth + 40,
              justifyContent: "space-evenly",
              marginHorizontal: columnSpacing,
            }}
          >
            <Text style={{ fontSize: 14, width: labelWidth }}>Points</Text>
            <Text style={{ fontSize: 14, width: labelWidth }}>Posts</Text>
            <Text style={{ fontSize: 14, width: labelWidth }}>Replies</Text>
            <Text style={{ fontSize: 14, width: labelWidth }}>Chats</Text>
          </View>
          {weekColumns.map((_, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                width: weeklyColumnWidth,
                justifyContent: "space-evenly",
                marginHorizontal: columnSpacing,
              }}
            >
              <Text style={{ fontSize: 14, width: labelWidth }}>Points</Text>
              <Text style={{ fontSize: 14, width: labelWidth }}>Posts</Text>
              <Text style={{ fontSize: 14, width: labelWidth }}>Replies</Text>
              <Text style={{ fontSize: 14, width: labelWidth }}>Chats</Text>
            </View>
          ))}
        </View>

        {loading ? (
          <View style={{ padding: 24 }}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <FlatList
            data={members}
            renderItem={renderItem}
            keyExtractor={(item) => item.user_id.toString()}
          />
        )}
      </View>
    </ScrollView>
  );
}

// import * as React from "react";
// import {
//   Text,
//   View,
//   FlatList,
//   Dimensions,
//   ScrollView,
//   Platform,
//   ActivityIndicator,
// } from "react-native";
// import { AccountContext } from "../AccountContext";
// import { globalStyles } from "../../styles/global";
// import { useIsFocused } from "@react-navigation/native";
// import * as SecureStore from "expo-secure-store";
// import AnalyticsDatePicker from "./AnalyticsDatePicker";

// const getFormattedDate = (daysAgo) => {
//   // Get today's date
//   const today = new Date();

//   // Subtract the specified number of days (60 in this case)
//   today.setDate(today.getDate() - daysAgo);

//   // Get the components for year, month, and day
//   const year = today.getFullYear();
//   const month = (today.getMonth() + 1).toString().padStart(2, "0"); // Ensure two digits for month
//   const day = today.getDate().toString().padStart(2, "0"); // Ensure two digits for day

//   // Format the date as YYYY-MM-DD
//   return `${year}-${month}-${day}`;
// };

// export default function GroupAnalytics({ navigation }) {
//   const { user, setUser } = React.useContext(AccountContext);
//   const [members, setMembers] = React.useState([]);
//   const isFocused = useIsFocused();
//   const [loading, setLoading] = React.useState(false);

//   const getWeeklyGroupInfo = async (startDate) => {
//     setLoading(true);
//     const token =
//       Platform.OS !== "web"
//         ? await SecureStore.getItemAsync("token")
//         : sessionStorage.getItem("token");
//     try {
//       const response = await fetch(
//         `https://coral-app-n96bn.ondigitalocean.app/groups/getweeklygroupinfo`,
//         // `https://coral-app-n96bn.ondigitalocean.app/groups/getweeklygroupinfo`,
//         {
//           method: "POST",
//           credentials: "include",
//           headers: {
//             "Content-Type": "application/json",
//             ...(token ? { Authorization: `Bearer ${token}` } : {}),
//           },
//           body: JSON.stringify({ ...user, startDate }), // Include startDate in the request body
//         }
//       );

//       const jsonData = await response.json();
//       setMembers(jsonData);
//     } catch (err) {
//       console.error(err.message);
//     }
//     setLoading(false);
//   };

//   React.useEffect(() => {
//     const getGroupInfo = async () => {
//       const token =
//         Platform.OS !== "web"
//           ? await SecureStore.getItemAsync("token")
//           : sessionStorage.getItem("token"); // Get token only on mobile
//       try {
//         const response = await fetch(
//           `https://coral-app-n96bn.ondigitalocean.app/groups/getgroupinfo`,
//           {
//             method: "POST",
//             credentials: "include",
//             headers: {
//               "Content-Type": "application/json",
//               ...(token ? { Authorization: `Bearer ${token}` } : {}),
//             },
//             body: JSON.stringify({ ...user }),
//           }
//         );
//         const jsonData = await response.json();
//         const visibilitySetting =
//           jsonData.is_public === false ? "Private" : "Public";
//         const groupInfo = {
//           ...jsonData,
//           visibility: visibilitySetting,
//           is_public: jsonData.is_public,
//         };
//         setUser({
//           ...user,
//           groupName: groupInfo.groupname,
//           groupDescription: groupInfo.description,
//           visibility: visibilitySetting,
//         });
//       } catch (err) {
//         console.error(err.message);
//       }
//     };

//     getGroupInfo();
//   }, [user.groupName]);

//   React.useEffect(() => {
//     const getMembers = async () => {
//       const token =
//         Platform.OS !== "web" ? await SecureStore.getItemAsync("token") : null; // Get token only on mobile
//       try {
//         const apiUrl = `https://coral-app-n96bn.ondigitalocean.app/groups/getweeklygroupinfo`;
//         // const apiUrl = user.isAdmin
//         //   ? "https://coral-app-n96bn.ondigitalocean.app/groups/getmembers"
//         //   : "https://coral-app-n96bn.ondigitalocean.app/groups/mygroupanalytics";

//         const startDate = getFormattedDate(60);

//         const response = await fetch(apiUrl, {
//           method: "POST",
//           credentials: "include",
//           headers: {
//             "Content-Type": "application/json",
//             ...(token ? { Authorization: `Bearer ${token}` } : {}),
//           },

//           body: JSON.stringify({ ...user, startDate }),
//         });

//         const jsonData = await response.json();

//         // Format jsonData to the expected structure
//         const formattedMembers = jsonData.map((member) => ({
//           user_id: member.user_id,
//           username: member.username,
//           email: member.email,
//           total: {
//             points: member.group_total_points || 0, // Ensure 0 if no points data
//             posts: member.total_posts || 0, // Ensure 0 if no posts data
//             comments: member.total_comments || 0, // Ensure 0 if no comments data
//             messages: member.total_messages || 0, // Ensure 0 if no messages data
//           },
//           // Initialize weekly data to zeros (you can adjust this if you have specific data)
//           week_1: { points: 0, posts: 0, comments: 0, messages: 0 },
//           week_2: { points: 0, posts: 0, comments: 0, messages: 0 },
//           week_3: { points: 0, posts: 0, comments: 0, messages: 0 },
//           week_4: { points: 0, posts: 0, comments: 0, messages: 0 },
//           week_5: { points: 0, posts: 0, comments: 0, messages: 0 },
//           week_6: { points: 0, posts: 0, comments: 0, messages: 0 },
//           week_7: { points: 0, posts: 0, comments: 0, messages: 0 },
//           week_8: { points: 0, posts: 0, comments: 0, messages: 0 },
//         }));

//         setMembers(formattedMembers);
//       } catch (err) {
//         console.error(err.message);
//       }
//     };

//     getMembers();
//   }, [isFocused]);

//   // Calculate the maximum widths outside of the renderItem function
//   const maxUsernameWidth = React.useMemo(
//     () =>
//       Math.max(120, ...members.map((member) => member.username.length * 10)),
//     [members]
//   );
//   const maxEmailWidth = React.useMemo(
//     () => Math.max(120, ...members.map((member) => member.email.length * 10)),
//     [members]
//   );

//   // This is to handle dynamic widths for each of the week columns and totals
//   const weekColumns = Array.from(
//     { length: 8 },
//     (_, index) => `week_${index + 1}`
//   );

//   const totalColumnWidth = 210; // Set width for Total columns
//   const weeklyColumnWidth = 230; // Set width for Weekly columns
//   const labelWidth = 60; //
//   const columnSpacing = 20;

//   const renderItem = ({ item }) => {
//     return (
//       <View
//         style={{
//           flexDirection: "row",
//           alignItems: "center",
//           marginVertical: 10,
//           paddingHorizontal: 0, // Ensures the row uses full width
//         }}
//       >
//         {/* Username */}
//         <View
//           style={{
//             width: maxUsernameWidth,
//             alignItems: "flex-start",
//             marginHorizontal: columnSpacing,
//           }}
//         >
//           <Text style={{ fontSize: 16, textAlign: "flex-start" }}>
//             {item.username}
//           </Text>
//         </View>

//         {/* Email */}
//         <View
//           style={{
//             width: maxEmailWidth,
//             alignItems: "center",
//             marginHorizontal: columnSpacing,
//           }}
//         >
//           <Text style={{ fontSize: 16, textAlign: "center" }}>
//             {item.email}
//           </Text>
//         </View>

//         {/* Total Data in Row */}
//         <View
//           style={{
//             flexDirection: "row",
//             justifyContent: "space-evenly",
//             width: totalColumnWidth + 12, // Matches header width
//             marginHorizontal: columnSpacing, // Add spacing between columns
//           }}
//         >
//           <Text
//             style={{ fontSize: 14, textAlign: "center", width: labelWidth }}
//           >
//             {item.total.points}
//           </Text>
//           <Text
//             style={{ fontSize: 14, textAlign: "center", width: labelWidth }}
//           >
//             {" "}
//             {item.total.posts}
//           </Text>
//           <Text
//             style={{ fontSize: 14, textAlign: "center", width: labelWidth }}
//           >
//             {" "}
//             {item.total.comments}
//           </Text>
//           <Text
//             style={{ fontSize: 14, textAlign: "center", width: labelWidth }}
//           >
//             {" "}
//             {item.total.messages}{" "}
//           </Text>
//         </View>

//         {/* Weekly Data */}
//         {weekColumns.map((week) => (
//           <View
//             key={week}
//             style={{
//               flexDirection: "row",
//               justifyContent: "space-evenly",
//               width: weeklyColumnWidth, // Matches header width for weekly columns
//               marginHorizontal: columnSpacing, // Add spacing between columns
//             }}
//           >
//             <Text
//               style={{ fontSize: 14, textAlign: "center", width: labelWidth }}
//             >
//               {item[week].points}
//             </Text>
//             <Text
//               style={{ fontSize: 14, textAlign: "center", width: labelWidth }}
//             >
//               {item[week].posts}
//             </Text>
//             <Text
//               style={{ fontSize: 14, textAlign: "center", width: labelWidth }}
//             >
//               {item[week].comments}
//             </Text>
//             <Text
//               style={{
//                 fontSize: 14,
//                 textAlign: "center",
//                 width: labelWidth,
//                 paddingRight: 6,
//               }}
//             >
//               {item[week].messages}{" "}
//             </Text>
//           </View>
//         ))}
//       </View>
//     );
//   };

//   React.useLayoutEffect(() => {
//     navigation.setOptions({
//       headerTitle: () => (
//         <Text style={globalStyles.h3HeadingWhite}>Group Analytics</Text>
//       ),
//       headerTitleAlign: "center",
//     });
//   }, [navigation]);

//   return (
//     <ScrollView
//       style={{ backgroundColor: "#fbfbfb" }}
//       horizontal={true}
//       vertical={true}
//     >
//       <View style={globalStyles.container}>
//         <View style={{ padding: 15, alignSelf: "flex-start" }}>
//           <AnalyticsDatePicker onSubmit={getWeeklyGroupInfo} />
//         </View>

//         {/* Top Header Row for "Total" and "Week 1", etc. */}
//         <View style={[globalStyles.row, { alignItems: "center" }]}>
//           <View
//             style={{
//               width: maxUsernameWidth,
//               alignItems: "center",
//               marginHorizontal: columnSpacing,
//             }}
//           >
//             <Text style={globalStyles.headingText}></Text>
//           </View>
//           <View
//             style={{
//               width: maxEmailWidth,
//               alignItems: "center",
//               marginHorizontal: columnSpacing,
//             }}
//           >
//             <Text style={globalStyles.headingText}></Text>
//           </View>
//           <View
//             style={{
//               width: totalColumnWidth,
//               alignItems: "center",
//               marginHorizontal: columnSpacing,
//             }}
//           >
//             <Text style={globalStyles.headingText}>Total</Text>
//           </View>
//           {weekColumns.map((_, index) => (
//             <View
//               key={index}
//               style={{
//                 width: weeklyColumnWidth,
//                 alignItems: "center",
//                 marginHorizontal: columnSpacing,
//               }}
//             >
//               <Text style={globalStyles.headingText}>Week {index + 1}</Text>
//             </View>
//           ))}
//         </View>

//         {/* Secondary Header Row for Points, Posts, Replies, Chats */}
//         <View style={[globalStyles.row, { alignItems: "center" }]}>
//           <View
//             style={{
//               width: maxUsernameWidth,
//               alignItems: "center",
//               marginHorizontal: columnSpacing,
//               //  paddingLeft: 16
//             }}
//           >
//             <Text style={globalStyles.headingText}>Username</Text>
//           </View>
//           <View
//             style={{
//               width: maxEmailWidth,
//               alignItems: "center",
//               marginHorizontal: columnSpacing,
//             }}
//           >
//             <Text style={globalStyles.headingText}>Email</Text>
//           </View>
//           <View
//             style={{
//               flexDirection: "row",
//               width: totalColumnWidth + 40,
//               justifyContent: "space-evenly",
//               marginHorizontal: columnSpacing,
//             }}
//           >
//             <Text
//               style={{ fontSize: 14, textAlign: "center", width: labelWidth }}
//             >
//               Points
//             </Text>
//             <Text
//               style={{ fontSize: 14, textAlign: "center", width: labelWidth }}
//             >
//               Posts
//             </Text>
//             <Text
//               style={{ fontSize: 14, textAlign: "center", width: labelWidth }}
//             >
//               Replies
//             </Text>
//             <Text
//               style={{
//                 fontSize: 14,
//                 textAlign: "center",
//                 width: labelWidth,
//               }}
//             >
//               Chats
//             </Text>
//           </View>
//           {weekColumns.map((_, index) => (
//             <View
//               key={index}
//               style={{
//                 flexDirection: "row",
//                 width: weeklyColumnWidth, //+ 40,
//                 justifyContent: "space-evenly",
//                 marginHorizontal: columnSpacing,
//               }}
//             >
//               <Text
//                 style={{ fontSize: 14, textAlign: "center", width: labelWidth }}
//               >
//                 Points
//               </Text>
//               <Text
//                 style={{ fontSize: 14, textAlign: "center", width: labelWidth }}
//               >
//                 Posts
//               </Text>
//               <Text
//                 style={{ fontSize: 14, textAlign: "center", width: labelWidth }}
//               >
//                 Replies
//               </Text>
//               <Text
//                 style={{
//                   fontSize: 14,
//                   textAlign: "center",
//                   width: labelWidth,
//                 }}
//               >
//                 Chats
//               </Text>
//               <View style={{ paddingHorizontal: 10 }}></View>
//             </View>
//           ))}
//         </View>

//         {loading ? (
//           <View style={{ alignSelf: "flex-start", padding: 24 }}>
//             <ActivityIndicator size="large" color="#0000ff" />
//           </View>
//         ) : (
//           <FlatList
//             data={members}
//             renderItem={renderItem}
//             keyExtractor={(item) => item.user_id.toString()}
//           />
//         )}
//       </View>
//     </ScrollView>
//   );
// }
