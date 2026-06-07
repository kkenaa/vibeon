<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from "vue";
import Hls from "hls.js";
import TextInput from "./TextInput.vue";
import ActionButton from "./ActionButton.vue";
import type { ButtonConfig } from "./ActionButton.vue";

interface Comment {
  id: string;
  userId: number;
  username: string;
  userAvatar: string;
  message: string;
  timestamp: string;
  reactions: { [key: string]: number };
  isBanned?: boolean;
}

interface Viewer {
  id: number;
  username: string;
  userAvatar: string;
  joinedAt: string;
  isFollowing: boolean;
}

interface LiveStream {
  id: string;
  title: string;
  viewers: number;
  giftsReceived: number;
  earnings: number;
  streamUrl?: string;
  isLive?: boolean;
  dvrEnabled?: boolean;
  latency?: number;
  isHls?: boolean;
  allowSeeking?: boolean;
  currentLiveTime?: number;
  dvrWindow?: number;
  adminActionStatus?: "ended" | "paused" | "warning" | null;
}

interface Props {
  stream: LiveStream | null;
  comments: Comment[];
}

interface Emits {
  (e: "close"): void;
  (e: "add-reaction", commentId: string, reaction: string): void;
  (e: "delete-comment", commentId: string): void;
  (e: "ban-user", comment: Comment): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const streamViewer = ref<HTMLVideoElement | null>(null);
const hlsInstance = ref<any>(null);
const reactionTypes = ["❤️", "😂", "🔥", "👏", "🎉", "😮", "👍", "👎"];
const currentViewers = ref(props.stream?.viewers || 0);
const isAtLiveEdge = ref(true);
const viewerUpdateInterval = ref<number | null>(null);
const selectedStreamForModeration = ref<LiveStream | null>(null);
const currentLiveStream = ref<LiveStream | null>(null);
const commentSearchQuery = ref("");
const userSearchQuery = ref("");
const showViewersModal = ref(false);

const filteredComments = computed(() => {
  if (!commentSearchQuery.value.trim()) {
    return props.comments;
  }
  const query = commentSearchQuery.value.toLowerCase();
  return props.comments.filter(
    (comment) =>
      comment.username.toLowerCase().includes(query) ||
      comment.message.toLowerCase().includes(query),
  );
});

const currentViewersList = computed<Viewer[]>(() => {
  const viewerCount = currentViewers.value;
  const viewers: Viewer[] = [];
  const usernames = [
    "alex_gamer",
    "sarah_streams",
    "mike_watcher",
    "emma_live",
    "john_doe",
    "jane_smith",
    "chris_viewer",
    "lisa_fan",
    "david_chat",
    "amy_likes",
    "tom_follows",
    "grace_subs",
    "kevin_chat",
    "nina_watch",
    "ryan_fan",
    "olivia_live",
  ];

  for (let i = 0; i < Math.min(viewerCount, 16); i++) {
    const username = usernames[i % usernames.length];
    viewers.push({
      id: i + 1,
      username: `@${username}`,
      userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      joinedAt: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      isFollowing: Math.random() > 0.5,
    });
  }

  return viewers;
});
const showViewers = () => {
  showViewersModal.value = !showViewersModal.value;
};

const filteredViewers = computed<Viewer[]>(() => {
  if (!userSearchQuery.value.trim()) {
    return currentViewersList.value;
  }
  const query = userSearchQuery.value.toLowerCase();
  return currentViewersList.value.filter((viewer) =>
    viewer.username.toLowerCase().includes(query),
  );
});

const formatViewers = (count: number): string => {
  if (count >= 1000000) return (count / 1000000).toFixed(1) + "M";
  if (count >= 1000) return (count / 1000).toFixed(1) + "K";
  return count.toString();
};

const formatTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const closeModal = () => {
  emit("close");
  cleanupPlayer();
};

const addReaction = (commentId: string, reaction: string) => {
  emit("add-reaction", commentId, reaction);
};

const deleteComment = (commentId: string) => {
  emit("delete-comment", commentId);
};

const banUser = (comment: Comment) => {
  console.log("StreamViewerModal banUser called with comment:", comment);
  emit("ban-user", comment);
};

const initializePlayer = () => {
  if (!streamViewer.value || !props.stream?.streamUrl) return;

  if (props.stream.isHls) {
    initHlsPlayer();
  } else {
    initNativePlayer();
  }
};

const initHlsPlayer = () => {
  if (!streamViewer.value || !props.stream?.streamUrl) return;

  if (Hls.isSupported()) {
    hlsInstance.value = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
      backBufferLength: 90,
    });

    hlsInstance.value.loadSource(props.stream.streamUrl);
    hlsInstance.value.attachMedia(streamViewer.value);
    hlsInstance.value.on(Hls.Events.MANIFEST_PARSED, () => {
      if (streamViewer.value) {
        streamViewer.value.play().catch(console.error);
      }
    });
  } else if (streamViewer.value.canPlayType("application/vnd.apple.mpegurl")) {
    streamViewer.value.src = props.stream.streamUrl;
    streamViewer.value.play().catch(console.error);
  } else {
    initNativePlayer();
  }

  setupPlayerEventListeners();
};

const initNativePlayer = () => {
  if (!streamViewer.value || !props.stream?.streamUrl) return;

  streamViewer.value.src = props.stream.streamUrl;
  streamViewer.value.play().catch(console.error);
  setupPlayerEventListeners();
};

const setupPlayerEventListeners = () => {
  if (!streamViewer.value) return;
  if (props.stream?.isLive && !props.stream.allowSeeking) {
    streamViewer.value.addEventListener("seeking", () => {
      const currentTime = streamViewer.value!.currentTime;
      const duration = streamViewer.value!.duration;
      if (duration && currentTime < duration - 2) {
        streamViewer.value!.currentTime = duration;
      }
    });
  }
  if (props.stream?.isLive && props.stream.dvrEnabled) {
    streamViewer.value.addEventListener("timeupdate", () => {
      const currentTime = streamViewer.value!.currentTime;
      const duration = streamViewer.value!.duration;
      if (duration) {
        isAtLiveEdge.value = duration - currentTime < 2;
      }
    });
  }
  if (props.stream?.isLive) {
    startViewerUpdates();
  }
};

const jumpToLive = () => {
  if (streamViewer.value && props.stream?.isLive) {
    const duration = streamViewer.value.duration;
    if (duration) {
      streamViewer.value.currentTime = duration;
      isAtLiveEdge.value = true;
    }
  }
};

const startViewerUpdates = () => {
  if (viewerUpdateInterval.value) {
    clearInterval(viewerUpdateInterval.value);
  }

  viewerUpdateInterval.value = window.setInterval(() => {
    const change = Math.floor(Math.random() * 20) - 10;
    currentViewers.value = Math.max(0, currentViewers.value + change);
  }, 3000);
};

const stopViewerUpdates = () => {
  if (viewerUpdateInterval.value) {
    clearInterval(viewerUpdateInterval.value);
    viewerUpdateInterval.value = null;
  }
};

const cleanupPlayer = () => {
  stopViewerUpdates();
  if (hlsInstance.value) {
    hlsInstance.value.destroy();
    hlsInstance.value = null;
  }
  if (streamViewer.value) {
    streamViewer.value.pause();
    streamViewer.value.src = "";
  }
};

watch(
  () => props.stream,
  (newStream) => {
    if (newStream) {
      currentViewers.value = newStream.viewers || 0;
      cleanupPlayer();
      setTimeout(() => initializePlayer(), 100);
    }
  },
  { immediate: true },
);

onMounted(() => {
  setTimeout(() => initializePlayer(), 100);
});

onBeforeUnmount(() => {
  cleanupPlayer();
});

const handleModerationAction = (action: "end" | "pause" | "warning") => {
  if (!props.stream) return;

  const actionMessages = {
    end: "Stream has been ended",
    pause: "Stream has been paused",
    warning: "Warning has been sent to streamer",
  };

  const statusMapping = {
    end: "ended" as const,
    pause: "paused" as const,
    warning: "warning" as const,
  };

  alert(actionMessages[action]);
  props.stream.adminActionStatus = statusMapping[action];

  if (action === "end" && props.stream.isLive) {
    props.stream.isLive = false;

    if (currentLiveStream.value?.id === props.stream.id) {
      currentLiveStream.value = null;
    }
  }

  selectedStreamForModeration.value = null;
};

const moderationButtons = computed<ButtonConfig[]>(() => [
  {
    name: "⏹️ End Stream",
    variant: "ban",
    onClick: () => handleModerationAction("end"),
  },
  {
    name: "⏸️ Pause Stream",
    variant: "view",
    onClick: () => handleModerationAction("pause"),
  },
  {
    name: "⚠️ Send Warning",
    variant: "primary",
    onClick: () => handleModerationAction("warning"),
  },
]);
</script>

<template>
  <div v-if="stream" class="modal-overlay" @click="closeModal">
    <div class="stream-modal" @click.stop>
      <div class="modal-header">
        <h3>{{ stream.title }}</h3>
        <button @click="closeModal" class="close-btn">✕</button>
      </div>

      <div class="stream-container">
        <div class="stream-video-container">
          <video
            v-if="stream.streamUrl"
            ref="streamViewer"
            controls
            autoplay
            class="stream-video"
          ></video>
          <div v-else class="no-video-placeholder">
            <div class="placeholder-icon">📺</div>
            <p>Video not available</p>
          </div>

          <div v-if="stream.isLive" class="live-indicator-overlay">
            <div class="live-badge">
              <span class="live-dot"></span>
              <span>LIVE</span>
            </div>
            <div v-if="stream.latency" class="latency-indicator">
              {{ stream.latency }}s latency
            </div>
          </div>

          <button
            v-if="stream.isLive && stream.dvrEnabled && !isAtLiveEdge"
            @click="jumpToLive"
            class="jump-to-live-btn"
          >
            <span class="live-dot"></span>
            Back to Live
          </button>
        </div>
        <div class="stream-info-container">
          <div class="stream-info">
            <div v-if="stream.adminActionStatus" class="admin-action-status">
              <span :class="['status-badge', stream.adminActionStatus]">
                <span class="status-icon">
                  {{
                    stream.adminActionStatus === "ended"
                      ? "🛑"
                      : stream.adminActionStatus === "paused"
                        ? "⏸️"
                        : "⚠️"
                  }}
                </span>
                <span class="status-text">
                  {{
                    stream.adminActionStatus === "ended"
                      ? "Stream Ended by Admin"
                      : stream.adminActionStatus === "paused"
                        ? "Stream Paused by Admin"
                        : "Warning Sent by Admin"
                  }}
                </span>
              </span>
            </div>
            <div class="info-row">
              <span class="info-item viewer-count" @click="showViewers">
                <span class="icon">👥</span>
                {{
                  formatViewers(stream.isLive ? currentViewers : stream.viewers)
                }}
                {{ stream.isLive ? "watching" : "viewed" }}
              </span>
              <span class="info-item">
                <span class="icon">🎁</span>
                {{ stream.giftsReceived }} gifts
              </span>
              <span class="info-item">
                <span class="icon">💰</span>
                ${{ stream.earnings }} earned
              </span>
            </div>
          </div>

          <div class="comments-section">
            <h4>Live Comments</h4>

            <TextInput
              v-model="commentSearchQuery"
              placeholder="Search comments by username or message..."
              inputClass="search-comments"
            />

            <div class="comments-list">
              <div
                v-for="comment in filteredComments"
                :key="comment.id"
                :class="['comment-item', { banned: comment.isBanned }]"
                v-if="filteredComments.length > 0"
              >
                <div class="comment-header">
                  <img
                    :src="comment.userAvatar"
                    :alt="comment.username"
                    class="comment-avatar"
                  />
                  <div class="comment-info">
                    <span class="comment-username">{{ comment.username }}</span>
                    <span class="comment-time">{{
                      formatTime(comment.timestamp)
                    }}</span>
                  </div>
                  <div class="comment-actions">
                    <button
                      @click="deleteComment(comment.id)"
                      class="action-btn delete-btn"
                    >
                      Delete
                    </button>
                    <button
                      @click="banUser(comment)"
                      class="action-btn ban-btn"
                    >
                      Ban
                    </button>
                  </div>
                </div>

                <div class="comment-content">
                  <p v-if="!comment.isBanned">{{ comment.message }}</p>
                  <p v-else class="banned-message">
                    [Comment removed - User banned]
                  </p>
                </div>

                <div class="comment-reactions">
                  <button
                    v-for="reaction in reactionTypes"
                    :key="reaction"
                    @click="addReaction(comment.id, reaction)"
                    class="reaction-btn"
                  >
                    {{ reaction }} {{ comment.reactions[reaction] || 0 }}
                  </button>
                </div>
              </div>
              <p v-if="filteredComments.length === 0" class="no-comments">
                No comments found.
              </p>
            </div>
          </div>
          <div v-if="stream.isLive" class="moderate-modal" @click.stop>
            <div class="moderation-actions">
              <ActionButton :buttons="moderationButtons" />
            </div>
          </div>

          <div class="viewers-modal" v-if="showViewersModal">
            <div class="viewers-modal-header">
              <h3>Viewers</h3>
              <button @click="showViewersModal = false" class="close-btn">
                ✕
              </button>
            </div>
            <TextInput
              v-model="userSearchQuery"
              placeholder="Search viewers by username..."
              inputClass="search-users"
            />
            <div class="viewers-modal-content">
              <div class="viewers-list">
                <div
                  v-for="viewer in filteredViewers"
                  :key="viewer.id"
                  class="viewer-item"
                >
                  <img
                    :src="viewer.userAvatar"
                    :alt="viewer.username"
                    class="viewer-avatar"
                  />
                  <div class="viewer-info">
                    <span class="viewer-username">{{ viewer.username }}</span>
                    <span class="viewer-joined">{{
                      formatTime(viewer.joinedAt)
                    }}</span>
                  </div>
                  <span v-if="viewer.isFollowing" class="following-badge"
                    >Following</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.stream-modal {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 100%;
  max-height: 100vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #000;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #6b7280;
  padding: 4px;
}

.close-btn:hover {
  color: #000;
}

.stream-container {
  display: flex;
  flex-direction: row;
  padding: 20px;
}
.stream-video-container {
  position: relative;
  width: 100%;
  background: #000;
  overflow: hidden;
}

.stream-video {
  width: 100%;
  aspect-ratio: 16/9;
}

.live-indicator-overlay {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 10;
}

.live-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(220, 38, 38, 0.95);
  color: white;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.live-dot {
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  animation: livePulse 1.5s infinite;
}

@keyframes livePulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.8);
  }
}

.latency-indicator {
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.jump-to-live-btn {
  position: absolute;
  bottom: 80px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: rgba(220, 38, 38, 0.95);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s;
}

.jump-to-live-btn:hover {
  background: rgba(185, 28, 28, 0.95);
  transform: translateY(-2px);
}

.jump-to-live-btn .live-dot {
  width: 6px;
  height: 6px;
}

.no-video-placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #9ca3af;
}

.placeholder-icon {
  font-size: 48px;
  margin-bottom: 8px;
}

.stream-info-container {
  width: 400px;
  min-width: 400px;
  height: 68vh;
  min-height: 68vh;
}

.stream-info {
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.info-row {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #374151;
}

.icon {
  font-size: 16px;
}

.viewer-count {
  cursor: pointer;
  transition: all 0.2s;
  padding: 4px 8px;
  border-radius: 4px;
  position: relative;
}

.viewer-count:hover {
  background: #e5e7eb;
}

.comments-section {
  flex: 1;
  overflow-y: auto;
  padding: 20px 0 20px 20px;
}

.comments-section h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #000;
}

.search-comments {
  padding: 10px 0;
  outline: none;
}

.search-users {
  padding: 20px 10px 10px 10px;
}

.search-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.comments-list {
  overflow-y: auto;
  margin-bottom: 16px;
  height: 660px;
  scrollbar-width: auto;
}

.comment-item {
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 8px;
}

.comment-item.banned {
  opacity: 0.6;
  background: #f9fafb;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.comment-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.comment-info {
  flex: 1;
}

.comment-username {
  font-weight: 600;
  font-size: 14px;
  color: #000;
  display: block;
}

.comment-time {
  font-size: 12px;
  color: #6b7280;
}

.comment-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
}

.delete-btn {
  background: #ef4444;
  color: white;
}

.delete-btn:hover {
  background: #dc2626;
}

.ban-btn {
  background: #6b7280;
  color: white;
}

.ban-btn:hover {
  background: #4b5563;
}

.comment-content {
  margin-bottom: 8px;
}

.comment-content p {
  margin: 0;
  font-size: 14px;
  color: #374151;
}

.banned-message {
  color: #6b7280;
  font-style: italic;
}

.comment-reactions {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.reaction-btn {
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.reaction-btn:hover {
  background: #e5e7eb;
}

.comment-input-section {
  border-top: 1px solid #e5e7eb;
  padding-top: 16px;
}

.comment-input-wrapper {
  display: flex;
  gap: 8px;
}

.comment-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
}

.comment-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.send-btn {
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.send-btn:hover {
  background: #2563eb;
}

.admin-action-status {
  margin-bottom: 12px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
}

.status-badge.ended {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.status-badge.paused {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
}

.status-badge.warning {
  background: #fef9c3;
  color: #854d0e;
  border: 1px solid #fef08a;
}

.status-icon {
  font-size: 16px;
}

.status-text {
  font-size: 13px;
}

.viewers-modal {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 300px;
  max-height: 28vh;
  overflow-y: auto;
  box-shadow: 10px 20px 25px -5px rgba(0.1, 0.1, 0.1, 0.1);
  position: absolute;
  top: 11%;
  margin-top: 20px;
  margin-left: 20px;
  border: 1px solid lightgray;
}

.viewers-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 10px;
  border-bottom: 1px solid #e5e7eb;
}

.viewers-modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #000;
}

.viewers-modal-content {
  padding: 10px;
}

.viewers-count {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #6b7280;
}

.viewers-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.viewer-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.viewer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.viewer-info {
  flex: 1;
}

.viewer-username {
  display: block;
  font-weight: 600;
  font-size: 14px;
  color: #000;
}

.viewer-joined {
  font-size: 12px;
  color: #6b7280;
}

.following-badge {
  padding: 4px 8px;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
}

.moderate-modal {
  background: white;
  border-radius: 12px;
  padding: 20px;
  width: 380px;
  min-width: 380px;
  position: absolute;
  bottom: 0;
  right: 0;
}

.moderation-actions {
  margin-bottom: 20px;
}

.moderation-actions :deep(.action-buttons) {
  flex-direction: column;
  gap: 12px;
}

.moderation-actions :deep(.btn) {
  display: flex;
  width: 100%;
  justify-content: center;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .moderate-modal {
    width: 95%;
  }
}
</style>
