'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Brain, CheckCircle2, AlertCircle, ArrowRight, Clock,
  Users, BarChart3, Download, Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Navbar } from '@/components/shared/Navbar';
import { apiClient } from '@/lib/axios';
import { toast } from 'sonner';

function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export default function MeetingSummaryPage() {
  const { id } = useParams();
  const [meeting, setMeeting] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const res = await apiClient.get(`/meetings/${id}`);
        setMeeting(res.data.data.meeting);
      } catch {
        toast.error('Meeting not found');
      } finally {
        setLoading(false);
      }
    };
    fetchMeeting();
  }, [id]);

  const generateSummary = async () => {
    setGenerating(true);
    try {
      const res = await apiClient.post('/ai/summary', { meetingId: id });
      setMeeting((prev) => ({
        ...prev,
        aiSummary: res.data.data.summary,
      }));
      toast.success('AI summary generated!');
    } catch {
      toast.error('Failed to generate summary');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-4xl mx-auto px-6 pt-24 pb-16">
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-4 w-48 mb-8" />
          <Skeleton className="h-48 w-full rounded-xl mb-4" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </main>
      </div>
    );
  }

  const hasSummary = meeting?.aiSummary?.overview?.length > 0;
  const healthScore = meeting?.aiSummary?.meetingHealthScore ?? null;
  const sentimentScore = meeting?.aiSummary?.sentimentScore ?? null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-brand-violet/10 text-brand-violet border-brand-violet/20">
                  Meeting Report
                </Badge>
              </div>
              <h1 className="text-3xl font-display font-bold mb-1">
                {meeting?.roomId?.title ?? 'Meeting Summary'}
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {meeting?.duration ? formatDuration(meeting.duration) : 'N/A'}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {meeting?.participants?.length ?? 0} participants
                </span>
                <span>{meeting?.createdAt ? new Date(meeting.createdAt).toLocaleDateString() : ''}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>

          {/* AI Summary */}
          {!hasSummary ? (
            <div className="glass rounded-xl p-8 text-center mb-6">
              <Brain className="w-12 h-12 text-brand-violet mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">No AI summary yet</h3>
              <p className="text-muted-foreground mb-4">
                Generate an AI-powered intelligence report for this meeting.
              </p>
              <Button
                onClick={generateSummary}
                disabled={generating || !meeting?.transcript?.length}
                className="bg-brand-violet hover:bg-brand-violet/90 text-white"
              >
                {generating ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                ) : (
                  <Brain className="w-4 h-4 mr-2" />
                )}
                {generating ? 'Generating with Claude...' : 'Generate AI Summary'}
              </Button>
              {!meeting?.transcript?.length && (
                <p className="text-xs text-muted-foreground mt-3">
                  Transcript required. AI transcription must be enabled during the meeting.
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4 mb-6">
              {/* Health score */}
              {healthScore !== null && (
                <div className="glass rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-brand-cyan" />
                      <span className="font-medium text-sm">Meeting Health Score</span>
                    </div>
                    <span className="text-2xl font-display font-bold text-gradient">{healthScore}/100</span>
                  </div>
                  <Progress value={healthScore} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Low productivity</span>
                    <span>Highly effective</span>
                  </div>
                </div>
              )}

              {/* Overview */}
              <div className="glass rounded-xl p-6">
                <h2 className="font-display font-semibold text-lg mb-3 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-brand-violet" />
                  AI Overview
                </h2>
                <p className="text-muted-foreground leading-relaxed">{meeting.aiSummary.overview}</p>
              </div>

              {/* Key Decisions */}
              {meeting.aiSummary.keyDecisions?.length > 0 && (
                <div className="glass rounded-xl p-6">
                  <h2 className="font-display font-semibold mb-3">✅ Key Decisions</h2>
                  <ul className="space-y-2">
                    {meeting.aiSummary.keyDecisions.map((d, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Items */}
              {meeting.actionItems?.length > 0 && (
                <div className="glass rounded-xl p-6">
                  <h2 className="font-display font-semibold mb-3">🎯 Action Items</h2>
                  <ul className="space-y-3">
                    {meeting.actionItems.map((item) => (
                      <li key={item._id} className="flex items-start gap-3 text-sm">
                        <ArrowRight className="w-4 h-4 text-brand-violet mt-0.5 shrink-0" />
                        <div>
                          <p>{item.text}</p>
                          {item.assignee && (
                            <p className="text-xs text-muted-foreground mt-0.5">→ {item.assignee}</p>
                          )}
                        </div>
                        <Badge variant="outline" className="ml-auto text-xs shrink-0">
                          {item.priority}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Blockers */}
              {meeting.aiSummary.blockers?.length > 0 && (
                <div className="glass rounded-xl p-6">
                  <h2 className="font-display font-semibold mb-3">🚧 Blockers</h2>
                  <ul className="space-y-2">
                    {meeting.aiSummary.blockers.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Transcript */}
          {meeting?.transcript?.length > 0 && (
            <div className="glass rounded-xl p-6">
              <h2 className="font-display font-semibold mb-4">📝 Transcript</h2>
              <ScrollArea className="h-64">
                <div className="space-y-3 pr-4">
                  {meeting.transcript.map((entry, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="text-xs text-muted-foreground w-16 shrink-0 font-mono pt-0.5">
                        {entry.timestamp
                          ? new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : '--:--'}
                      </div>
                      <div>
                        <span className="text-xs font-medium text-brand-cyan">{entry.speakerName ?? 'Unknown'}</span>
                        <p className="text-sm text-muted-foreground mt-0.5">{entry.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
