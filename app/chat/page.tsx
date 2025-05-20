"use client";

import { Channel as ChannelType } from "stream-chat";
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  Window,
  ChannelList,
  ChannelPreviewUIComponentProps,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { userAtom } from "@/atoms/user/atom";
import { chatMemberAtom } from "@/atoms/chat/atom";

import Image from "next/image";
import { useChatClient } from "@/hooks/chat/useChatClient";
import Loader from "@/components/Loader";

export default function ChatPage() {
  const [userData] = useAtom(userAtom);
  const [chatMember] = useAtom(chatMemberAtom);
  const [channel, setChannel] = useState<ChannelType | null>(null);
  const STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;

  if (!STREAM_API_KEY) {
    throw new Error("STREAM_API_KEY is not defined");
  }

  const { chatClient } = useChatClient(STREAM_API_KEY);

  useEffect(() => {
    if (!chatClient || !chatMember?.memberId) return;

    const openDirectMessage = async () => {
      const userId = userData.userId.toString();
      const otherId = chatMember.memberId.toString();
      const members = [userId, otherId];

      try {
        const existingChannels = await chatClient.queryChannels(
          { type: "messaging", members: { $eq: members } },
          { last_message_at: -1 },
          { limit: 1 }
        );

        let dm: ChannelType;
        if (existingChannels.length > 0) {
          dm = existingChannels[0];
        } else {
          dm = chatClient.channel("messaging", {
            members,
          });
        }

        await dm.watch();
        setChannel(dm);
      } catch (err) {
        console.error("Could not open DM channel:", err);
      }
    };

    openDirectMessage();
  }, [chatClient, chatMember, userData.userId]);

  const CustomChannelPreview = (props: ChannelPreviewUIComponentProps) => {
    const {
      channel,
      displayImage,
      displayTitle,
      latestMessagePreview,
      channelUpdateCount,
    } = props;

    const handleChannelClick = async () => {
      try {
        await channel.watch();
        setChannel(channel);
      } catch (error) {
        console.error("Error selecting channel:", error);
      }
    };

    const formattedTime = channel.state.last_message_at
      ? new Date(channel.state.last_message_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

    const renderAvatar = () => {
      if (displayImage) {
        return (
          <Image
            className="w-12 h-12 rounded-full"
            src={displayImage}
            alt="Channel Avatar"
            width={48}
            height={48}
          />
        );
      } else {
        const initial = displayTitle?.charAt(0).toUpperCase() || "C";
        return (
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500 text-white text-lg font-bold">
            {initial}
          </div>
        );
      }
    };

    return (
      <div
        onClick={handleChannelClick}
        className="flex items-center p-3 hover:bg-gray-100 rounded-md cursor-pointer transition-all duration-150"
      >
        {renderAvatar()}
        <div className="flex-1 ml-3">
          <div className="flex justify-between items-center">
            <strong className="text-gray-800 truncate">{displayTitle}</strong>
            <span className="text-xs text-gray-500">{formattedTime}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 truncate max-w-xs">
              {latestMessagePreview || "No messages yet"}
            </span>
            {(channelUpdateCount ?? 0) > 0 && (
              <span className="ml-2 text-xs text-white bg-red-500 rounded-full px-2">
                {channelUpdateCount}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (!chatClient) return <Loader />;

  return (
    <div className="flex flex-col items-center justify-center w-full h-[80vh] pt-10">
      <Chat client={chatClient} theme="messaging light">
        <div className="flex h-full w-full">
          <div className="w-1/4 h-full border-r border-gray-300">
            <ChannelList
              filters={{
                members: { $in: [userData?.userId?.toString() || ""] },
              }}
              sort={{ last_message_at: -1 }}
              options={{ limit: 10 }}
              Preview={CustomChannelPreview}
            />
          </div>

          <div className="w-3/4 h-full">
            {channel ? (
              <Channel channel={channel}>
                <Window>
                  <ChannelHeader />
                  <MessageList />
                  <MessageInput />
                </Window>
                <Thread />
              </Channel>
            ) : (
              <div className="p-4 text-gray-500">
                Select a chatroom to start chatting
              </div>
            )}
          </div>
        </div>
      </Chat>
    </div>
  );
}
