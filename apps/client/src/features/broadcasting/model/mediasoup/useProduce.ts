import { Socket } from 'socket.io-client';
import { useEffect, useRef, useState } from 'react';
import { Producer, Transport } from 'mediasoup-client/lib/types';
import { createProducer, getRoomId } from './produceHelpers';
import { connectTransport, createDevice, getRtpCapabilities } from '@/shared/lib';

type UseProduceProps = {
  socket: Socket | null;
  mediaStream: MediaStream | null;
};

type UseProduceReturn = {
  producers: Map<string, Producer>;
  error: Error | null;
  roomId: string;
  transport: Transport | null;
};

export const useProduce = ({ socket, mediaStream }: UseProduceProps): UseProduceReturn => {
  const [error, setError] = useState<Error | null>(null);
  const [roomId, setRoomId] = useState<string>('');
  const producersRef = useRef<Map<string, Producer>>(new Map());
  const transportRef = useRef<Transport | null>(null);

  useEffect(() => {
    if (!socket || !mediaStream) return undefined;
    const initializeProducer = async () => {
      const newRoomId = await getRoomId(socket);
      if (!newRoomId) {
        setError(new Error('roomId가 없습니다.'));
        return;
      }
      setRoomId(newRoomId);

      const rtpCapabilities = await getRtpCapabilities(socket, newRoomId);
      if (!rtpCapabilities) {
        setError(new Error('rtpCapabilities가 없습니다.'));
        return;
      }

      const device = await createDevice(rtpCapabilities);
      if (!device) {
        setError(new Error('device가 없습니다.'));
        return;
      }

      const { transport: newTransport, transportInfo } = await connectTransport(socket, device, newRoomId, true);
      if (!newTransport || !transportInfo) {
        setError(new Error('transport 연결에 문제가 발생했습니다.'));
        return;
      }
      transportRef.current = newTransport;

      const newProducers = await createProducer(socket, newRoomId, newTransport, transportInfo, mediaStream);
      producersRef.current = newProducers;
    };

    initializeProducer();

    return () => {
      producersRef.current.forEach(producer => producer.close());
      if (transportRef.current) {
        transportRef.current.close();
      }
    };
  }, [socket, mediaStream]);

  return {
    roomId,
    transport: transportRef.current,
    producers: producersRef.current,
    error,
  };
};
