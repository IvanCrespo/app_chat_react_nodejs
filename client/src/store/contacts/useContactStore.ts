import { create } from "zustand";

export interface ContactState {
  selectedChatType: any;
  selectedChatData: any;
  selectedChatMessages: any[];
  directMessagesContacts: any[];
  isUploading: boolean;
  isDownloading: boolean;
  fileUploadProgress: number;
  fileDownloadProgress: number;
  channels: any[];
  setChannels: (channels: any) => void; 
  setIsUploading: (isUploading: any) => void;
  setIsDownloading: (isDownloading: any) => void;
  setFileUploadProgress: (fileUploadProgress: any) => void; 
  setFileDownloadProgress: (fileDownloadProgress: any) => void; 
  setSelectedChatType: (selectedChatType: any) => void;
  setSelectedChatData: (selectedChatData: any) => void;
  setDirectMessagesContacts: (directMessagesContacts: any) => void;
  addChannel: (channel: any) => void;
  closeChat: () => void;
  setSelectedChatMessages: (selectedChatMessages: any) => void;
  addMessage: (message: any) => void;
  addChannelInChannelList: (message: any) => void;
  addContactsInDMContacts: (message: any, userInfo: any) => void;
}

export const useContactStore = create<ContactState>()((set, get) => ({
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
  directMessagesContacts: [],
  isUploading: false,
  isDownloading: false,
  fileUploadProgress: 0,
  fileDownloadProgress: 0,
  channels: [],
  setChannels: (channels) => set({channels}),
  setIsUploading: (isUploading) => set({isUploading}),
  setIsDownloading: (isDownloading) => set({isDownloading}),
  setFileUploadProgress: (fileUploadProgress) => set({fileUploadProgress}),
  setFileDownloadProgress: (fileDownloadProgress) => set({fileDownloadProgress}),
  setSelectedChatType: (state) => set({ selectedChatType: state }),
  setSelectedChatData: (state) => set({ selectedChatData: state }),
  setDirectMessagesContacts: (state) => set({ directMessagesContacts: state }),
  addChannel: (channel => {
    const channels = get().channels;
    set({channels: [channel, ...channels]})
  }),
  closeChat: () =>
    set({
      selectedChatData: undefined,
      selectedChatType: undefined,
      selectedChatMessages: [],
    }),
  setSelectedChatMessages: (state) => set({ selectedChatMessages: state }),
  addMessage: (message) => {
    const selectedChatMessages = get().selectedChatMessages;
    const selectedChatType = get().selectedChatType;
    set({
      selectedChatMessages: [
        ...selectedChatMessages,
        {
          ...message,
          recipient:
            selectedChatType === "channel"
              ? message.recipient
              : message.recipient._id,
          sender:
            selectedChatType === "channel"
              ? message.sender
              : message.sender._id,
        },
      ],
    });
  },
  addChannelInChannelList: (message) => {
    const channels = get().channels;
    const data = channels.find((channel) => channel._id === message.channelId);
    const index = channels.findIndex((channel) => channel._id === message.channelId);
    if(index !== -1 && index !== undefined){
      channels.splice(index, 1);
      channels.unshift(data);
    }
  },
  addContactsInDMContacts: (message, userInfo) => {
    const userId = userInfo.id;
    const fromId = message.sender._id === userId ? message.recipient._id : message.sender._id;
    const fromData = message.sender._id === userId ? message.recipient : message.sender;
    const dmContacts = get().directMessagesContacts;
    const data = dmContacts.find((contact) => contact._id === fromId);
    const index = dmContacts.findIndex((contact) => contact._id === fromId);
    if(index !== -1 && index !== undefined){
      dmContacts.splice(index, 1),
      dmContacts.unshift(data);
    } else {
      dmContacts.unshift(fromData);
    }
    set({directMessagesContacts: dmContacts});
  }
}));
