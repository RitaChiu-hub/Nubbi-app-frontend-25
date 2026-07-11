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

function safeHostname(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch (_) {
    return url;
  }
}

// Google open source favicon services，when og:image can not be fetched
function faviconUrl(hostname) {
  return `https://www.google.com/s2/favicons?sz=128&domain=${hostname}`;
}

// Analysis HTML content for Open Graph tags（ignore property/content attribute order）
function parseOgTags(html) {
  const getMeta = (prop) => {
    const re1 = new RegExp(
      `<meta[^>]+property=["']og:${prop}["'][^>]+content=["']([^"']*)["']`,
      "i"
    );
    const m1 = html.match(re1);
    if (m1) return m1[1];
    const re2 = new RegExp(
      `<meta[^>]+content=["']([^"']*)["'][^>]+property=["']og:${prop}["']`,
      "i"
    );
    const m2 = html.match(re2);
    return m2 ? m2[1] : null;
  };
  const titleTagMatch = html.match(/<title>([^<]*)<\/title>/i);
  return {
    title: getMeta("title") || (titleTagMatch ? titleTagMatch[1] : null),
    description: getMeta("description"),
    image: getMeta("image"),
    siteName: getMeta("site_name"),
  };
}


const previewCache = new Map();
 
async function fetchLinkPreview(url) {
  if (previewCache.has(url)) {
    return previewCache.get(url);
  }
  const result = await fetchLinkPreviewUncached(url);
  previewCache.set(url, result);
  return result;
}

// Fetch OG metadata via a free proxy，並針對縮址 / 被擋爬蟲的網站提供多層備援，
async function fetchLinkPreviewUncached(url) {
  const hostname = safeHostname(url);
 
  // First layer：microlink
  try {
    const endpoint = `https://api.microlink.io/?url=${encodeURIComponent(url)}`;
    const res = await fetch(endpoint);
    const json = await res.json();
    if (json.status === "success" && json.data) {
      const image = json.data.image?.url || json.data.logo?.url || null;
      return {
        title: json.data.title || hostname,
        description: json.data.description || "",
        image: image || faviconUrl(hostname),
        imageType: image ? "hero" : "icon",
        siteName: json.data.publisher || hostname,
      };
    }
  } catch (_) {}

  // Second layer: fetch the target webpage HTML directly and parse the og tags
  // (handle websites that microlink cannot access, such as YouTube or various shortened URL services)
  try {
    const proxied = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    const res = await fetch(proxied);
    const html = await res.text();
    const og = parseOgTags(html);
   
    // Sanity check: some bot-blocked sites (e.g. YouTube) redirect crawlers to
    // a consent/interstitial page instead of the real content. That page's
    // title often just looks like a raw URL (e.g. "https://..."), and showing
    // it as-is would produce a broken-looking preview card. Treat such a title
    // as untrustworthy and discard this layer, falling through to the third
    // layer's favicon fallback instead.
    const isValidTitle =
      og.title && og.title.trim().length > 3 && !/^https?:\/\//i.test(og.title.trim());
 
    if (isValidTitle) {
      return {
        title: og.title,
        description: og.description || "",
        image: og.image || faviconUrl(hostname),
        imageType: og.image ? "hero" : "icon",
        siteName: og.siteName || hostname,
      };
    }
    // Title is untrustworthy — discard the image along with it too,
    // to avoid a mismatch between the image and the title.
  } catch (_) {}

  // Third layer (fallback): always show favicon + domain name to maintain consistent style with other link cards
  return {
    title: hostname,
    description: "",
    image: faviconUrl(hostname),
    imageType: "icon",
    siteName: hostname,
  };
}

// javascript// Fixed max width/height of the image container (matches the card layout)
const IMAGE_BOX_HEIGHT = 140;

export default function LinkPreviewCard({ url }) {
  const [preview, setPreview] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [warningVisible, setWarningVisible] = React.useState(false);

  // The image's "natural resolution" vs. the actual width of the card container,
  // used to calculate the "never scale up, only scale down" display size,
  // avoiding small images from being hard-stretched and blurred.

  const [naturalSize, setNaturalSize] = React.useState(null);
  const [containerWidth, setContainerWidth] = React.useState(0);

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

  React.useEffect(() => {
    setNaturalSize(null);
    if (preview?.image) {
      Image.getSize(
        preview.image,
        (w, h) => setNaturalSize({ width: w, height: h }),
        () => setNaturalSize(null)
      );
    }
  }, [preview?.image]);

  const handleOpen = () => {
    if (Platform.OS === "web") {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      Linking.openURL(url);
    }
    setWarningVisible(false);
  };
  

 // Compute the actual width/height to display the image at: only allow
 // shrinking (scale <= 1) — never upscale a low-resolution image to fill
 // the container, which would make it blurry.
 
  let displayWidth = "100%";
  let displayHeight = "100%";
  let resizeMode = "contain";
  if (naturalSize && containerWidth > 0) {
    const scale = Math.min(1, containerWidth / naturalSize.width, IMAGE_BOX_HEIGHT / naturalSize.height);
    displayWidth = naturalSize.width * scale;
    displayHeight = naturalSize.height * scale;
  }
 
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
             {/* Unified layout: the card's shape (container size) always stays the same;
              the image itself is only ever scaled down proportionally, never
              upscaled to fill the space — this avoids low-resolution images
              being stretched blurry. */}
            {preview?.image && (
              <View
                onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
                style={{
                  width: "100%",
                  height: IMAGE_BOX_HEIGHT,
                  backgroundColor: "#fff",
                  justifyContent: "center",
                  alignItems: "center",
                  borderBottomWidth: 1,
                  borderBottomColor: "#eee",
                }}
               >
                <Image
                  source={{ uri: preview.image }}
                  style={{ width: displayWidth, height: displayHeight }}
                  resizeMode={resizeMode}
                />
              </View>
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
