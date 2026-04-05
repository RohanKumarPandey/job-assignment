'use client';

import Link from 'next/link';
import { Clock, Users, Brain, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

function formatDuration(seconds) {
  if (!seconds) return 'N/A';
  const m = Math.floor(seconds / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}m`;
  return `${m}m`;
}

export function HistoryTable({ meetings = [], loading }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
    );
  }

  if (meetings.length === 0) {
    return (
      <div className="glass rounded-xl p-12 text-center">
        <Clock className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
        <h3 className="font-semibold mb-1">No meeting history yet</h3>
        <p className="text-sm text-muted-foreground">Your past meetings will appear here.</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 text-muted-foreground text-xs">
            <th className="text-left p-4 font-medium">Meeting</th>
            <th className="text-left p-4 font-medium hidden md:table-cell">Date</th>
            <th className="text-left p-4 font-medium hidden sm:table-cell">Duration</th>
            <th className="text-left p-4 font-medium hidden lg:table-cell">Participants</th>
            <th className="text-left p-4 font-medium">AI Summary</th>
            <th className="w-8 p-4" />
          </tr>
        </thead>
        <tbody className="divide-y divide-border/30">
          {meetings.map((meeting) => (
            <tr key={meeting._id} className="hover:bg-secondary/20 transition-colors">
              <td className="p-4">
                <div className="font-medium truncate max-w-[200px]">
                  {meeting.room?.title ?? 'Untitled Meeting'}
                </div>
                <div className="text-xs text-muted-foreground font-mono">{meeting.room?.roomId ?? ''}</div>
              </td>
              <td className="p-4 hidden md:table-cell text-muted-foreground">
                {meeting.createdAt ? new Date(meeting.createdAt).toLocaleDateString() : 'N/A'}
              </td>
              <td className="p-4 hidden sm:table-cell text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDuration(meeting.computedDuration)}
                </span>
              </td>
              <td className="p-4 hidden lg:table-cell text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {meeting.participantCount ?? 0}
                </span>
              </td>
              <td className="p-4">
                {meeting.hasSummary ? (
                  <Badge className="bg-brand-violet/10 text-brand-violet border-brand-violet/20 text-[10px]">
                    <Brain className="w-2.5 h-2.5 mr-1" />
                    Available
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px] text-muted-foreground">
                    None
                  </Badge>
                )}
              </td>
              <td className="p-4">
                <Link href={`/meeting/${meeting._id}/summary`}>
                  <button className="text-muted-foreground hover:text-foreground transition-colors" aria-label="View meeting">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
