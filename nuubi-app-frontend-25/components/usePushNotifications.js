import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import {jwtDecode } from "jwt-decode";

export async function registerPushToken(jwt) {
  try {
    const { id: userId } = jwtDecode(jwt);

    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.log('Push notification permissions not granted');
      return;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync();
    const token = tokenData.data;

    const payload = {
      userId,
      token
    };

    console.log("Registering push token:", payload);

    const res = await fetch('http://192.168.1.149:8080/push-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log("Backend response:", data);

  } catch (err) {
    console.log("Push token registration error:", err);
  }
}
