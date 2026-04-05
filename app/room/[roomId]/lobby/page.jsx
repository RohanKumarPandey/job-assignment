'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { Mic, MicOff, Video, VideoOff, Settings, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiClient } from '@/lib/axios';
import { toast } from 'sonner';

export default function LobbyPage() {
  const { roomId } = useParams();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const videoRef = useRef(null);

  const [room, setRoom] = useState(null);
  const [stream, setStream] = useState(null);
  const [devices, setDevices] = useState({ audio: [], video: [] });
  const [selectedAudio, setSelectedAudio] = useState('');
  const [selectedVideo, setSelectedVideo] = useState('');
  const [audioOn, setAudioOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [displayName, setDisplayName] = useState('');
  const [joining, setJoining] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!isLoaded) return;
    setDisplayName(user?.firstName ?? '');

    // Fetch room info
    apiClient
      .get(`/rooms/${roomId}`)
      .then((res) => setRoom(res.data.data.room))
      .catch(() => {
        toast.error('Room not found');
        router.push('/dashboard');
      });

    // Request media
    const initMedia = async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;

        const allDevices = await navigator.mediaDevices.enumerateDevices();
        setDevices({
          audio: allDevices.filter((d) => d.kind === 'audioinput'),
          video: allDevices.filter((d) => d.kind === 'videoinput'),
        });
      } catch {
        toast.error('Could not access camera/microphone');
      }
    };
    initMedia();

    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [isLoaded]);

  const toggleAudio = () => {
    stream?.getAudioTracks().forEach((t) => { t.enabled = !audioOn; });
    setAudioOn((v) => !v);
  };

  const toggleVideo = () => {
    stream?.getVideoTracks().forEach((t) => { t.enabled = !videoOn; });
    setVideoOn((v) => !v);
    if (videoRef.current) videoRef.current.srcObject = videoOn ? null : stream;
  };

  const handleJoin = async () => {
    if (!displayName.trim()) {
      toast.error('Please enter your display name');
      return;
    }
    setJoining(true);
    try {
      await apiClient.post(`/rooms/${roomId}/join`, { password });
      router.push(`/room/${roomId}`);
    } catch (err) {
      toast.error(err.response?.data?.error?.message ?? 'Failed to join meeting');
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 bg-mesh-gradient">
      <motion.div
        className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Video preview */}
        <div className="glass rounded-2xl overflow-hidden aspect-video relative">
          {videoOn && stream ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover scale-x-[-1]"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <Avatar className="w-20 h-20 mb-3">
                <AvatarImage src={user?.imageUrl} />
                <AvatarFallback className="text-2xl bg-brand-violet text-white">
                  {displayName?.[0]?.toUpperCase() ?? 'U'}
                </AvatarFallback>
              </Avatar>
              <p className="text-muted-foreground text-sm">Camera is off</p>
            </div>
          )}
          {/* Media controls overlay */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
            <button
              onClick={toggleAudio}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${audioOn ? 'bg-secondary hover:bg-secondary/80' : 'bg-destructive hover:bg-destructive/80'}`}
              aria-label={audioOn ? 'Mute microphone' : 'Unmute microphone'}
            >
              {audioOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>
            <button
              onClick={toggleVideo}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${videoOn ? 'bg-secondary hover:bg-secondary/80' : 'bg-destructive hover:bg-destructive/80'}`}
              aria-label={videoOn ? 'Turn off camera' : 'Turn on camera'}
            >
              {videoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Join form */}
        <div className="glass rounded-2xl p-8 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold mb-1">
              {room?.title ?? 'Meeting Lobby'}
            </h1>
            <p className="text-muted-foreground text-sm mb-6">
              {room?.description || 'Check your audio and video before joining.'}
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <Label htmlFor="display-name">Your display name</Label>
                <Input
                  id="display-name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your name"
                  className="mt-1.5 bg-secondary/50"
                />
              </div>

              {devices.video.length > 1 && (
                <div>
                  <Label>Camera</Label>
                  <Select value={selectedVideo} onValueChange={setSelectedVideo}>
                    <SelectTrigger className="mt-1.5 bg-secondary/50">
                      <SelectValue placeholder="Select camera" />
                    </SelectTrigger>
                    <SelectContent>
                      {devices.video.map((d) => (
                        <SelectItem key={d.deviceId} value={d.deviceId}>
                          {d.label || `Camera ${d.deviceId.slice(0, 6)}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {devices.audio.length > 1 && (
                <div>
                  <Label>Microphone</Label>
                  <Select value={selectedAudio} onValueChange={setSelectedAudio}>
                    <SelectTrigger className="mt-1.5 bg-secondary/50">
                      <SelectValue placeholder="Select microphone" />
                    </SelectTrigger>
                    <SelectContent>
                      {devices.audio.map((d) => (
                        <SelectItem key={d.deviceId} value={d.deviceId}>
                          {d.label || `Microphone ${d.deviceId.slice(0, 6)}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {room?.isPasswordProtected && (
                <div>
                  <Label htmlFor="password">Room password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter room password"
                    className="mt-1.5 bg-secondary/50"
                  />
                </div>
              )}
            </div>
          </div>

          <Button
            onClick={handleJoin}
            disabled={joining || !displayName.trim()}
            className="w-full bg-brand-violet hover:bg-brand-violet/90 text-white gap-2 h-12 text-base"
          >
            {joining ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Join now
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
