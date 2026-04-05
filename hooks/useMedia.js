'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { useMediaStore } from '@/store/mediaStore';

/**
 * useMedia — manages getUserMedia, device enumeration, track toggle.
 */
export function useMedia({ audioDeviceId, videoDeviceId } = {}) {
  const streamRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const { audioEnabled, videoEnabled, setAudio, setVideo } = useMediaStore();

  useEffect(() => {
    const initStream = async () => {
      try {
        const constraints = {
          audio: audioDeviceId ? { deviceId: { exact: audioDeviceId } } : true,
          video: videoDeviceId ? { deviceId: { exact: videoDeviceId }, width: 1280, height: 720 } : { width: 1280, height: 720 },
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;
        setLocalStream(stream);
      } catch (err) {
        toast.error('Camera/microphone access denied. Check your browser permissions.');
      }
    };
    initStream();

    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [audioDeviceId, videoDeviceId]);

  const toggleAudio = useCallback(() => {
    const stream = streamRef.current;
    if (!stream) return;
    const tracks = stream.getAudioTracks();
    const next = !audioEnabled;
    tracks.forEach((t) => { t.enabled = next; });
    setAudio(next);
  }, [audioEnabled, setAudio]);

  const toggleVideo = useCallback(() => {
    const stream = streamRef.current;
    if (!stream) return;
    const tracks = stream.getVideoTracks();
    const next = !videoEnabled;
    tracks.forEach((t) => { t.enabled = next; });
    setVideo(next);
  }, [videoEnabled, setVideo]);

  const replaceVideoTrack = useCallback(async (deviceId) => {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: deviceId } },
      });
      const [newTrack] = newStream.getVideoTracks();
      const oldTrack = streamRef.current?.getVideoTracks()[0];
      if (oldTrack) {
        streamRef.current.removeTrack(oldTrack);
        oldTrack.stop();
      }
      streamRef.current?.addTrack(newTrack);
    } catch {
      toast.error('Failed to switch camera');
    }
  }, []);

  return {
    localStream,
    audioEnabled,
    videoEnabled,
    toggleAudio,
    toggleVideo,
    replaceVideoTrack,
  };
}
