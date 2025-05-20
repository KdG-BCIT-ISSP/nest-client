import { useState, useEffect, useRef } from "react";
import { StreamChat } from "stream-chat";
import { useAtom } from "jotai";
import { userAtom } from "@/atoms/user/atom";

export const useChatClient = (streamApiKey: string) => {
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const clientRef = useRef<StreamChat | null>(null);
  const [userData] = useAtom(userAtom);

  useEffect(() => {
    const initChatClient = async () => {
      try {
        if (!userData?.userId || !userData?.username) {
          console.error("User data is missing or incomplete");
          return;
        }

        const currentUser = {
          id: userData.userId.toString(),
          name: userData.username,
        };

        const client = StreamChat.getInstance(streamApiKey);
        const currentUserToken = client.devToken(currentUser.id);

        await client.connectUser(currentUser, currentUserToken);
        clientRef.current = client;

        client.on("notification.mark_read", (event) => {
          if (event.message?.user?.id !== currentUser.id) {
            setHasUnreadMessages(true);
          }
        });

        client.on("connection.changed", (event) => {
          console.log("Connection state changed:", event);
        });

        setChatClient(client);
      } catch (error) {
        console.error("Error initializing chat client:", error);
      }
    };

    initChatClient();

    return () => {
      clientRef.current?.disconnectUser();
      console.log("User disconnected from chat");
    };
  }, [streamApiKey, userData]);

  const markMessagesAsRead = () => {
    setHasUnreadMessages(false);
  };

  return { chatClient, hasUnreadMessages, markMessagesAsRead };
};
