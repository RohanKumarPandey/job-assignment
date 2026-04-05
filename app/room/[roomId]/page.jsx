'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import {
  Mic, MicOff, Video, VideoOff, Monitor, MonitorOff, PhoneOff,
  MessageSquare, Users, Brain, Settings, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { VideoGrid } from '@/components/meeting/VideoGrid';
import { ControlBar } from '@/components/meeting/ControlBar';
import { ParticipantPanel } from '@/components/meeting/ParticipantPanel';
import { ChatPanel } from '@/components/meeting/ChatPanel';
import { AIAssistantPanel } from '@/components/meeting/AIAssistantPanel';
import { useWebRTC } from '@/hooks/useWebRTC';
import { useSocket } from '@/hooks/useSocket';
import { useMedia } from '@/hooks/useMedia';
import { useRoomStore } from '@/store/roomStore';
import { apiClient } from '@/lib/axios';
import { toast } from 'sonner';

export default function RoomPage() {
  const { roomId } = useParams();
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePanel, setActivePanel] = useState(null); // 'chat' | 'participants' | 'ai'
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const { localStream, toggleAudio, toggleVideo, audioEnabled, videoEnabled } = useMedia();
  const { socket, connected } = useSocket(roomId);
  const { peers, remoteStreams } = useWebRTC(socket, localStream, roomId, user?.id);
  const { participants, messages, setParticipants } = useRoomStore();

  useEffect(() => {
    if (!isLoaded) return;
    const fetchRoom = async () => {
      try {
        const res = await apiClient.get(`/rooms/${roomId}`);
        setRoom(res.data.data.room);
      } catch {
        toast.error('Room not found or access denied');
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [isLoaded, roomId, router]);

  const handleLeave = async () => {
    if (socket && user) {
      socket.emit('room:leave', { roomId, userId: user.id });
    }
    localStream?.getTracks().forEach((t) => t.stop());
    router.push('/dashboard');
  };

  const toggleScreenShare = async () => {
    if (!socket) return;
    if (isScreenSharing) {
      socket.emit('media:screen-share-stop', { roomId, userId: user?.id });
      setIsScreenSharing(false);
    } else {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          socket.emit('media:screen-share-stop', { roomId, userId: user?.id });
        };
        socket.emit('media:screen-share-start', { roomId, userId: user?.id });
        setIsScreenSharing(true);
      } catch {
        toast.error('Screen sharing not available or permission denied');
      }
    }
  };

  if (loading || !isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-brand-violet border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Joining meeting...</p>
        </div>
      </div>
    );
  }

  const allStreams = [
    { socketId: 'local', stream: localStream, user: { id: user?.id, name: user?.firstName ?? 'You', avatar: user?.imageUrl } },
    ...remoteStreams,
  ];

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-none h-14 glass border-b border-border/50 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs font-mono">{roomId}</Badge>
          <span className="text-sm font-medium">{room?.title ?? 'Meeting'}</span>
          {connected && (
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span className="text-xs text-muted-foreground">Connected</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-brand-violet/10 text-brand-violet border-brand-violet/20">
            <Users className="w-3 h-3 mr-1" />
            {participants.length + 1}
          </Badge>
          <span className="text-xs text-muted-foreground font-mono">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex min-h-0">
        {/* Video grid */}
        <div className="flex-1 min-w-0 p-3">
          <VideoGrid streams={allStreams} />
        </div>

        {/* Side panel */}
        {activePanel && (
          <motion.div
            className="w-80 flex-none h-full border-l border-border/50 glass"
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activePanel === 'participants' && <ParticipantPanel participants={participants} />}
            {activePanel === 'chat' && <ChatPanel roomId={roomId} socket={socket} user={user} />}
            {activePanel === 'ai' && <AIAssistantPanel roomId={roomId} />}
          </motion.div>
        )}
      </div>

      {/* Control bar */}
      <ControlBar
        audioEnabled={audioEnabled}
        videoEnabled={videoEnabled}
        isScreenSharing={isScreenSharing}
        activePanel={activePanel}
        onToggleAudio={toggleAudio}
        onToggleVideo={toggleVideo}
        onToggleScreen={toggleScreenShare}
        onTogglePanel={setActivePanel}
        onLeave={handleLeave}
        socket={socket}
        roomId={roomId}
        userId={user?.id}
      />
    </div>
  );
}
