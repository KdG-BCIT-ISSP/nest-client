"use client";

import { StreamChat, Channel as ChannelType } from "stream-chat";
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
import { useEffect, useState, useRef } from "react";
import { useAtom } from "jotai";
import { userAtom } from "@/atoms/user/atom";
import { chatMemberAtom } from "@/atoms/chat/atom";
import Image from "next/image";

export default function ChatPage() {
  const [userData] = useAtom(userAtom);
  const [chatMember] = useAtom(chatMemberAtom);
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [channel, setChannel] = useState<ChannelType | null>(null);
  const clientRef = useRef<StreamChat | null>(null);
  const STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;

  if (!STREAM_API_KEY) {
    throw new Error("STREAM_API_KEY is not defined");
  }

  useEffect(() => {
    const init = async () => {
      try {
        if (!userData?.userId || !userData?.username) {
          console.error("User data is missing or incomplete");
          return;
        }

        const currentUser = {
          id: userData.userId.toString(),
          name: userData.username,
        };

        const client = StreamChat.getInstance(STREAM_API_KEY);
        const currentUserToken = client.devToken(currentUser.id);

        await client.connectUser(currentUser, currentUserToken);

        if (chatMember?.memberId) {
          const channelId = [currentUser.id, chatMember.memberId.toString()]
            .sort()
            .join("-");
          const channel = client.channel("messaging", channelId, {
            members: [currentUser.id, chatMember.memberId.toString()],
          });

          await channel.watch();
          setChannel(channel);
          console.log(`Channel created: ${channelId}`);
        }

        clientRef.current = client;
        setChatClient(client);
      } catch (error) {
        console.error("Error initializing chat client:", error);
      }
    };

    init();

    return () => {
      clientRef.current?.disconnectUser();
      console.log("User disconnected from chat");
    };
  }, [userData, chatMember, STREAM_API_KEY]);

  const CustomChannelPreview = (props: ChannelPreviewUIComponentProps) => {
    const {
      channel,
      displayImage,
      displayTitle,
      latestMessagePreview,
      channelUpdateCount,
    } = props;

    const handleChannelClick = async () => {
      console.log("Selected channel:", channel.id);
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

  if (!chatClient) return <div>Loading chat...</div>;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full pt-10">
      <h1 className="text-2xl font-bold">
        Chat with {chatMember?.username || "User"}
      </h1>
      <Chat client={chatClient} theme="messaging light">
        <div style={{ display: "flex", height: "100vh" }}>
          <div style={{ width: "300px", borderRight: "1px solid #ccc" }}>
            <ChannelList
              filters={{
                members: { $in: [userData?.userId?.toString() || ""] },
              }}
              sort={{ last_message_at: -1 }}
              options={{ limit: 10 }}
              Preview={CustomChannelPreview}
            />
          </div>

          <div style={{ flex: 1 }}>
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
