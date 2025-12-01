import React, { useState } from "react";
import { SafeAreaView, View, Text, Switch } from "react-native";
import { globalStyles } from "../../styles/global";
import DropDownPicker from "react-native-dropdown-picker";

export default function StudyModeScreen({ navigation }) {
  const [openFrom, setOpenFrom] = useState(false);
  const [valueFrom, setValueFrom] = useState(null);
  const [itemsFrom, setItemsFrom] = useState([
    { label: "8:00 AM", value: "8am" },
    { label: "9:00 AM", value: "9am" },
    { label: "10:00 AM", value: "10am" },
    { label: "11:00 AM", value: "11am" },
    { label: "12:00 PM", value: "12pm" },
    { label: "1:00 PM", value: "1pm" },
    { label: "2:00 PM", value: "2pm" },
    { label: "3:00 PM", value: "3pm" },
    { label: "4:00 PM", value: "4pm" },
    { label: "5:00 PM", value: "5pm" },
    { label: "6:00 PM", value: "6pm" },
    { label: "7:00 PM", value: "7pm" },
    { label: "8:00 PM", value: "8pm" },
    { label: "9:00 PM", value: "9pm" },
    { label: "10:00 PM", value: "10pm" },
    { label: "11:00 PM", value: "11pm" },
    { label: "12:00 AM", value: "12am" },
    { label: "1:00 AM", value: "1am" },
    { label: "2:00 AM", value: "2am" },
    { label: "3:00 AM", value: "3am" },
    { label: "4:00 AM", value: "4am" },
    { label: "5:00 AM", value: "5am" },
    { label: "6:00 AM", value: "6am" },
    { label: "7:00 AM", value: "7am" },
  ]);

  const [openTo, setOpenTo] = useState(false);
  const [valueTo, setValueTo] = useState(null);
  const [itemsTo, setItemsTo] = useState([
    { label: "1:00 AM", value: "1am_to" },
    { label: "2:00 AM", value: "2am_to" },
    { label: "3:00 AM", value: "3am_to" },
    { label: "4:00 AM", value: "4am_to" },
    { label: "5:00 AM", value: "5am_to" },
    { label: "6:00 AM", value: "6am_to" },
    { label: "7:00 AM", value: "7am_to" },
    { label: "8:00 AM", value: "8am_to" },
    { label: "9:00 AM", value: "9am_to" },
    { label: "10:00 AM", value: "10am_to" },
    { label: "11:00 AM", value: "11am_to" },
    { label: "12:00 PM", value: "12pm_to" },
    { label: "1:00 PM", value: "1pm_to" },
    { label: "2:00 PM", value: "2pm_to" },
    { label: "3:00 PM", value: "3pm_to" },
    { label: "4:00 PM", value: "4pm_to" },
    { label: "5:00 PM", value: "5pm_to" },
    { label: "6:00 PM", value: "6pm_to" },
    { label: "7:00 PM", value: "7pm_to" },
    { label: "8:00 PM", value: "8pm_to" },
    { label: "9:00 PM", value: "9pm_to" },
    { label: "10:00 PM", value: "10pm_to" },
    { label: "11:00 PM", value: "11pm_to" },
    { label: "12:00 AM", value: "12am_to" },
  ]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingWhite}>Notifications</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  const [form, setForm] = useState({
    studyModeToggle: false,
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
      <View style={globalStyles.container}>
        <View style={globalStyles.widthContainer}>
          <View style={globalStyles.section}>
            <Text style={globalStyles.textInputLabel}>Set Up</Text>
            <View style={globalStyles.sectionBody}>
              <View style={[globalStyles.rowWrapper, globalStyles.rowSingle]}>
                <View style={globalStyles.row}>
                  <Text style={globalStyles.headingText}>Study Mode</Text>
                  <View style={globalStyles.rowSpacer} />
                  <Switch
                    onValueChange={(studyModeToggle) =>
                      setForm({ ...form, studyModeToggle })
                    }
                    style={{ transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }] }}
                    value={form.studyModeToggle}
                  />
                </View>
              </View>
            </View>
          </View>
          <View style={{ paddingHorizontal: 18 }}>
            <Text style={globalStyles.bodyRegular}>
              Select specific times to automatically silence notifications when
              needed. These times can be changed at anytime.
            </Text>
          </View>

          <View style={globalStyles.section}>
            <Text style={globalStyles.textInputLabel}>
              Select a time schedule
            </Text>
            <View style={{ marginTop: 20 }}></View>
            <View style={[globalStyles.altWrapper, { zIndex: 100 }]}>
              <View
                style={[
                  globalStyles.row,
                  form.studyModeToggle ? null : globalStyles.disabledRow,
                ]}
              >
                <Text
                  style={[
                    globalStyles.headingText,
                    form.studyModeToggle ? null : globalStyles.disabledText,
                  ]}
                >
                  From
                </Text>
                <View style={globalStyles.rowSpacer} />
                <DropDownPicker
                  open={openFrom}
                  value={valueFrom}
                  items={itemsFrom}
                  placeholder="Select a time"
                  setOpen={setOpenFrom}
                  setValue={setValueFrom}
                  setItems={setItemsFrom}
                  containerStyle={[
                    { width: 200 },
                    form.studyModeToggle ? null : globalStyles.disabledPicker,
                  ]}
                  disabled={!form.studyModeToggle}
                />
              </View>
            </View>
            <View style={{ marginTop: 20, zIndex: 60 }}></View>
            <View style={[globalStyles.altWrapper, { zIndex: 50 }]}>
              <View
                style={[
                  globalStyles.row,
                  form.studyModeToggle ? null : globalStyles.disabledRow,
                ]}
              >
                <Text
                  style={[
                    globalStyles.headingText,
                    form.studyModeToggle ? null : globalStyles.disabledText,
                  ]}
                >
                  To
                </Text>
                <View style={globalStyles.rowSpacer} />
                <DropDownPicker
                  open={openTo}
                  value={valueTo}
                  items={itemsTo}
                  placeholder="Select a time"
                  setOpen={setOpenTo}
                  setValue={setValueTo}
                  setItems={setItemsTo}
                  containerStyle={[
                    { width: 200 },
                    form.studyModeToggle ? null : globalStyles.disabledPicker,
                  ]}
                  disabled={!form.studyModeToggle}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
