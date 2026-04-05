export const ICE_SERVERS = {
  iceServers: [
    {
      urls: process.env.NEXT_PUBLIC_STUN_SERVER_URL ?? 'stun:stun.l.google.com:19302',
    },
    ...(process.env.NEXT_PUBLIC_TURN_SERVER_URL
      ? [
          {
            urls: process.env.NEXT_PUBLIC_TURN_SERVER_URL,
            username: process.env.NEXT_PUBLIC_TURN_SERVER_USERNAME ?? '',
            credential: process.env.NEXT_PUBLIC_TURN_SERVER_CREDENTIAL ?? '',
          },
        ]
      : []),
  ],
  iceCandidatePoolSize: 10,
};
