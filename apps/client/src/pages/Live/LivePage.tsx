import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ErrorCharacter } from '@/shared/ui';
import { ChatContainer } from '@/features/chatting';
import { useConsume, LivePlayer, LiveCamperInfo } from '@/features/watching';
import { useSocket } from '@/shared/lib';

const socketUrl = import.meta.env.VITE_MEDIASERVER_URL;

export function LivePage() {
  const { liveId } = useParams<{ liveId: string }>();
  const { socket, socketError } = useSocket(socketUrl);
  const {
    transport,
    transportId,
    mediastream: mediaStream,
    error: consumerError,
  } = useConsume({
    socket,
    roomId: liveId,
  });

  useEffect(() => {
    if (!socket || !liveId || !transport) return undefined;

    const handleLeaveLive = () => {
      if (socket && liveId && transportId) {
        socket.emit('leaveBroadcast', { transportId, roomId: liveId });
      }

      socket?.disconnect();
      transport?.close();
    };

    const preventClose = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      handleLeaveLive();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', preventClose);

    return () => {
      handleLeaveLive();
      window.removeEventListener('beforeunload', preventClose);
    };
  }, [socket, liveId, transportId, transport]);

  return (
    <div className="flex flex-row w-full h-full gap-10 pb-5">
      {!liveId ? (
        <ErrorCharacter size={400} message="방 정보가 없습니다." />
      ) : (
        <>
          <div className="flex flex-col flex-1 gap-4 ml-8">
            <LivePlayer
              mediaStream={mediaStream}
              transportId={transportId}
              socket={socket}
              errors={{ socketError, consumerError }}
            />
            <div className="flex justify-center items-center h-36 w-full">
              <LiveCamperInfo liveId={liveId} />
            </div>
          </div>
          <div className="flex h-full w-80 pr-5">
            <ChatContainer roomId={liveId} isProducer={false} />
          </div>
        </>
      )}
    </div>
  );
}
