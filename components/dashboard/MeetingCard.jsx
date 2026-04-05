'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Video, Clock, Users, ExternalLink, Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const STATUS_STYLES = {
  waiting: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
  active: 'bg-green-400/10 text-green-400 border-green-400/20',
  ended: 'bg-muted text-muted-foreground border-border',
};

function formatDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function MeetingCard({ room }) {
  const router = useRouter();
  const { roomId, title, status, createdAt, scheduledAt, settings } = room;

  const handleJoin = () => {
    router.push(`/room/${roomId}/lobby`);
  };

  return (
    <div className="glass rounded-xl p-5 flex flex-col gap-4 hover:border-border transition-all group">
      <div className="flex items-start justify-between">
        <div className="w-9 h-9 rounded-lg bg-brand-violet/10 flex items-center justify-center">
          <Video className="w-4 h-4 text-brand-violet" />
        </div>
        <Badge variant="outline" className={`text-[10px] ${STATUS_STYLES[status] ?? STATUS_STYLES.ended}`}>
          {status}
        </Badge>
      </div>
      <div>
        <h3 className="font-semibold truncate mb-1">{title}</h3>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDate(scheduledAt ?? createdAt)}
          </span>
          <span className="font-mono text-[10px] bg-secondary/50 px-1.5 py-0.5 rounded">{roomId}</span>
        </div>
      </div>
      <div className="flex gap-2 mt-auto">
        {status !== 'ended' ? (
          <Button
            size="sm"
            onClick={handleJoin}
            className="flex-1 bg-brand-violet hover:bg-brand-violet/90 text-white gap-1.5"
          >
            <Play className="w-3 h-3" />
            {status === 'active' ? 'Join' : 'Start'}
          </Button>
        ) : (
          <Link href={`/meeting/${room._id}/summary`} className="flex-1">
            <Button size="sm" variant="outline" className="w-full gap-1.5">
              <ExternalLink className="w-3 h-3" />
              View summary
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
