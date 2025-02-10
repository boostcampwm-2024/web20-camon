import * as mediasoupClient from 'mediasoup-client';
import { RtpCapabilities } from 'mediasoup-client/lib/RtpParameters';
import { Socket } from 'socket.io-client';
import { TransportInfo } from '../types/mediasoupTypes';

type ConnectTransportResponse = {
  connected: boolean;
  isProducer: boolean;
};

export const getRtpCapabilities = async (socket: Socket, roomId: string): Promise<RtpCapabilities> =>
  new Promise((resolve, reject) => {
    socket.emit('getRtpCapabilities', { roomId }, (response: { rtpCapabilities: RtpCapabilities }) => {
      if (response.rtpCapabilities) {
        resolve(response.rtpCapabilities);
      } else {
        reject(new Error('getRtpCapabilities Error: RTP Capabilities를 받아오지 못했습니다.'));
      }
    });
  });

export const createDevice = async (rtpCapabilities: RtpCapabilities) => {
  const newDevice = new mediasoupClient.Device();
  await newDevice.load({
    routerRtpCapabilities: rtpCapabilities,
  });
  return newDevice;
};

export const connectTransport = async (
  socket: Socket,
  device: mediasoupClient.Device,
  roomId: string,
  isProducer: boolean,
) => {
  const transportInfo: TransportInfo = await new Promise(resolve => {
    socket.emit('createTransport', { roomId, isProducer }, (response: TransportInfo) => {
      resolve(response);
    });
  });

  const transport = isProducer
    ? device.createSendTransport({
        id: transportInfo.transportId,
        iceParameters: transportInfo.iceParameters,
        iceCandidates: transportInfo.iceCandidates,
        dtlsParameters: transportInfo.dtlsParameters,
      })
    : device.createRecvTransport({
        id: transportInfo.transportId,
        iceParameters: transportInfo.iceParameters,
        iceCandidates: transportInfo.iceCandidates,
        dtlsParameters: transportInfo.dtlsParameters,
      });

  transport.on('connect', async ({ dtlsParameters }, callback) => {
    socket.emit(
      'connectTransport',
      {
        roomId,
        dtlsParameters,
        transportId: transportInfo.transportId,
      },
      (response: ConnectTransportResponse) => {
        if (response.connected) {
          callback();
        }
      },
    );
  });

  return { transport, transportInfo };
};
