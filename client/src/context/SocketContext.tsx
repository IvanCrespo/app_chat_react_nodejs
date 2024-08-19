import { useAuthStore } from "@/store";
import { useContactStore } from "@/store/contacts/useContactStore";
import { HOST } from "@/utils/constants";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  PropsWithChildren,
} from "react";
import { io, Socket } from "socket.io-client";

// type SocketContextType = {
//   socket: Socket | null;
// };

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: PropsWithChildren) => {
  //const socket = useRef<any>();
  const { userInfo } = useAuthStore();
  const [socket, setSocket] = useState<Socket | null>(null);
  const { selectedChatData, selectedChatType, addMessage, addChannelInChannelList, addContactsInDMContacts } = useContactStore();

  useEffect(() => {
    if (userInfo) {
      const newSocket: Socket = io(HOST, {
        withCredentials: true,
        query: {
          userId: userInfo.id,
        },
      });
      setSocket(newSocket);
      socket?.on("connect", () => {
        console.log("Connected to socket server");
      });

      return () => {
        socket?.disconnect();
      };
    }
  }, [userInfo]);

  useEffect(() => {
    const handleRecieveMessage = (message) => {
      if (
        selectedChatType !== undefined &&
        (selectedChatData._id === message.sender._id ||
          selectedChatData._id === message.recipient._id)
      ) {
        console.log("Message rcv:", message);
        addMessage(message);
      }
      addContactsInDMContacts(message, userInfo)
      return;
    };

    socket?.on("recieveMessage", handleRecieveMessage);
  }, [selectedChatData, selectedChatType])

  useEffect(() => {
    const handleRecieveChannelMessage = (message) => {
      if (
        selectedChatType !== undefined && selectedChatData._id === message.channelId
      ) {
        addMessage(message);
      }
      addChannelInChannelList(message);
    };

    socket?.on("recieve-channel-message", handleRecieveChannelMessage);
  }, [selectedChatData, selectedChatType])
  
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
