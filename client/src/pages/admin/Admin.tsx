import { useAuthStore } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ContactsContainer } from "./components/contacts-container/ContactsContainer";
import { EmptyChatContainer } from "./components/empty-chat-container/EmptyChatContainer";
import { ChatContainer } from "./components/chat-container/ChatContainer";
import { useContactStore } from "@/store/contacts/useContactStore";

export const Admin = () => {
  const { userInfo } = useAuthStore();
  const { selectedChatType} = useContactStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast("Porfavor continua con la configuración del perfil!");
      navigate("/profile");
    }
  }, [userInfo, navigate]);

  return (
    <div className="flex h-[100vh] text-white overflow-hidden">
      <ContactsContainer />
      {
        selectedChatType === undefined ? <EmptyChatContainer/> : <ChatContainer/>
      }
    </div>
  );
};
