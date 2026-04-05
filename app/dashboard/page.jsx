'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Video, Clock, Users, BarChart3, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MeetingCard } from '@/components/dashboard/MeetingCard';
import { HistoryTable } from '@/components/dashboard/HistoryTable';
import { ScheduleModal } from '@/components/dashboard/ScheduleModal';
import { Navbar } from '@/components/shared/Navbar';
import { apiClient } from '@/lib/axios';

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [stats, setStats] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  useEffect(() => {
    if (!isLoaded || !user) return;
    const fetchData = async () => {
      try {
        const [statsRes, roomsRes, historyRes] = await Promise.allSettled([
          apiClient.get('/rooms/stats'),
          apiClient.get('/rooms/my?limit=6'),
          apiClient.get('/meetings/history?limit=5'),
        ]);

        if (statsRes.status === 'fulfilled') setStats(statsRes.value.data.data.stats);
        if (roomsRes.status === 'fulfilled') setRooms(roomsRes.value.data.data ?? []);
        if (historyRes.status === 'fulfilled') setHistory(historyRes.value.data.data ?? []);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isLoaded, user]);

  const statCards = [
    {
      label: 'Total Meetings',
      value: stats?.find((s) => s.status === 'ended')?.count ?? 0,
      icon: Video,
      color: 'text-brand-violet',
    },
    {
      label: 'Active Now',
      value: stats?.find((s) => s.status === 'active')?.count ?? 0,
      icon: Zap,
      color: 'text-green-400',
    },
    {
      label: 'Avg. Participants',
      value: stats?.find((s) => s.status === 'ended')?.avgParticipants ?? 0,
      icon: Users,
      color: 'text-brand-cyan',
    },
    {
      label: 'Hours Collaborated',
      value: Math.round((stats?.find((s) => s.status === 'ended')?.totalParticipants ?? 0) * 0.5),
      icon: Clock,
      color: 'text-yellow-400',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold mb-1">
              Welcome back, {isLoaded ? user?.firstName ?? 'there' : '...'}
            </h1>
            <p className="text-muted-foreground">Your collaboration hub</p>
          </div>
          <Button
            onClick={() => setScheduleOpen(true)}
            className="bg-brand-violet hover:bg-brand-violet/90 text-white gap-2 shadow-lg shadow-brand-violet/20"
          >
            <Plus className="w-4 h-4" />
            New Meeting
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                className="glass rounded-xl p-5"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                {loading ? (
                  <Skeleton className="h-14 w-full rounded" />
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-muted-foreground">{card.label}</span>
                      <Icon className={`w-4 h-4 ${card.color}`} />
                    </div>
                    <div className="text-3xl font-display font-bold">{card.value}</div>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Tabs: My Rooms / History */}
        <Tabs defaultValue="rooms">
          <TabsList className="mb-6 bg-muted/50">
            <TabsTrigger value="rooms">My Rooms</TabsTrigger>
            <TabsTrigger value="history">Meeting History</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="rooms">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-40 rounded-xl" />
                ))}
              </div>
            ) : rooms.length === 0 ? (
              <div className="text-center py-16">
                <Video className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">No rooms yet</h3>
                <p className="text-muted-foreground mb-4">Create your first meeting to get started.</p>
                <Button onClick={() => setScheduleOpen(true)} className="bg-brand-violet text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Meeting
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rooms.map((room) => (
                  <MeetingCard key={room._id} room={room} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            <HistoryTable meetings={history} loading={loading} />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="glass rounded-xl p-8 text-center">
              <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Meeting Analytics</h3>
              <p className="text-muted-foreground">
                Run a meeting with AI transcription enabled to see sentiment analysis, engagement metrics,
                and productivity scores here.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <ScheduleModal open={scheduleOpen} onClose={() => setScheduleOpen(false)} />
    </div>
  );
}
