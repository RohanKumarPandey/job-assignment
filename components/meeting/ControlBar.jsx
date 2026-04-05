'use client';

import {
  Mic, MicOff, Video, VideoOff, Monitor, MonitorOff,
  PhoneOff, MessageSquare, Users, Brain, MoreHorizontal
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CONSTANTS } from '@/lib/constants';

function ControlButton({ icon: Icon, activeIcon: ActiveIcon, active, onClick, label, danger, highlight }) {
  const Ic = active && ActiveIcon ? ActiveIcon : Icon;
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            aria-label={label}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              danger
                ? 'bg-destructive hover:bg-destructive/80 text-white'
                : highlight
                ? 'bg-brand-violet hover:bg-brand-violet/80 text-white'
                : active
                ? 'bg-secondary/80 hover:bg-secondary text-foreground'
                : 'bg-secondary/40 hover:bg-secondary/70 text-foreground'
            }`}
          >
            <Ic className="w-5 h-5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top">{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function ControlBar({
  audioEnabled, videoEnabled, isScreenSharing, activePanel,
  onToggleAudio, onToggleVideo, onToggleScreen, onTogglePanel, onLeave,
  socket, roomId, userId
}) {
  const togglePanel = (panel) => {
    onTogglePanel((prev) => (prev === panel ? null : panel));
  };

  return (
    <div className="flex-none h-20 glass border-t border-border/50 flex items-center justify-center gap-3 px-6">
      {/* Media controls */}
      <ControlButton
        icon={Mic}
        activeIcon={MicOff}
        active={!audioEnabled}
        onClick={onToggleAudio}
        label={audioEnabled ? 'Mute microphone' : 'Unmute microphone'}
        danger={!audioEnabled}
      />
      <ControlButton
        icon={Video}
        activeIcon={VideoOff}
        active={!videoEnabled}
        onClick={onToggleVideo}
        label={videoEnabled ? 'Turn off camera' : 'Turn on camera'}
        danger={!videoEnabled}
      />
      <ControlButton
        icon={Monitor}
        activeIcon={MonitorOff}
        active={isScreenSharing}
        onClick={onToggleScreen}
        label={isScreenSharing ? 'Stop sharing' : 'Share screen'}
        highlight={isScreenSharing}
      />

      {/* Divider */}
      <div className="w-px h-8 bg-border/50" />

      {/* Panel toggles */}
      <ControlButton
        icon={MessageSquare}
        active={activePanel === 'chat'}
        onClick={() => togglePanel('chat')}
        label="Chat"
        highlight={activePanel === 'chat'}
      />
      <ControlButton
        icon={Users}
        active={activePanel === 'participants'}
        onClick={() => togglePanel('participants')}
        label="Participants"
        highlight={activePanel === 'participants'}
      />
      <ControlButton
        icon={Brain}
        active={activePanel === 'ai'}
        onClick={() => togglePanel('ai')}
        label="AI Assistant"
        highlight={activePanel === 'ai'}
      />

      {/* Divider */}
      <div className="w-px h-8 bg-border/50" />

      {/* Leave */}
      <ControlButton
        icon={PhoneOff}
        onClick={onLeave}
        label="Leave meeting"
        danger
      />
    </div>
  );
}
