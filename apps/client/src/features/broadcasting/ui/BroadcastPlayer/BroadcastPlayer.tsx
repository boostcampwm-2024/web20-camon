import { useEffect, useRef } from 'react';
import { RESOLUTION_OPTIONS } from './resolutionOptions';
import { Tracks } from '../../../../features/broadcasting/model/trackTypes';

type BroadcastPlayerProps = Readonly<{
  mediaStream: MediaStream | null;
  screenStream: MediaStream | null;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  isStreamReady: boolean;
  setIsStreamReady: (ready: boolean) => void;
  tracksRef: React.MutableRefObject<Tracks>;
}>;

export function BroadcastPlayer({
  mediaStream,
  screenStream,
  isVideoEnabled,
  isScreenSharing,
  isStreamReady,
  setIsStreamReady,
  tracksRef,
}: BroadcastPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenShareRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  // 비디오 스트림 설정
  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
    }
  }, [isVideoEnabled, mediaStream]);

  // 화면 공유 스트림 설정
  useEffect(() => {
    if (screenShareRef.current && screenStream) {
      screenShareRef.current.srcObject = screenStream;
    }
  }, [isScreenSharing, screenStream]);

  useEffect(() => {
    tracksRef.current.mediaAudio = mediaStream?.getAudioTracks()[0];
  }, [mediaStream, tracksRef]);

  useEffect(() => {
    tracksRef.current.screenAudio = screenStream?.getAudioTracks()[0];
  }, [screenStream, tracksRef]);

  // 미디어스트림 캔버스에 넣기
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    canvas.width = RESOLUTION_OPTIONS.high.width;
    canvas.height = RESOLUTION_OPTIONS.high.height;

    const context = canvas.getContext('2d');
    if (!context) return undefined;

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';

    const draw = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      if (isScreenSharing && screenShareRef.current) {
        const screenVideo = screenShareRef.current;

        const screenRatio = screenVideo.videoWidth / screenVideo.videoHeight;
        const canvasRatio = canvas.width / canvas.height;
        const drawInfo = { width: canvas.width, height: canvas.height, x: 0, y: 0 };

        if (screenRatio > canvasRatio) {
          // 화면이 더 넓은 경우
          drawInfo.height = canvas.width / screenRatio;
          drawInfo.y = (canvas.height - drawInfo.height) / 2;
        } else {
          // 화면이 더 좁은 경우
          drawInfo.width = canvas.height * screenRatio;
          drawInfo.x = (canvas.width - drawInfo.width) / 2;
        }

        context.fillStyle = '#000000';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(screenVideo, drawInfo.x, drawInfo.y, drawInfo.width, drawInfo.height);

        if (isVideoEnabled && videoRef.current) {
          const pipWidth = canvas.width / 4;
          const pipHeight = canvas.height / 4;
          const pipX = canvas.width - pipWidth;
          const pipY = canvas.height - pipHeight;
          context.drawImage(videoRef.current, pipX, pipY, pipWidth, pipHeight);
        }
      }
      animationFrameRef.current = requestAnimationFrame(draw);
    };

    const startDrawing = async () => {
      draw();
      const [captureVideo] = canvas.captureStream(30).getVideoTracks();
      tracksRef.current.video = captureVideo;
      videoRef.current?.play();
      screenShareRef.current?.play();
      if (!isStreamReady) setIsStreamReady(true);
    };

    if (isVideoEnabled && isScreenSharing && mediaStream && screenStream) {
      startDrawing();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isVideoEnabled, isScreenSharing, mediaStream, screenStream, isStreamReady, setIsStreamReady, tracksRef]);

  return (
    <div className="relative w-full max-h-[310px] aspect-video">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className={`absolute top-0 left-0 w-full h-full bg-black ${isVideoEnabled ? '' : 'hidden'}`}
      />
      <video
        ref={screenShareRef}
        autoPlay
        muted
        playsInline
        className={`absolute top-0 left-0 w-full h-full bg-black ${isScreenSharing ? '' : 'hidden'}`}
      />
      <canvas
        ref={canvasRef}
        width={RESOLUTION_OPTIONS.high.width}
        height={RESOLUTION_OPTIONS.high.height}
        className={`absolute top-0 left-0 w-full h-full bg-black object-cover ${
          !isScreenSharing || !isVideoEnabled ? 'hidden' : ''
        }`}
      />
    </div>
  );
}
