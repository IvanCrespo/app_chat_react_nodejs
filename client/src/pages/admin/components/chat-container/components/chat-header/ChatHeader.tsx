import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { useContactStore } from "@/store/contacts/useContactStore";
import { HOST } from "@/utils/constants";
import { RiCloseFill } from "react-icons/ri";

export const ChatHeader = () => {
  const { closeChat, selectedChatData, selectedChatType } = useContactStore();

  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20">
      <div className="flex items-center justify-between w-full gap-5">
        <div className="flex items-center justify-center gap-3">
          <div className="relative w-12 h-12">
            <Avatar className="w-12 h-12 overflow-hidden rounded-full">
              {selectedChatData.image ? (
                <AvatarImage
                  src={`${HOST}/${selectedChatData.image}`}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`w-12 h-12 text-lg uppercase border-[1px] flex items-center justify-center rounded-full ${getColor(
                    selectedChatData.color
                  )}`}
                >
                  {selectedChatData.firstName
                    ? selectedChatData.firstName.split("").shift()
                    : selectedChatData.email.split("").shift()}
                </div>
              )}
            </Avatar>
          </div>
          <div>
            {
              selectedChatType === "contact" && selectedChatData.firstName ? `${selectedChatData.firstName} ${selectedChatData.lastName}` : selectedChatData.email
            }
          </div>
        </div>
        <div className="flex items-center justify-center gap-5">
          <button
            className="transition-all duration-300 text-neutral-500 focus:border-none focus:outline-none focus:text-white"
            onClick={closeChat}
          >
            <RiCloseFill className="text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
};
