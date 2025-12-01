import { createNavigationContainerRef } from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef();

export function resetToSignIn() {
  if (navigationRef.isReady()) {
    navigationRef.reset({ index: 0, routes: [{ name: "Signin" }] });
  } else if (typeof window !== "undefined") {
    window.location.assign("/signin"); 
  }
}
