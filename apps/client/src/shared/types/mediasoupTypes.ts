import { DtlsParameters, IceCandidate, IceParameters } from 'mediasoup-client/lib/types';

export type TransportInfo = {
  transportId: string;
  isProducer: boolean;
  iceParameters: IceParameters;
  iceCandidates: IceCandidate[];
  dtlsParameters: DtlsParameters;
};

export type ConnectTransportResponse = {
  connected: boolean;
  isProducer: boolean;
};
