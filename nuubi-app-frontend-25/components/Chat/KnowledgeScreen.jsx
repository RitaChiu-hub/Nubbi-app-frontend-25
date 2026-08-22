import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Platform,
  SafeAreaView,
  Linking,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as SecureStore from "expo-secure-store";
import FeatherIcon from "@expo/vector-icons/FontAwesome6";
import { API_URL } from "../../config";
import { AccountContext } from "../AccountContext";
import { globalStyles } from "../../styles/global";
import alert from "../alert";

export default function KnowledgeScreen() {
  const { user } = useContext(AccountContext);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [knowledgeList, setKnowledgeList] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchData();
  }, [user.currentGroup]);

  const fetchData = async () => {
    setLoading(true);
    const token =
      Platform.OS !== "web"
        ? await SecureStore.getItemAsync("token")
        : sessionStorage.getItem("token");

    try {
      // Check admin status and list knowledge in parallel
      const [adminRes, listRes] = await Promise.all([
        fetch(`${API_URL}/groups/isadmin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ ...user }),
        }),
        fetch(`${API_URL}/groups/${user.currentGroup}/knowledge`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }),
      ]);

      const adminData = await adminRes.json();
      const listData = await listRes.json();

      setIsAdmin(String(adminData.isAdmin) === "true");
      setKnowledgeList(Array.isArray(listData) ? listData : []);
    } catch (error) {
      console.error("Error fetching knowledge data:", error);
      // alert("Failed to load knowledge base.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "text/plain"],
      });

      if (result.canceled) return;

      const file = result.assets[0];
      setUploading(true);

      const token =
        Platform.OS !== "web"
          ? await SecureStore.getItemAsync("token")
          : sessionStorage.getItem("token");

      // 1. Get Presigned URL
      const presignedRes = await fetch(
        `${API_URL}/groups/${user.currentGroup}/knowledge/presigned-url`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.mimeType || "application/octet-stream",
          }),
        }
      );

      if (!presignedRes.ok) throw new Error("Failed to get presigned URL");
      const { uploadUrl, s3Key } = await presignedRes.json();

      // 2. Upload to S3
      const fileBlob = await fetch(file.uri).then((r) => r.blob());
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        body: fileBlob,
        headers: {
          "Content-Type": file.mimeType || "application/octet-stream",
        },
      });

      if (!uploadRes.ok) throw new Error("S3 upload failed");

      // 3. Confirm Upload
      const confirmRes = await fetch(
        `${API_URL}/groups/${user.currentGroup}/knowledge/confirm`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            fileName: file.name,
            s3Key: s3Key,
          }),
        }
      );

      if (confirmRes.ok) {
        setUploading(false);
        alert("Success", "File uploaded successfully! It will be processed shortly.");
        fetchData(); // Refresh list
        return;
      } else {
        const errorData = await confirmRes.json();
        throw new Error(
          errorData.error || "Failed to confirm upload with backend"
        );
      }
    } catch (error) {
      setUploading(false);
      console.error("Upload error details:", error);
      alert("Error", "Failed to upload file. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    const token =
      Platform.OS !== "web"
        ? await SecureStore.getItemAsync("token")
        : sessionStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/groups/${user.currentGroup}/knowledge/${id}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (res.ok) {
        fetchData();
      } else {
        alert("Failed to delete record.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting record.");
    }
  };

  const handleViewFile = async (url) => {
    if (!url) return;
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error("Error opening URL:", error);
      alert("Could not open file.");
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleViewFile(item.fileUrl)}
    >
      <View style={styles.itemInfo}>
        <View style={styles.iconContainer}>
          <FeatherIcon name="file-pdf" size={22} color="#2482AA" />
        </View>
        <View style={styles.itemTextContainer}>
          <Text style={styles.fileName} numberOfLines={1} ellipsizeMode="middle">
            {item.fileName}
          </Text>
          <Text style={styles.fileDate}>
            Added on {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
      {isAdmin && (
        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          style={styles.deleteButton}
        >
          <FeatherIcon name="trash-can" size={16} color="#E70808" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2482AA" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Knowledge Base</Text>
          <Text style={styles.subtitle}>Manage training documents for Cuubi AI</Text>
        </View>
        {isAdmin && (
          <TouchableOpacity
            style={styles.uploadButtonGradient}
            onPress={handleUpload}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FeatherIcon name="plus" size={14} color="#fff" />
                <Text style={styles.uploadButtonText}> Add File</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={knowledgeList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <FeatherIcon name="cloud-upload" size={40} color="#ccc" />
            </View>
            <Text style={styles.emptyText}>No knowledge files yet</Text>
            <Text style={styles.emptySubtext}>Upload PDFs to train your group's AI assistant</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    backgroundColor: "#fff",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 26,
    fontFamily: "Poppins_700Bold",
    color: "#050505",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    color: "#666",
    marginTop: 2,
  },
  uploadButtonGradient: {
    backgroundColor: "#2482AA",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
    shadowColor: "#2482AA",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
  },
  listContent: {
    padding: 20,
    paddingTop: 24,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
      },
    }),
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.02)",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "rgba(36, 130, 170, 0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  itemInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  itemTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  fileName: {
    fontSize: 15,
    fontFamily: "Poppins_600SemiBold",
    color: "#333",
  },
  fileDate: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    color: "#999",
    marginTop: 2,
  },
  deleteButton: {
    padding: 10,
    backgroundColor: "rgba(231, 8, 8, 0.05)",
    borderRadius: 12,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
    paddingHorizontal: 40,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    color: "#333",
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#999",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
});
