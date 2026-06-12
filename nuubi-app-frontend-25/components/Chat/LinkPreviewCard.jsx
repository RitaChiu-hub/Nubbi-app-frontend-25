import * as React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Platform,
  Linking,
} from "react-native";

const URL_REGEX = /(https?:\/\/[^\s]+)/g;

// Fetch OG metadata via a free proxy
async function fetchLinkPreview(url) {
  try {
    const endpoint = `https://api.microlink.io/?url=${encodeURIComponent(url)}`;
    const res = await fetch(endpoint);
    const json = await res.json();
    if (json.status === "success") {
      return {
        title: json.data.title || url,
        description: json.data.description || "",
        image: json.data.image?.url || null,
        siteName: json.data.publisher || new URL(url).hostname,
      };
    }
  } catch (_) {}
  // fallback: just show the URL
  try {
    return { title: url, description: "", image: null, siteName: new URL(url).hostname };
  } catch (_) {
    return { title: url, description: "", image: null, siteName: url };
  }
}

export default function LinkPreviewCard({ url }) {
  const [preview, setPreview] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [warningVisible, setWarningVisible] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchLinkPreview(url).then((data) => {
      if (!cancelled) {
        setPreview(data);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [url]);

  const handleOpen = () => {
    if (Platform.OS === "web") {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      Linking.openURL(url);
    }
    setWarningVisible(false);
  };

  return (
    <>
      {/* Safety warning modal */}
      <Modal
        transparent
        visible={warningVisible}
        animationType="fade"
        onRequestClose={() => setWarningVisible(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.4)",
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        }}>
          <View style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            padding: 20,
            width: "100%",
            maxWidth: 360,
          }}>
            <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8, color: "#050505" }}>
              You're leaving the app
            </Text>
            <Text style={{ fontSize: 14, color: "#555", marginBottom: 4 }}>
              This will open{" "}
              <Text style={{ fontWeight: "600", color: "#050505" }}>
                {preview?.siteName || url}
              </Text>{" "}
              in your browser.
            </Text>
            <Text style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>
              Make sure you trust this link before continuing.
            </Text>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity
                onPress={() => setWarningVisible(false)}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#ddd",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#555", fontSize: 14 }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleOpen}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 10,
                  backgroundColor: "#2482AA",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}>Open link</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Preview card */}
      <TouchableOpacity
        onPress={() => setWarningVisible(true)}
        style={{
          marginTop: 12,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#ddd",
          overflow: "hidden",
          backgroundColor: "#f9f9f9",
        }}
        activeOpacity={0.8}
      >
        {loading ? (
          <View style={{ padding: 16, alignItems: "center" }}>
            <ActivityIndicator size="small" color="#2482AA" />
          </View>
        ) : (
          <>
            {preview?.image && (
              <Image
                source={{ uri: preview.image }}
                style={{ width: "100%", height: 160 }}
                resizeMode="cover"
              />
            )}
            <View style={{ padding: 12 }}>
              <Text style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>
                {preview?.siteName}
              </Text>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#050505", marginBottom: 2 }} numberOfLines={2}>
                {preview?.title}
              </Text>
              {preview?.description ? (
                <Text style={{ fontSize: 13, color: "#666" }} numberOfLines={2}>
                  {preview.description}
                </Text>
              ) : null}
            </View>
          </>
        )}
      </TouchableOpacity>
    </>
  );
}
