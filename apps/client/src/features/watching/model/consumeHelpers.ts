import { MediaKind } from 'mediasoup-client/lib/RtpParameters';
import { Socket } from 'socket.io-client';
import { Transport } from 'mediasoup-client/lib/types';
import { TransportInfo } from '@/shared/types/mediasoupTypes';

type CreateConsumer = {
  consumerId: string;
  producerId: string;
  kind: MediaKind;
  rtpParameters: any;
};

type CreateConsumerResponse = {
  consumers: CreateConsumer[];
};

export const createConsumer = async (
  socket: Socket,
  roomId: string,
  transport: Transport,
  transportInfo: TransportInfo,
) => {
  const mediaStream = new MediaStream();
  socket.emit(
    'createConsumer',
    {
      roomId,
      transportId: transportInfo.transportId,
    },
    async ({ consumers }: CreateConsumerResponse) => {
      await Promise.all(
        consumers.map(async consumerData => {
          const consumer = await transport.consume({
            id: consumerData.consumerId,
            producerId: consumerData.producerId,
            rtpParameters: consumerData.rtpParameters,
            kind: consumerData.kind,
          });

          if (consumer.track.kind === 'video') {
            consumer.track.enabled = true;
          }
          mediaStream.addTrack(consumer.track);
          consumer.resume();
        }),
      );
    },
  );

  return mediaStream;
};
