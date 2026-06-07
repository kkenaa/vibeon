<script setup lang="ts">
import { ref, computed, onMounted, reactive } from "vue";
import LabelValue from "./LabelValue.vue";
import StreamViewerModal from "./StreamViewerModal.vue";
import IconText from "./IconText.vue";

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

interface LiveStream {
  id: string;
  date: string;
  title: string;
  duration: number;
  viewers: number;
  giftsReceived: number;
  earnings: number;
  isLive?: boolean;
  streamUrl?: string;
  thumbnail?: string;
  category?: string;
  tags?: string[];
  comments?: Comment[];
  reactions?: { [key: string]: number };
  viewerCount?: number;
  startTime?: string;
  endTime?: string;
  dvrEnabled?: boolean;
  latency?: number;
  isHls?: boolean;
  allowSeeking?: boolean;
  currentLiveTime?: number;
  dvrWindow?: number;
  adminActionStatus?: "ended" | "paused" | "warning" | null;
}

interface Props {
  liveStreamHistory: LiveStream[];
  isLive: boolean;
  userId?: number;
  hostName?: string;
  hostUsername?: string;
  followerCount?: number;
}

const props = withDefaults(defineProps<Props>(), {
  userId: 0,
  hostName: "Creator",
  hostUsername: "@creator",
  followerCount: 5000,
});

const selectedStream = ref<LiveStream | null>(null);
const showStreamModal = ref(false);
const banReason = ref("");
const showBanModal = ref(false);
const selectedComment = ref<Comment | null>(null);
const streamViewer = ref<HTMLVideoElement | null>(null);

const currentLiveStream = ref<LiveStream | null>(null);

const commentsByStream = reactive<Record<string, Comment[]>>({});

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function buildMockComments(streamId: string): Comment[] {
  const uid = props.userId;
  const host = props.hostUsername;
  const seed = `${uid}-${streamId}`;
  const h = hashString(seed);
  const lines = [
    `Love this stream ${host}!`,
    `Great energy today 🔥`,
    `Shoutout from viewer #${(h % 900) + 100}`,
    `How long will you be live?`,
    `GG — donating next round`,
  ];
  return lines.map((msg, i) => ({
    id: `${streamId}-c${i + 1}`,
    userId: 2000 + ((h + i * 17) % 800),
    username: `@viewer_${uid}_${i + 1}`,
    userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}-v${i}`,
    message: msg,
    timestamp: new Date(Date.now() - (i + 1) * 120000).toISOString(),
    reactions: { "❤️": (h + i) % 12, "🔥": (h >> i) % 8 } as {
      [key: string]: number;
    },
  }));
}

function commentsForStream(streamId: string): Comment[] {
  if (!commentsByStream[streamId]) {
    commentsByStream[streamId] = buildMockComments(streamId);
  }
  return commentsByStream[streamId];
}

const modalComments = computed(() => {
  if (!selectedStream.value) return [];
  return commentsForStream(selectedStream.value.id);
});

onMounted(() => {
  if (props.isLive) {
    const baseline = Math.max(
      200,
      Math.round((props.followerCount ?? 5000) / 80) + (props.userId % 500),
    );
    currentLiveStream.value = {
      id: `live-${props.userId}-current`,
      date: new Date().toISOString(),
      title: `${props.hostName} — Live now`,
      duration: 0,
      viewers: baseline,
      giftsReceived: 20 + (props.userId % 80),
      earnings: 60 + (props.userId % 200),
      isLive: true,
      streamUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
      thumbnail: `https://picsum.photos/seed/${props.userId}-live/640/360.jpg`,
      category: ["Gaming", "Music", "Cooking"][props.userId % 3],
      tags: ["live", `host-${props.userId}`],
      comments: [],
      reactions: { "❤️": 23, "🔥": 15, "👏": 8 },
      viewerCount: baseline,
      startTime: new Date().toISOString(),
      dvrEnabled: true,
      latency: 5,
      isHls: true,
      allowSeeking: true,
      currentLiveTime: Date.now(),
      dvrWindow: 300,
    };
  }

  props.liveStreamHistory.forEach((stream, index) => {
    const useHls = (props.userId + index) % 2 === 1;
    stream.streamUrl = useHls
      ? "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
      : "https://www.w3schools.com/html/mov_bbb.mp4";
    stream.thumbnail = `https://picsum.photos/seed/${props.userId}-${stream.id}/640/360.jpg`;
    stream.category = ["Gaming", "Music", "Cooking"][
      (props.userId + index) % 3
    ];
    stream.tags = ["recorded", "highlight", `u${props.userId}`];
    stream.reactions = {
      "❤️": Math.floor(hashString(`${props.userId}-${stream.id}-a`) % 50),
      "🔥": Math.floor(hashString(`${props.userId}-${stream.id}-b`) % 30),
      "👏": Math.floor(hashString(`${props.userId}-${stream.id}-c`) % 20),
    };
    stream.dvrEnabled = false;
    stream.latency = 0;
    stream.isHls = useHls;
    stream.allowSeeking = true;
    stream.currentLiveTime = 0;
    stream.dvrWindow = 0;
  });
});

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const formatTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

const formatViewers = (count: number): string => {
  if (count >= 1000000) return (count / 1000000).toFixed(1) + "M";
  if (count >= 1000) return (count / 1000).toFixed(1) + "K";
  return count.toString();
};

const openStreamViewer = (stream: LiveStream) => {
  selectedStream.value = stream;
  commentsForStream(stream.id);
  showStreamModal.value = true;
};

const closeStreamViewer = () => {
  showStreamModal.value = false;
  selectedStream.value = null;
  if (streamViewer.value) {
    streamViewer.value.pause();
  }
};

const handleAddReaction = (commentId: string, reaction: string) => {
  const id = selectedStream.value?.id;
  if (!id) return;
  const comment = commentsForStream(id).find((c) => c.id === commentId);
  if (comment) {
    if (!comment.reactions[reaction]) {
      comment.reactions[reaction] = 0;
    }
    comment.reactions[reaction]++;
  }
};

const handleDeleteComment = (commentId: string) => {
  const id = selectedStream.value?.id;
  if (!id) return;
  const list = commentsForStream(id);
  const index = list.findIndex((c) => c.id === commentId);
  if (index > -1) {
    list.splice(index, 1);
  }
};

const handleBanUser = (comment: Comment) => {
  const id = selectedStream.value?.id;
  if (!id) return;
  const commentIndex = commentsForStream(id).findIndex(
    (c) => c.id === comment.id,
  );

  if (commentIndex > -1) {
    commentsForStream(id)[commentIndex].isBanned = true;
  }

  showBanModal.value = false;
  selectedComment.value = null;
  banReason.value = "";
};

const handleModerationAction = (action: "end" | "pause" | "warning") => {
  const stream = selectedStream.value;
  if (!stream) return;

  const statusMapping = {
    end: "ended" as const,
    pause: "paused" as const,
    warning: "warning" as const,
  };

  stream.adminActionStatus = statusMapping[action];

  if (action === "end" && stream.isLive) {
    stream.isLive = false;
    if (currentLiveStream.value?.id === stream.id) {
      currentLiveStream.value = null;
    }
  }
};

const totalLiveMinutes = (): number => {
  return props.liveStreamHistory.reduce(
    (sum, stream) => sum + stream.duration,
    0,
  );
};

const totalViewers = (): number => {
  return props.liveStreamHistory.reduce(
    (sum, stream) => sum + stream.viewers,
    0,
  );
};

const totalEarnings = (): number => {
  return props.liveStreamHistory.reduce(
    (sum, stream) => sum + stream.earnings,
    0,
  );
};

const averageViewersPerStream = (): number => {
  if (props.liveStreamHistory.length === 0) return 0;
  return Math.round(totalViewers() / props.liveStreamHistory.length);
};

const earningsStats = computed(() => {
  if (!props.liveStreamHistory) return [];

  return [
    {
      label: "Total Streams (2 weeks)",
      value: `${props.liveStreamHistory.length}`,
    },
    {
      label: "Total Duration",
      value: `${formatDuration(totalLiveMinutes())}`,
    },
    {
      label: "Total Viewers",
      value: `${formatViewers(totalViewers())}`,
    },
    {
      label: "Avg per Stream",
      value: `${formatViewers(averageViewersPerStream())}`,
    },
    {
      label: "Total Earnings",
      value: `$${totalEarnings()}`,
      highlight: true,
    },
  ];
});

const allStreams = computed(() => {
  const streams = [...props.liveStreamHistory];
  if (currentLiveStream.value) {
    streams.unshift(currentLiveStream.value);
  }
  return streams;
});

const getStreamDetails = (stream: LiveStream) => [
  {
    icon: "⏱️",
    text: stream.isLive
      ? formatTime(stream.startTime!)
      : formatDuration(stream.duration),
    class: "detail",
  },
  {
    icon: "👥",
    text: `${formatViewers(stream.viewers)} viewers`,
    class: "detail",
  },
  {
    icon: "🎁",
    text: `${stream.giftsReceived} gifts`,
    class: "detail",
  },
  {
    icon: "💰",
    text: `$${stream.earnings}`,
    class: "detail earnings",
  },
];
</script>

<template>
  <div class="live-stream-section">
    <div class="header">
      <h3>Live Stream History</h3>
      <span
        v-if="
          isLive &&
          !allStreams.some((stream) => stream.adminActionStatus == 'ended')
        "
        class="live-indicator"
        >🔴 Currently Live</span
      >
    </div>

    <div v-if="allStreams.length === 0" class="empty-state">
      <p>📺 No live streams yet. Start your first stream!</p>
    </div>

    <div v-else>
      <div class="stream-stats">
        <LabelValue
          v-for="(stat, index) in earningsStats"
          :key="index"
          :label="stat.label"
          :value="stat.value"
          :class="['stat', { highlight: stat.highlight }]"
        />
      </div>

      <div class="streams-list">
        <div
          v-for="stream in allStreams"
          :key="stream.id"
          :class="['stream-item', { 'live-stream': stream.isLive }]"
        >
          <div class="stream-date-badge">
            <span :class="['badge', { 'live-badge': stream.isLive }]">
              {{ stream.isLive ? "LIVE" : formatDate(stream.date) }}
            </span>
          </div>

          <div class="stream-content">
            <div class="stream-header">
              <h4 class="stream-title">{{ stream.title }}</h4>
              <div class="stream-actions">
                <button
                  @click="openStreamViewer(stream)"
                  class="action-btn view-btn"
                  :disabled="!stream.streamUrl"
                >
                  {{ stream.isLive ? "Watch Live" : "Watch Recording" }}
                </button>
              </div>
            </div>

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

            <div class="stream-details">
              <IconText
                v-for="(item, index) in getStreamDetails(stream)"
                :key="index"
                :classname="item.class"
                :label="item.text"
              >
                <template #leftIcon>
                  <span>{{ item.icon }}</span>
                </template>
              </IconText>
            </div>

            <div v-if="stream.category || stream.tags" class="stream-meta">
              <span v-if="stream.category" class="category-tag">{{
                stream.category
              }}</span>
              <span v-for="tag in stream.tags" :key="tag" class="tag">{{
                tag
              }}</span>
            </div>

            <div v-if="stream.reactions" class="stream-reactions">
              <span
                v-for="(count, reaction) in stream.reactions"
                :key="reaction"
                class="reaction-item"
              >
                {{ reaction }} {{ count }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <StreamViewerModal
      v-if="showStreamModal && selectedStream"
      :stream="selectedStream"
      :comments="modalComments"
      :viewer-list-seed="`${userId}-${selectedStream.id}`"
      @close="closeStreamViewer"
      @add-reaction="handleAddReaction"
      @delete-comment="handleDeleteComment"
      @ban-user="handleBanUser"
      @moderation-action="handleModerationAction"
    />
  </div>
</template>

<style scoped>
.live-stream-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h3 {
  margin: 0;
  font-size: 18px;
  color: #000;
}

.live-indicator {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #fee2e2;
  color: #991b1b;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #9ca3af;
  font-size: 16px;
}

.stream-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}

.stat {
  flex-direction: column;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  text-align: center;
}

.stat.highlight {
  background: #fef3c7;
  border: 1px solid #fcd34d;
}

.stat :deep(.info-label) {
  display: block;
  font-size: 11px;
  color: #6b7280;
  margin-bottom: 4px;
  text-transform: uppercase;
  font-weight: 600;
}

.stat :deep(.info-value) {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: #000;
}

.streams-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stream-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s;
}

.stream-item:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.stream-item.live-stream {
  background: #fef2f2;
  border-color: #fecaca;
}

.stream-item.live-stream:hover {
  background: #fee2e2;
  border-color: #fca5a5;
}

.stream-date-badge {
  min-width: 70px;
}

.badge {
  display: inline-block;
  padding: 4px 8px;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}

.live-badge {
  background: #dc2626;
  color: white;
  animation: pulse 1.5s infinite;
}

.stream-content {
  flex: 1;
}

.stream-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.stream-title {
  margin: 0 0 8px 0;
  font-size: 15px;
  color: #000;
  font-weight: 600;
}

.stream-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.view-btn {
  background: #3b82f6;
  color: white;
}

.view-btn:hover:not(:disabled) {
  background: #2563eb;
}

.view-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.moderate-btn {
  background: #f59e0b;
  color: white;
}

.moderate-btn:hover {
  background: #d97706;
}

.stream-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 8px;
}

.detail {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #374151;
  border: none;
  background-color: transparent;
}

.detail-icon {
  font-size: 14px;
}

.detail-text {
  font-weight: 500;
  margin-top: 4px;
}

.detail.earnings {
  color: #059669;
  font-weight: 600;
}

.stream-meta {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.category-tag,
.tag {
  display: inline-block;
  padding: 2px 8px;
  background: #e5e7eb;
  color: #374151;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.category-tag {
  background: #3b82f6;
  color: white;
}

.stream-reactions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.reaction-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: #f3f4f6;
  border-radius: 16px;
  font-size: 12px;
  color: #374151;
}

.admin-action-status {
  margin-bottom: 8px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
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
  font-size: 14px;
}

.status-text {
  font-size: 12px;
}

@media (max-width: 768px) {
  .stream-item {
    flex-direction: column;
    gap: 12px;
  }

  .stream-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .stream-header {
    flex-direction: column;
    gap: 8px;
  }

  .stream-actions {
    width: 100%;
  }

  .action-btn {
    flex: 1;
  }

  .stream-modal {
    width: 95%;
    max-height: 95vh;
  }

  .info-row {
    flex-direction: column;
    gap: 8px;
  }

  .comment-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .comment-actions {
    width: 100%;
  }
}
</style>
