'use client';

import { Message } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useSocket } from '@/contexts/socket-context/socket-context';

type ChannelProps = {
  cursor: string;
  messages: Message[];
  channelId: string;
  serverId: string;
};

function Channel({ cursor, messages, channelId, serverId }: ChannelProps) {
  const store = useRef({
    allMessages: [] as Message[],
    currentSlice: [] as Message[]
  }).current;
  const router = useRouter();
  const isMounted = useRef(false);
  const { socket } = useSocket();
  const channelKey = `chat:${channelId}:messages`;

  if (cursor) {
    store.currentSlice = messages;
  }

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on(channelKey, () => {
      router.refresh();
    });
  }, [socket]);

  const onSubmit = () => {
    const url = new URL(window.location.origin + '/api/messages');
    url.searchParams.set('channelId', channelId);
    url.searchParams.set('serverId', serverId);

    void fetch(url, {
      method: 'POST',
      body: JSON.stringify({ content: 'hello' })
    });
  };

  useEffect(() => {
    if (!isMounted.current && cursor) {
      isMounted.current = true;
      router.replace(window.location.pathname);
      return;
    }

    if (cursor) {
      store.allMessages = store.allMessages.concat(store.currentSlice);
      store.currentSlice = [];
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('cursor', cursor);

      router.push(newUrl.href);
    }
  }, [cursor]);
  console.log(new Set(store.allMessages.concat(messages).map((e) => e.id)));
  return (
    <div>
      {store.allMessages.concat(messages).map((m) => (
        <div key={m.id}>{m.content}</div>
      ))}
    </div>
  );
}

export default Channel;
