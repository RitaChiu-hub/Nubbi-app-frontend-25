import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { API_URL } from "../config";

/**
 * Session Service
 * Handles session tracking, heartbeat, and analytics
 */
class SessionService {
  constructor() {
    this.sessionId = null;
    this.heartbeatInterval = null;
    this.heartbeatIntervalMs = 60000; // 1 minute
    this.activeSeconds = 0;
    this.lastHeartbeat = null;
    this.viewedPosts = new Set(); // Track viewed posts per session to prevent duplicates
  }

  /**
   * Get authentication token
   */
  async getToken() {
    try {
      if (Platform.OS === "web") {
        return sessionStorage.getItem("token");
      } else {
        return await SecureStore.getItemAsync("token");
      }
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  }

  /**
   * Get stored session ID
   */
  async getStoredSessionId() {
    try {
      if (Platform.OS === "web") {
        return sessionStorage.getItem("session_id");
      } else {
        return await SecureStore.getItemAsync("session_id");
      }
    } catch (error) {
      console.error("Error getting session ID:", error);
      return null;
    }
  }

  /**
   * Store session ID
   */
  async storeSessionId(sessionId) {
    try {
      this.sessionId = sessionId;
      if (Platform.OS === "web") {
        sessionStorage.setItem("session_id", sessionId);
      } else {
        await SecureStore.setItemAsync("session_id", sessionId);
      }
    } catch (error) {
      console.error("Error storing session ID:", error);
    }
  }

  /**
   * Clear session ID
   */
  async clearSessionId() {
    try {
      this.sessionId = null;
      if (Platform.OS === "web") {
        sessionStorage.removeItem("session_id");
      } else {
        await SecureStore.deleteItemAsync("session_id");
      }
    } catch (error) {
      console.error("Error clearing session ID:", error);
    }
  }

  /**
   * Start a new session
   */
  async startSession() {
    try {
      const token = await this.getToken();
      if (!token) {
        console.log("No token available, cannot start session");
        return null;
      }

      const response = await fetch(`${API_URL}/activity/session/start`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await response.json();

      if (data.success && data.session) {
        await this.storeSessionId(data.session.session_id);
        this.lastHeartbeat = Date.now();
        this.activeSeconds = data.session.active_seconds || 0;

        // Clear viewed posts when starting new session
        this.viewedPosts = new Set();

        // Start heartbeat
        this.startHeartbeat();

        console.log("Session started:", data.session.session_id);
        return data.session;
      } else {
        console.error("Failed to start session:", data);
        return null;
      }
    } catch (error) {
      console.error("Error starting session:", error);
      return null;
    }
  }

  /**
   * End current session
   */
  async endSession() {
    try {
      // Stop heartbeat first
      this.stopHeartbeat();

      const token = await this.getToken();
      const sessionId = this.sessionId || (await this.getStoredSessionId());

      if (!token || !sessionId) {
        console.log("No token or session ID, cannot end session");
        await this.clearSessionId();
        return;
      }

      const response = await fetch(`${API_URL}/activity/session/end`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          session_id: sessionId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log("Session ended successfully");
      }

      await this.clearSessionId();
      // Clear viewed posts set when session ends
      this.viewedPosts = new Set();
    } catch (error) {
      console.error("Error ending session:", error);
      await this.clearSessionId();
      // Clear viewed posts set even on error
      this.viewedPosts = new Set();
    }
  }

  /**
   * Send heartbeat to update active seconds
   */
  async sendHeartbeat() {
    try {
      const token = await this.getToken();
      let sessionId = this.sessionId || (await this.getStoredSessionId());

      if (!token) {
        console.log("No token available for heartbeat");
        this.stopHeartbeat();
        return;
      }

      if (!sessionId) {
        console.log(
          "No session ID available for heartbeat, trying to get current session",
        );
        // Try to get current session from backend
        const currentSession = await this.getCurrentSession();
        if (currentSession) {
          await this.storeSessionId(currentSession.session_id);
          sessionId = currentSession.session_id;
        } else {
          console.log("No active session found, stopping heartbeat");
          this.stopHeartbeat();
          return;
        }
      }

      // Calculate seconds since last heartbeat
      const now = Date.now();
      const secondsSinceLastHeartbeat = this.lastHeartbeat
        ? Math.floor((now - this.lastHeartbeat) / 1000)
        : 60;

      this.lastHeartbeat = now;
      this.activeSeconds += secondsSinceLastHeartbeat;

      const response = await fetch(`${API_URL}/activity/heartbeat`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          session_id: sessionId,
          active_seconds: secondsSinceLastHeartbeat,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update session ID if it was created
        if (data.session_id && !this.sessionId) {
          await this.storeSessionId(data.session_id);
        }
      } else {
        console.error("Heartbeat failed:", data);
      }
    } catch (error) {
      console.error("Error sending heartbeat:", error);
    }
  }

  /**
   * Start heartbeat interval
   */
  startHeartbeat() {
    // Clear any existing interval
    this.stopHeartbeat();

    // Set up new interval
    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat();
    }, this.heartbeatIntervalMs);

    console.log("Heartbeat started");
  }

  /**
   * Stop heartbeat interval
   */
  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
      console.log("Heartbeat stopped");
    }
  }

  /**
   * Track page view
   */
  async trackPageView(pageName) {
    try {
      const token = await this.getToken();
      const sessionId = this.sessionId || (await this.getStoredSessionId());

      if (!token) {
        return;
      }

      await fetch(`${API_URL}/activity/page-view`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          session_id: sessionId,
          page_name: pageName,
        }),
      });
    } catch (error) {
      console.error("Error tracking page view:", error);
    }
  }

  /**
   * Track post view
   * Includes deduplication to prevent multiple views within same session
   */
  async trackPostView(postId) {
    if (!this.sessionId || !postId) {
      console.warn(
        "Session not active or postId missing, cannot track post view.",
      );
      return;
    }

    // Deduplicate post views within the same session
    if (!this.viewedPosts) {
      this.viewedPosts = new Set();
    }

    if (this.viewedPosts.has(postId)) {
      return; // Already viewed in this session
    }

    this.viewedPosts.add(postId); // Mark as viewed for this session

    try {
      const token = await this.getToken();
      const sessionId = this.sessionId || (await this.getStoredSessionId());

      if (!token || !sessionId) {
        console.warn("No token or session ID for post view tracking");
        return;
      }

      const response = await fetch(`${API_URL}/activity/posts/${postId}/view`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          session_id: sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        return data.view_count;
      }
    } catch (error) {
      console.error("Error tracking post view:", error);
      // Remove from viewed set on error so it can be retried
      if (this.viewedPosts) {
        this.viewedPosts.delete(postId);
      }
      this.trackError("trackPostView", error.message);
    }
  }

  /**
   * Track user action
   */
  async trackAction(actionType) {
    try {
      const token = await this.getToken();
      const sessionId = this.sessionId || (await this.getStoredSessionId());

      if (!token) {
        return;
      }

      await fetch(`${API_URL}/activity/action`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          session_id: sessionId,
          action_type: actionType,
        }),
      });
    } catch (error) {
      console.error("Error tracking action:", error);
    }
  }

  /**
   * Track error
   */
  async trackError(errorMessage) {
    try {
      const token = await this.getToken();
      const sessionId = this.sessionId || (await this.getStoredSessionId());

      if (!token) {
        return;
      }

      await fetch(`${API_URL}/activity/error`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          session_id: sessionId,
          error_message: errorMessage,
        }),
      });
    } catch (error) {
      console.error("Error tracking error:", error);
    }
  }

  /**
   * Get current session
   */
  async getCurrentSession() {
    try {
      const token = await this.getToken();

      if (!token) {
        return null;
      }

      const response = await fetch(`${API_URL}/activity/session/current`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await response.json();

      if (data.success) {
        return data.session;
      }

      return null;
    } catch (error) {
      console.error("Error getting current session:", error);
      return null;
    }
  }
}

// Export singleton instance
const sessionService = new SessionService();
export default sessionService;
