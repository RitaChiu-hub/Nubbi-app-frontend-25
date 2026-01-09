import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { resetToSignIn } from "../components/navRef";

export async function apiFetch(url, options = {}) {
  try {
    // Get token from storage
    const token =
      Platform.OS !== "web"
        ? await SecureStore.getItemAsync("token")
        : sessionStorage.getItem("token");

    // Merge headers
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const response = await fetch(url, { ...options, headers });

    
    // Parse JSON once
    const data = await response.json();
    
    // Handle expired token
    if (response.status === 401 && data.status === "expired") {
        if (Platform.OS !== "web") {
            await SecureStore.deleteItemAsync("token");
            resetToSignIn();
        } else {
            sessionStorage.removeItem("token");
            window.location.assign("/signin"); // fallback for web
        }

        return null; // stop further processing
    }

        // Throw for other errors if desired
        if (!response.ok) {
        throw new Error(data.message || "API request failed");
        }
        
        return data; // normal response
    } catch (err) {
        console.error("API fetch error:", err.message);
        throw err; // allow caller to handle if needed
    }
}