import {useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import {RiEmojiStickerLine} from "react-icons/ri"
import {IoSend} from 'react-icons/io5'
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';

export const MessageBar = () => {

  const emojiRef = useRef<HTMLDivElement>(null);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)
  const [message, setMessage] = useState("");

  const handleAddEmoji = async(emoji: EmojiClickData) => {
    setMessage((msg) => msg + emoji.emoji);
  }

  const handleSendMessage = async() => {

  }

  useEffect(() => {
    function handleClickOutside(event){
      if(emojiRef.current && !emojiRef.current.contains(event.target)){
        setEmojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown",(e)=> handleClickOutside(e));
    return () => {
      document.removeEventListener("mousedown", (e) => handleClickOutside(e));
    }
  }, [emojiRef])
  

  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
        <input
          type="text"
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
          placeholder="Ingresa el mensaje"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="transition-all duration-300 text-neutral-500 focus:border-none focus:outline-none focus:text-white">
          <GrAttachment className="text-2xl" />
        </button>
        <div className="relative">
          <button className="transition-all duration-300 text-neutral-500 focus:border-none focus:outline-none focus:text-white" onClick={() => setEmojiPickerOpen(true)}>
            <RiEmojiStickerLine className="text-2xl" />
          </button>
          <div className="absolute right-0 bottom-16" ref={emojiRef}>
            <EmojiPicker theme={Theme.DARK} open={emojiPickerOpen} onEmojiClick={handleAddEmoji} autoFocusSearch={false} />
          </div>
        </div>
      </div>
      <button className="transition-all duration-300 bg-[#8417ff] rounded-md flex items-center justify-center p-5 focus:border-none hover:bg-[#741bda] focus:bg-[#741bda] focus:outline-none focus:text-white" onClick={handleSendMessage}>
          <IoSend className="text-2xl"/>
        </button>
    </div>
  );
};
