import { Transport } from 'mediasoup-client/lib/types';
import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import { connectTransport, createDevice, getRtpCapabilities } from '@/shared/lib';
import { createConsumer } from './consumeHelpers';

type UseConsumerProps = {
  socket: Socket | null;
  roomId: string | undefined;
};

export const useConsume = ({ socket, roomId }: UseConsumerProps) => {
  const transportRef = useRef<Transport | null>(null);
  const transportIdRef = useRef<string | undefined>(undefined);
  const mediastreamRef = useRef<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!socket || !roomId) return undefined;

    const initializeConsumer = async () => {
      try {
        const rtpCapabilities = await getRtpCapabilities(socket, roomId);
        if (!rtpCapabilities) {
          setError(new Error('rtpCapabilities가 없습니다.'));
          return;
        }

        const device = await createDevice(rtpCapabilities);
        if (!device) {
          setError(new Error('device가 없습니다.'));
          return;
        }

        const { transport: newTransport, transportInfo } = await connectTransport(socket, device, roomId, false);
        if (!newTransport || !transportInfo) {
          setError(new Error('transport 연결에 문제가 발생했습니다.'));
          return;
        }
        transportRef.current = newTransport;
        transportIdRef.current = transportInfo.transportId;

        const newMediastream = await createConsumer(socket, roomId, newTransport, transportInfo);
        mediastreamRef.current = newMediastream;
      } finally {
        setIsLoading(false);
      }
    };

    initializeConsumer();

    return () => {
      transportRef.current?.close();
      mediastreamRef.current?.getTracks().map(track => track.stop());
    };
  }, [socket, roomId]);

  return {
    transport: transportRef.current,
    transportId: transportIdRef.current,
    mediastream: mediastreamRef.current,
    error,
    isLoading,
  };
};
