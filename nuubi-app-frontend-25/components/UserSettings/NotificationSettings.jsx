import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Switch,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { globalStyles } from "../../styles/global";

//A re-usable RadioButton component
function RadioButton(props) {
  return (
      //Outer circle
      <View style={[{
        height: 28,
        width: 28,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: '#33B7F0',
        alignItems: 'center',
        justifyContent: 'center',
      }, props.style]}>
        {
          //Inner circle (selected)
          props.selected ?
            <View style={{
              height: 14,
              width: 14,
              borderRadius: 7,
              backgroundColor: '#33B7F0',
            }}/>
            : null
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
      <View style={styles.container}>

        <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.sectionTitle}>Productivity</Text>
            <View style={[styles.section, { paddingTop: 4 }]}>
                <View style={styles.sectionBody}>
                  <TouchableOpacity
                    onPress={() =>
                      setForm({ ...form, pauseNotifications: !form.pauseNotifications })
                    }
                    style={styles.card}>
                    <FeatherIcon
                      color="black"
                      name="pause-circle"
                      style={styles.rowIcon}
                      size={22}
                    />

                    <View style={styles.cardBody}>
                      <Text style={styles.cardName}>Pause All</Text>

                      <Text style={styles.cardHandle}>
                        Temporarily pause all notifications.
                      </Text>
                    </View>

                    <RadioButton
                      selected={form.pauseNotifications}
                      onPress={() =>
                        setForm({ ...form, pauseNotifications: !form.pauseNotifications })
                      }
                    />
                  </TouchableOpacity>
                </View>
            </View>

            <View style={[styles.section, { paddingTop: 4 }]}>
                <View style={styles.sectionBody}>
                    <TouchableOpacity
                        onPress={() => {
                          // handle onPress
                          navigation.navigate("StudyModeScreen");
                        }}
                        style={styles.card}>

                        <FeatherIcon
                            color="black"
                            name="book-open"
                            style={styles.rowIcon}
                            size={22} />

                        <View style={styles.cardBody}>
                        <Text style={styles.cardName}>Study Mode</Text>

                        <Text style={styles.cardHandle}>
                            Automatically mute notifications at night or whenever you need to focus.
                        </Text>
                        </View>

                        <FeatherIcon
                        color="#bcbcbc"
                        name="chevron-right"
                        size={22} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Notification Preferences</Text>
                <View style={styles.sectionBody}>
                    <View style={[styles.rowWrapper, styles.rowFirst]}>

                        <View style={styles.row}>
                        <Text style={styles.rowLabel}>Discussion Activity</Text>

                        <View style={styles.rowSpacer} />

                        <Switch
                            onValueChange={discussionNotifications =>
                            setForm({ ...form, discussionNotifications })
                            }
                            style={{ transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }] }}
                            value={form.discussionNotifications} />
                        </View>
                    </View>

                    <View style={styles.rowWrapper}>
                        <View style={styles.row}>
                        <Text style={styles.rowLabel}>Course Posts</Text>

                        <View style={styles.rowSpacer} />

                        <Switch
                            onValueChange={coursePostNotifications =>
                            setForm({ ...form, coursePostNotifications })
                            }
                            style={{ transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }] }}
                            value={form.coursePostNotifications} />
                        </View>
                    </View>

                    <View style={styles.rowWrapper}>
                        <View style={styles.row}>
                        <Text style={styles.rowLabel}>Post Activity</Text>

                        <View style={styles.rowSpacer} />

                        <Switch
                            onValueChange={postActivityNotifications =>
                            setForm({ ...form, postActivityNotifications })
                            }
                            style={{ transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }] }}
                            value={form.postActivityNotifications} />
                        </View>
                    </View>


                    <View style={styles.rowWrapper}>
                        <View style={styles.row}>
                        <Text style={styles.rowLabel}>Likes Received</Text>

                        <View style={styles.rowSpacer} />

                        <Switch
                            onValueChange={likesReceivedNotifications =>
                            setForm({ ...form, likesReceivedNotifications })
                            }
                            style={{ transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }] }}
                            value={form.likesReceivedNotifications} />
                        </View>
                    </View>


                    <View style={styles.rowWrapper}>
                        <View style={styles.row}>
                        <Text style={styles.rowLabel}>Milestone Reached</Text>

                        <View style={styles.rowSpacer} />

                        <Switch
                            onValueChange={milestonesNotifications =>
                            setForm({ ...form, milestonesNotifications })
                            }
                            style={{ transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }] }}
                            value={form.milestonesNotifications} />
                        </View>
                    </View>

                    <View style={styles.rowWrapper}>
                        <View style={styles.row}>
                        <Text style={styles.rowLabel}>Badge Earned</Text>

                        <View style={styles.rowSpacer} />

                        <Switch
                            onValueChange={badgeNotifications =>
                            setForm({ ...form, badgeNotifications })
                            }
                            style={{ transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }] }}
                            value={form.badgeNotifications} />
                        </View>
                    </View>

                    <View style={styles.rowWrapper}>
                        <View style={styles.row}>
                        <Text style={styles.rowLabel}>Messages</Text>

                        <View style={styles.rowSpacer} />

                        <Switch
                            onValueChange={messageNotifications =>
                            setForm({ ...form, messageNotifications })
                            }
                            style={{ transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }] }}
                            value={form.messageNotifications} />
                        </View>
                    </View>

                    <View style={[styles.rowWrapper, styles.rowLast]}>
                        <View style={styles.row}>
                        <Text style={styles.rowLabel}>Announcements</Text>

                        <View style={styles.rowSpacer} />

                        <Switch
                            onValueChange={announcementNotifications =>
                            setForm({ ...form, announcementNotifications })
                            }
                            style={{ transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }] }}
                            value={form.announcementNotifications} />
                        </View>
                   </View>
                </View>
            </View>
            <View style={styles.section}>
              <View style={styles.buttonContainer}>
                 <TouchableOpacity
                    style={ styles.saveButton }
                    accessibilityRole="button"
                  >
                    <Text
                      style={styles.saveButtonText}
                    >
                      Save
                    </Text>
                 </TouchableOpacity>
                 <TouchableOpacity
                    style={ styles.cancelButton }
                    accessibilityRole="button"
                  >
                    <Text
                      style={styles.cancelButtonText}
                    >
                      Cancel
                    </Text>
                 </TouchableOpacity>
              </View>
            </View>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  /** Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
  },
  headerAction: {
    width: 40,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 19,
    fontFamily: "Poppins_400Regular",
    fontWeight: '600',
    color: '#000',
  },
  /** Content */
  content: {
    paddingHorizontal: 16,
  },
  contentFooter: {
    marginTop: 24,
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    fontWeight: '500',
    textAlign: 'center',
    color: '#a69f9f',
  },
  /** Section */
  section: {
    paddingVertical: 12,
  },
  sectionTitle: {
    margin: 10,
    marginLeft: 12,
    fontSize: 13,
    letterSpacing: 0.33,
    fontFamily: "Poppins_400Regular",
    fontWeight: '500',
    color: '#a69f9f',
    textTransform: 'uppercase',
  },
  sectionBody: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  /** Cards */
  card: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  cardBody: {
    flex: '1',
    marginRight: 16,
  },
  cardName: {
    fontSize: 18,
    fontFamily: "Poppins_400Regular",
    fontWeight: '600',
    color: '#292929',
  },
  cardHandle: {
    marginTop: 2,
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    fontWeight: '400',
    color: '#858585',
  },
  /** Rows */
  row: {
    height: 44,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingRight: 12,
  },
  rowIcon: {
    marginRight: 16,
  },
  rowWrapper: {
    paddingLeft: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#f0f0f0',
  },
  rowFirst: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  rowLabel: {
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    letterSpacing: 0.24,
    color: '#000',
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  rowValue: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: "Poppins_400Regular",
    color: '#ababab',
    marginRight: 4,
  },
  rowLast: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },

  /**Buttons */
  buttonContainer: {
    flexDirection: "center", 
    alignItems: "center", 
    paddingVertical: 10, 
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    letterSpacing: 1.25,
  },
  saveButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 60,
    elevation: 3,
    backgroundColor: "#2482AA",
    width: "60%", 
    alignSelf: "center", 
  },
  cancelButtonText: {
    color: "#181828",
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    letterSpacing: 1.25,
  },
  cancelButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginVertical: 10,
    borderRadius: 60,
    borderColor: "#181828", 
    borderWidth: 1,
    elevation: 3,
    backgroundColor: "#FFFFFF",
    width: "60%", 
    alignSelf: "center", 
  },
});