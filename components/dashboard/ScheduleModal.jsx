'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CalendarDays, Clock, Users, Lock } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { apiClient } from '@/lib/axios';
import { toast } from 'sonner';

const scheduleSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(1000).optional(),
  scheduledAt: z.string().optional(),
  maxParticipants: z.number().min(2).max(500).default(50),
  password: z.string().optional(),
  isPasswordProtected: z.boolean().default(false),
});

export function ScheduleModal({ open, onClose }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(scheduleSchema),
    defaultValues: { maxParticipants: 50, isPasswordProtected: false },
  });

  const isPasswordProtected = watch('isPasswordProtected');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await apiClient.post('/rooms', {
        title: data.title,
        description: data.description,
        scheduledAt: data.scheduledAt || undefined,
        maxParticipants: data.maxParticipants,
        password: data.isPasswordProtected ? data.password : undefined,
      });
      const { roomId } = res.data.data.room;
      toast.success('Meeting created!');
      reset();
      onClose();
      router.push(`/room/${roomId}/lobby`);
    } catch (err) {
      toast.error(err.response?.data?.error?.message ?? 'Failed to create meeting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">New Meeting</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div>
            <Label htmlFor="title">Meeting title *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Weekly team standup"
              className="mt-1.5 bg-secondary/50"
            />
            {errors.title && <p className="text-xs text-destructive mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              {...register('description')}
              placeholder="What's this meeting about?"
              className="mt-1.5 bg-secondary/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="scheduledAt" className="flex items-center gap-1.5 text-sm">
                <CalendarDays className="w-3.5 h-3.5" />
                Schedule for
              </Label>
              <Input
                id="scheduledAt"
                type="datetime-local"
                {...register('scheduledAt')}
                className="mt-1.5 bg-secondary/50"
              />
            </div>
            <div>
              <Label htmlFor="maxParticipants" className="flex items-center gap-1.5 text-sm">
                <Users className="w-3.5 h-3.5" />
                Max participants
              </Label>
              <Input
                id="maxParticipants"
                type="number"
                min={2}
                max={500}
                {...register('maxParticipants', { valueAsNumber: true })}
                className="mt-1.5 bg-secondary/50"
              />
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-muted-foreground" />
              <Label htmlFor="password-toggle" className="cursor-pointer">Password protected</Label>
            </div>
            <Switch
              id="password-toggle"
              checked={isPasswordProtected}
              onCheckedChange={(v) => setValue('isPasswordProtected', v)}
            />
          </div>

          {isPasswordProtected && (
            <div>
              <Label htmlFor="password">Room password</Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                placeholder="Enter a password"
                className="mt-1.5 bg-secondary/50"
              />
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-brand-violet hover:bg-brand-violet/90 text-white"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Create & join'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
