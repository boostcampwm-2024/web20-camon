import { useRef, useState } from 'react';

export const useScreenShare = () => {
  const screenStreamRef = useRef<MediaStream | null>(null);
  const [screenShareError, setScreenShareError] = useState<Error | null>(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const endScreenShare = () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
    }
    screenStreamRef.current = null;
    setIsScreenSharing(false);
  };

  const startScreenShare = async () => {
    try {
      const options = {
        video: true,
        audio: true,
      };

      const mediaStream = await navigator.mediaDevices.getDisplayMedia(options);
      mediaStream.getVideoTracks()[0].onended = endScreenShare;
      screenStreamRef.current = mediaStream;
      setIsScreenSharing(true);
    } catch (err) {
      if (err instanceof Error) {
        if (err.name !== 'NotAllowedError') {
          setScreenShareError(err);
        }
      } else {
        setScreenShareError(new Error('화면 공유 실패'));
      }
    }
  };

  const toggleScreenShare = () => {
    if (isScreenSharing) {
      endScreenShare();
    } else {
      startScreenShare();
    }
  };

  return {
    screenStream: screenStreamRef.current,
    isScreenSharing,
    screenShareError,
    toggleScreenShare,
  };
};
