
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY_PREFIX = "lastViewedPosts_";

function mergeMaps(target, obj) {
  if (!obj || typeof obj !== "object") return;
  for (const k of Object.keys(obj)) {
    target[k] = obj[k];
  }
}

/**
 * Returns one merged postId → ISO timestamp map for POST /groups/mygroups.
 * Empty `{}` if nothing is stored yet.
 */
export async function loadMergedLastViewedPosts() {
  const merged = {};
  try {
    if (Platform.OS === "web") {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key || !key.startsWith(KEY_PREFIX)) continue;
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        try {
          mergeMaps(merged, JSON.parse(raw));
        } catch (_) {}
      }
    } else {
      const allKeys = await AsyncStorage.getAllKeys();
      const keys = allKeys.filter((k) => k.startsWith(KEY_PREFIX));
      if (keys.length === 0) return merged;
      const pairs = await AsyncStorage.multiGet(keys);
      for (const [, raw] of pairs) {
        if (!raw) continue;
        try {
          mergeMaps(merged, JSON.parse(raw));
        } catch (_) {}
      }
    }
  } catch (_) {}
  return merged;
}
