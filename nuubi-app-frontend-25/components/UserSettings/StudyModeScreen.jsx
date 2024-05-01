import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  Switch,
} from 'react-native';
import { globalStyles } from "../../styles/global";
import DropDownPicker from 'react-native-dropdown-picker';

export default function StudyModeScreen({ navigation }) {
    const [openFrom, setOpenFrom] = useState(false);
    const [valueFrom, setValueFrom] = useState(null);
    const [itemsFrom, setItemsFrom] = useState([
      {label: '8:00 AM', value: '8am'},
      {label: '9:00 AM', value: '9am'},
      {label: '10:00 AM', value: '10am'},
      {label: '11:00 AM', value: '11am'},
      {label: '12:00 PM', value: '12pm'},
      {label: '1:00 PM', value: '1pm'},
      {label: '2:00 PM', value: '2pm'},
      {label: '3:00 PM', value: '3pm'},
      {label: '4:00 PM', value: '4pm'},
      {label: '5:00 PM', value: '5pm'},
      {label: '6:00 PM', value: '6pm'},
      {label: '7:00 PM', value: '7pm'},
      {label: '8:00 PM', value: '8pm'},
      {label: '9:00 PM', value: '9pm'},
      {label: '10:00 PM', value: '10pm'},
      {label: '11:00 PM', value: '11pm'},
      {label: '12:00 AM', value: '12am'},
      {label: '1:00 AM', value: '1am'},
      {label: '2:00 AM', value: '2am'},
      {label: '3:00 AM', value: '3am'},
      {label: '4:00 AM', value: '4am'},
      {label: '5:00 AM', value: '5am'},
      {label: '6:00 AM', value: '6am'},
      {label: '7:00 AM', value: '7am'},
    ]);

    const [openTo, setOpenTo] = useState(false);
    const [valueTo, setValueTo] = useState(null);
    const [itemsTo, setItemsTo] = useState([
        {label: '1:00 AM', value: '1am_to'},
        {label: '2:00 AM', value: '2am_to'},
        {label: '3:00 AM', value: '3am_to'},
        {label: '4:00 AM', value: '4am_to'},
        {label: '5:00 AM', value: '5am_to'},
        {label: '6:00 AM', value: '6am_to'},
        {label: '7:00 AM', value: '7am_to'},
        {label: '8:00 AM', value: '8am_to'},
        {label: '9:00 AM', value: '9am_to'},
        {label: '10:00 AM', value: '10am_to'},
        {label: '11:00 AM', value: '11am_to'},
        {label: '12:00 PM', value: '12pm_to'},
        {label: '1:00 PM', value: '1pm_to'},
        {label: '2:00 PM', value: '2pm_to'},
        {label: '3:00 PM', value: '3pm_to'},
        {label: '4:00 PM', value: '4pm_to'},
        {label: '5:00 PM', value: '5pm_to'},
        {label: '6:00 PM', value: '6pm_to'},
        {label: '7:00 PM', value: '7pm_to'},
        {label: '8:00 PM', value: '8pm_to'},
        {label: '9:00 PM', value: '9pm_to'},
        {label: '10:00 PM', value: '10pm_to'},
        {label: '11:00 PM', value: '11pm_to'},
        {label: '12:00 AM', value: '12am_to'},
    ]);

    React.useLayoutEffect(() => {
      navigation.setOptions({
          headerTitle: () => (
          <Text style={globalStyles.screenHeader}>Notifications</Text>
          ),
          headerTitleAlign: "center",
      });
      }, [navigation]);

    const [form, setForm] = useState({
        studyModeToggle: false,
    });

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
            <View style={globalStyles.container}>
              <View style={globalStyles.content}>
                    <View style={globalStyles.section}>
                        <Text style={globalStyles.sectionTitle}>SET UP</Text>
                        <View style={globalStyles.sectionBody}>
                            <View style={[globalStyles.rowWrapper, globalStyles.rowSingle]}>
                                <View style={globalStyles.row}>
                                    <Text style={globalStyles.rowLabel}>Study Mode</Text>
                                    <View style={globalStyles.rowSpacer} />
                                    <Switch
                                        onValueChange={studyModeToggle =>
                                            setForm({ ...form, studyModeToggle })
                                        }
                                        style={{ transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }] }}
                                        value={form.studyModeToggle} />
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={globalStyles.altBody}>
                      <Text style={globalStyles.sectionText}>
                        Select specific times to automatically silence notifications when needed. These times can be changed at anytime.
                      </Text>
                    </View>

                    <View style={globalStyles.section}>
                        <Text style={globalStyles.sectionTitle}>Select a time schedule</Text>
                        <View style={{marginTop: 20}}></View>
                        <View style={[globalStyles.altWrapper, {zIndex: 100}]}>
                          <View style={[globalStyles.row, form.studyModeToggle ? null : globalStyles.disabledRow]}>
                                <Text style={[globalStyles.rowLabel, form.studyModeToggle ? null : globalStyles.disabledText]}>From</Text>
                                <View style={globalStyles.rowSpacer} />
                                <DropDownPicker
                                    open={openFrom}
                                    value={valueFrom}
                                    items={itemsFrom}
                                    placeholder="Select a time"
                                    setOpen={setOpenFrom}
                                    setValue={setValueFrom}
                                    setItems={setItemsFrom}
                                    containerStyle={[{ width: 200 }, form.studyModeToggle ? null : globalStyles.disabledPicker]}
                                    disabled={!form.studyModeToggle}
                                />
                            </View>
                        </View>
                        <View style={{marginTop: 20, zIndex: 60}}></View>
                        <View style={[globalStyles.altWrapper, {zIndex: 50}]}>
                          <View style={[globalStyles.row, form.studyModeToggle ? null : globalStyles.disabledRow]}>
                              <Text style={[globalStyles.rowLabel, form.studyModeToggle ? null : globalStyles.disabledText]}>To</Text>
                                <View style={globalStyles.rowSpacer} />
                                <DropDownPicker
                                    open={openTo}
                                    value={valueTo}
                                    items={itemsTo}
                                    placeholder="Select a time"
                                    setOpen={setOpenTo}
                                    setValue={setValueTo}
                                    setItems={setItemsTo}
                                    containerStyle={[{ width: 200 }, form.studyModeToggle ? null : globalStyles.disabledPicker]}
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
    sectionText: {
      margin: 10,
      marginLeft: 12,
      fontSize: 13,
      letterSpacing: 0.33,
      fontFamily: "Poppins_400Regular",
      fontWeight: 'bold',
      color: '#181828',
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
    altBody: {
      backgroundColor: '#f8f8f8',
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
    altWrapper: {
        paddingLeft: 16,
        position: 'relative', 
        zIndex: 1, // Ensure dropdown is on top
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
    rowSingle: {
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12,
    },

    disabledPicker: {
      opacity: 0.3, 
    },
    disabledRow: {
      opacity: 0.4, 
    },
    disabledText: {
      color: '#999', 
    },
});