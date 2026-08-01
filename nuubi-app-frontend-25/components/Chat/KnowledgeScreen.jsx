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
        <FeatherIcon name="file-lines" size={24} color="#2482AA" />
        <View style={styles.itemTextContainer}>
          <Text style={styles.fileName}>{item.fileName}</Text>
          <Text style={styles.fileDate}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
      {isAdmin && (
        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          style={styles.deleteButton}
        >
          <FeatherIcon name="trash-can" size={18} color="#E70808" />
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
    <SafeAreaView style={globalStyles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Knowledge Base</Text>
        {isAdmin && (
          <TouchableOpacity
            style={[globalStyles.primaryButton, styles.uploadButton]}
            onPress={handleUpload}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FeatherIcon name="plus" size={16} color="#fff" />
                <Text style={globalStyles.primaryButtonText}> Upload File</Text>
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
            <Text style={styles.emptyText}>No knowledge files uploaded yet.</Text>
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
  },
  header: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    color: "#050505",
  },
  uploadButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    height: "auto",
    width: "auto",
  },
  listContent: {
    padding: 20,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  itemTextContainer: {
    marginLeft: 15,
  },
  fileName: {
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
    color: "#333",
  },
  fileDate: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    color: "#999",
  },
  deleteButton: {
    padding: 5,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontFamily: "Poppins_400Regular",
    color: "#999",
  },
});
