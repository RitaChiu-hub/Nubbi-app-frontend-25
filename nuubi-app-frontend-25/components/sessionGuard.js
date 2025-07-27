import { Alert, Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { resetToSignIn } from './navRef';

let handling = false;

export function installSessionGuard() {
  if (global.__sessionGuardInstalled) return;
  global.__sessionGuardInstalled = true;

  const origFetch = global.fetch;

  global.fetch = async (input, init) => {
    const res = await origFetch(input, init);

    if (res.status === 401 || res.status === 403) {
      if (!handling) {
        handling = true;
        try {
          if (Platform.OS === 'web') {
            sessionStorage.removeItem('token');
          } else {
            await SecureStore.deleteItemAsync('token');
          }
        } catch {}

        Platform.OS === 'web'
          ? window.alert('Session expired. Please log in again.')
          : Alert.alert('Session expired', 'Please log in again.');

        resetToSignIn();
        setTimeout(() => { handling = false; }, 1500);
      }
      throw new Error('SESSION_EXPIRED');
    }

    return res;
  };
}
