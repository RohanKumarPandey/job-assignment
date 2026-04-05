import { create } from 'zustand';

export const useMediaStore = create((set) => ({
  audioEnabled: true,
  videoEnabled: true,
  screenSharing: false,
  selectedAudioDeviceId: null,
  selectedVideoDeviceId: null,
  selectedOutputDeviceId: null,

  setAudio: (audioEnabled) => set({ audioEnabled }),
  setVideo: (videoEnabled) => set({ videoEnabled }),
  setScreenSharing: (screenSharing) => set({ screenSharing }),
  setSelectedAudioDevice: (id) => set({ selectedAudioDeviceId: id }),
  setSelectedVideoDevice: (id) => set({ selectedVideoDeviceId: id }),
  setSelectedOutputDevice: (id) => set({ selectedOutputDeviceId: id }),
}));
