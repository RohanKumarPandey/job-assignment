'use client';

import { motion, AnimatePresence } from 'framer-motion';
import VideoTile from './VideoTile';

const getGridClass = (count) => {
  if (count === 1) return 'grid-1';
  if (count <= 2) return 'grid-2';
  if (count <= 4) return 'grid-2';
  if (count <= 9) return 'grid-3';
  return 'grid-4';
};

export function VideoGrid({ streams = [] }) {
  const count = streams.length;
  const gridClass = getGridClass(count);

  return (
    <div className={`grid ${gridClass} gap-2 h-full`} style={{ gridAutoRows: '1fr' }}>
      <AnimatePresence>
        {streams.map((item, index) => (
          <motion.div
            key={item.socketId || index}
            layout
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.88 }}
            transition={{ duration: 0.25 }}
            className="min-h-0"
          >
            <VideoTile
              stream={item.stream}
              user={item.user}
              isLocal={item.socketId === 'local'}
              isSpeaking={item.isSpeaking}
              audioEnabled={item.audioEnabled !== false}
              videoEnabled={item.videoEnabled !== false}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
