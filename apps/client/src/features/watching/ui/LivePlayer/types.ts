import { Socket } from 'socket.io-client';

export type Errors = {
  socketError: Error | null;
  consumerError: Error | null;
};

export type LivePlayerProps = Readonly<{
  mediaStream: MediaStream | null;
  socket: Socket | null;
  transportId: string | undefined;
  errors: Errors;
}>;

export type VideoQuality = 'auto' | '480p' | '720p' | '1080p';
