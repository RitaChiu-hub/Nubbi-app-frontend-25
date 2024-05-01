import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Switch,
} from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
import { globalStyles } from "../../styles/global";

//A re-usable RadioButton component
function RadioButton(props) {
  return (
    //Outer circle
    <View
      style={[
        {
          height: 28,
          width: 28,
          borderRadius: 14,
          borderWidth: 2,
          borderColor: "#33B7F0",
          alignItems: "center",
          justifyContent: "center",
        },
        props.style,
      ]}
    >
      {
        //Inner circle (selected)
        props.selected ? (
          <View
            style={{
              height: 14,
              width: 14,
              borderRadius: 7,
              backgroundColor: "#33B7F0",
            }}
          />
        ) : null
      }
    </View>
  );
}

export default function NotificationSettings({ navigation }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.screenHeader}>Notifications</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  const [form, setForm] = useState({
    pauseNotifications: false,
    discussionNotifications: true,
    coursePostNotifications: false,
    postActivityNotifications: true,
    likesReceivedNotifications: true,
    milestonesNotifications: true,
    badgeNotifications: false,
    messageNotifications: false,
    announcementNotifications: false,
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
      <View style={globalStyles.container}>
        <ScrollView contentContainerStyle={globalStyles.content}>
          <Text style={globalStyles.sectionTitle}>Productivity</Text>
          <View style={[globalStyles.section, { paddingTop: 4 }]}>
            <View style={globalStyles.sectionBody}>
              <TouchableOpacity
                onPress={() =>
                  setForm({
                    ...form,
                    pauseNotifications: !form.pauseNotifications,
                  })
                }
                style={globalStyles.card}
              >
                <FeatherIcon
                  color="black"
                  name="pause-circle"
                  style={globalStyles.rowIcon}
                  size={22}
                />

                <View style={globalStyles.cardBody}>
                  <Text style={globalStyles.cardName}>Pause All</Text>

                  <Text style={globalStyles.cardHandle}>
                    Temporarily pause all notifications.
                  </Text>
                </View>

                <RadioButton
                  selected={form.pauseNotifications}
                  onPress={() =>
                    setForm({
                      ...form,
                      pauseNotifications: !form.pauseNotifications,
                    })
                  }
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={[globalStyles.section, { paddingTop: 4 }]}>
            <View style={globalStyles.sectionBody}>
              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                  navigation.navigate("StudyModeScreen");
                }}
                style={globalStyles.card}
              >
                <FeatherIcon
                  color="black"
                  name="book-open"
                  style={globalStyles.rowIcon}
                  size={22}
                />

                <View style={globalStyles.cardBody}>
                  <Text style={globalStyles.cardName}>Study Mode</Text>

                  <Text style={globalStyles.cardHandle}>
                    Automatically mute notifications at night or whenever you
                    need to focus.
                  </Text>
                </View>

                <FeatherIcon color="#bcbcbc" name="chevron-right" size={22} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={globalStyles.section}>
            <Text style={globalStyles.sectionTitle}>
              Notification Preferences
            </Text>
            <View style={globalStyles.sectionBody}>
              <View style={[globalStyles.rowWrapper, globalStyles.rowFirst]}>
                <View style={globalStyles.row}>
                  <Text style={globalStyles.rowLabel}>Discussion Activity</Text>

                  <View style={globalStyles.rowSpacer} />

                  <Switch
                    onValueChange={(discussionNotifications) =>
                      setForm({ ...form, discussionNotifications })
                    }
                    style={{ transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }] }}
                    value={form.discussionNotifications}
                  />
                </View>
              </View>

              <View style={globalStyles.rowWrapper}>
                <View style={globalStyles.row}>
                  <Text style={globalStyles.rowLabel}>Course Posts</Text>

                  <View style={globalStyles.rowSpacer} />

                  <Switch
                    onValueChange={(coursePostNotifications) =>
                      setForm({ ...form, coursePostNotifications })
                    }
                    style={{ transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }] }}
                    value={form.coursePostNotifications}
                  />
                </View>
              </View>

              <View style={globalStyles.rowWrapper}>
                <View style={globalStyles.row}>
                  <Text style={globalStyles.rowLabel}>Post Activity</Text>

                  <View style={globalStyles.rowSpacer} />

                  <Switch
                    onValueChange={(postActivityNotifications) =>
                      setForm({ ...form, postActivityNotifications })
                    }
                    style={{ transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }] }}
                    value={form.postActivityNotifications}
                  />
                </View>
              </View>

              <View style={globalStyles.rowWrapper}>
                <View style={globalStyles.row}>
                  <Text style={globalStyles.rowLabel}>Likes Received</Text>

                  <View style={globalStyles.rowSpacer} />

                  <Switch
                    onValueChange={(likesReceivedNotifications) =>
                      setForm({ ...form, likesReceivedNotifications })
                    }
                    style={{ transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }] }}
                    value={form.likesReceivedNotifications}
                  />
                </View>
              </View>

              <View style={globalStyles.rowWrapper}>
                <View style={globalStyles.row}>
                  <Text style={globalStyles.rowLabel}>Milestone Reached</Text>

                  <View style={globalStyles.rowSpacer} />

                  <Switch
                    onValueChange={(milestonesNotifications) =>
                      setForm({ ...form, milestonesNotifications })
                    }
                    style={{ transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }] }}
                    value={form.milestonesNotifications}
                  />
                </View>
              </View>

              <View style={globalStyles.rowWrapper}>
                <View style={globalStyles.row}>
                  <Text style={globalStyles.rowLabel}>Badge Earned</Text>

                  <View style={globalStyles.rowSpacer} />

                  <Switch
                    onValueChange={(badgeNotifications) =>
                      setForm({ ...form, badgeNotifications })
                    }
                    style={{ transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }] }}
                    value={form.badgeNotifications}
                  />
                </View>
              </View>

              <View style={globalStyles.rowWrapper}>
                <View style={globalStyles.row}>
                  <Text style={globalStyles.rowLabel}>Messages</Text>

                  <View style={globalStyles.rowSpacer} />

                  <Switch
                    onValueChange={(messageNotifications) =>
                      setForm({ ...form, messageNotifications })
                    }
                    style={{ transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }] }}
                    value={form.messageNotifications}
                  />
                </View>
              </View>

              <View style={[globalStyles.rowWrapper, globalStyles.rowLast]}>
                <View style={globalStyles.row}>
                  <Text style={globalStyles.rowLabel}>Announcements</Text>

                  <View style={globalStyles.rowSpacer} />

                  <Switch
                    onValueChange={(announcementNotifications) =>
                      setForm({ ...form, announcementNotifications })
                    }
                    style={{ transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }] }}
                    value={form.announcementNotifications}
                  />
                </View>
              </View>
            </View>
          </View>
          <View style={globalStyles.section}>
            <View style={globalStyles.buttonContainer}>
              <TouchableOpacity
                style={globalStyles.saveButton}
                accessibilityRole="button"
              >
                <Text style={globalStyles.primaryButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={globalStyles.cancelButton}
                accessibilityRole="button"
              >
                <Text style={globalStyles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
