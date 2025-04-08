"use client";

import { useEffect, useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";

import "@livekit/components-styles";

import { Loader2 } from "lucide-react";

import { useSession } from "@workspace/auth";

type MediaRoomType = {
  chatId: string;
  video: boolean;
  audio: boolean;
};

export const MediaRoom: React.FC<MediaRoomType> = ({
  video,
  audio,
  chatId,
}) => {
  const { data: session } = useSession();
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!session?.user.name) return;

    (async () => {
      try {
        const response = await fetch(
          `/next-api/livekit?room=${chatId}&username=${session.user.name}`,
        );
        const data = await response.json();

        setToken(data.token);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [session, chatId]);

  if (token === "") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <Loader2 className="my-4 size-7 animate-spin text-zinc-500" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      data-lk-theme="default"
      serverUrl="wss://discord-clone-050a26ch.livekit.cloud"
      token={token}
      connect={true}
      video={video}
      audio={audio}
    >
      <VideoConference />
    </LiveKitRoom>
  );
};
