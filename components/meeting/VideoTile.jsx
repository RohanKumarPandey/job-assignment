'use client';

import { useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function VideoTile({ stream, user, isLocal, isSpeaking, audioEnabled, videoEnabled }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const initials = user?.name?.charAt(0)?.toUpperCase() ?? '?';

  return (
    <div
      className={`video-tile w-full h-full relative rounded-xl overflow-hidden bg-brand-navy transition-all ${
        isSpeaking ? 'speaking-ring' : ''
      }`}
    >
      {videoEnabled && stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className={`w-full h-full object-cover ${isLocal ? 'scale-x-[-1]' : ''}`}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-brand-navy-light">
          <Avatar className="w-16 h-16">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-brand-violet to-brand-cyan text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
      )}

      {/* Name badge */}
      <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
        <div className="glass rounded-md px-2 py-1 flex items-center gap-1.5 text-xs text-white">
          {audioEnabled ? (
            <Mic className="w-3 h-3 text-white/60" />
          ) : (
            <MicOff className="w-3 h-3 text-destructive" />
          )}
          <span>{isLocal ? `${user?.name ?? 'You'} (You)` : user?.name ?? 'Participant'}</span>
        </div>
      </div>

      {/* Speaking indicator */}
      {isSpeaking && (
        <div className="absolute inset-0 rounded-xl pointer-events-none ring-2 ring-brand-cyan animate-pulse-ring" />
      )}
    </div>
  );
}
