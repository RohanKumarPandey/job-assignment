'use client';

import { Mic, MicOff, Video, VideoOff, Crown, UserCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

function ParticipantRow({ participant }) {
  const { userId, role, mediaState } = participant;
  const name = userId?.name ?? 'Participant';
  const avatar = userId?.avatar;

  return (
    <div className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-secondary/30 transition-colors">
      <div className="relative">
        <Avatar className="w-9 h-9">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="text-sm bg-brand-violet/20 text-brand-violet">
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span
          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card bg-green-400"
          aria-label="Online"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{name}</p>
        {role !== 'participant' && (
          <Badge variant="outline" className="text-[10px] h-4 px-1 mt-0.5">
            {role === 'host' && <Crown className="w-2.5 h-2.5 mr-0.5" />}
            {role}
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-1.5">
        {mediaState?.audio ? (
          <Mic className="w-3.5 h-3.5 text-muted-foreground" />
        ) : (
          <MicOff className="w-3.5 h-3.5 text-destructive" />
        )}
        {mediaState?.video ? (
          <Video className="w-3.5 h-3.5 text-muted-foreground" />
        ) : (
          <VideoOff className="w-3.5 h-3.5 text-destructive" />
        )}
      </div>
    </div>
  );
}

export function ParticipantPanel({ participants = [] }) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border/50">
        <h2 className="font-display font-semibold">Participants</h2>
        <p className="text-xs text-muted-foreground mt-0.5">{participants.length} in this meeting</p>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {participants.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-muted-foreground">No other participants yet</p>
            </div>
          ) : (
            participants.map((p, i) => <ParticipantRow key={p._id ?? i} participant={p} />)
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
