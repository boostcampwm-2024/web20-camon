import { Socket } from 'socket.io-client';
import { Transport } from 'mediasoup-client/lib/types';
import { TransportInfo } from '@/shared/types/mediasoupTypes';
import { ENCODING_OPTIONS } from './encodingOptions';

export const getRoomId = (socket: Socket): Promise<string> =>
  new Promise(resolve => {
    socket.emit('createRoom', (response: { roomId: string }) => {
      resolve(response.roomId);
    });
  });

export const createProducer = async (
  socket: Socket,
  roomId: string,
  transport: Transport,
  transportInfo: TransportInfo,
  mediaStream: MediaStream,
) => {
  const handleProduce = (parameters: any, callback: any) => {
    socket.emit(
      'createProducer',
      {
        roomId,
        transportId: transportInfo.transportId,
        kind: parameters.kind,
        rtpParameters: parameters.rtpParameters,
      },
      (response: { producerId: string }) => {
        callback({ id: response.producerId });
      },
    );
  };

  transport.on('produce', handleProduce);

  const producers = new Map();

  try {
    await Promise.all(
      mediaStream.getTracks().map(async track => {
        const producerConfig: Record<string, unknown> = {
          track,
          stopTracks: false,
        };

        if (track.kind === 'video') {
          producerConfig.encodings = ENCODING_OPTIONS;
          producerConfig.codecOptions = {
            videoGoogleStartBitrate: 1000,
          };
        }

        const producer = await transport.produce(producerConfig);
        producers.set(track.kind, producer);
      }),
    );

    return producers;
  } finally {
    transport.off('produce', handleProduce);
  }
};
