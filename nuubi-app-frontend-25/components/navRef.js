import { createNavigationContainerRef } from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef();

export function resetToSignIn() {
  if (navigationRef.isReady()) {
    // Use the exact screen name from your stack
    navigationRef.reset({
      index: 0,
      routes: [{ name: "Login" }], // <-- must match Stack.Screen name
    });
  } else if (typeof window !== "undefined") {
    window.location.assign("/signin"); // optional fallback for web
  }
}