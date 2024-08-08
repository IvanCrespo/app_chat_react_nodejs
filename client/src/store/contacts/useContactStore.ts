import {create} from 'zustand'

export interface ContactState {
    selectedChatType: any
    selectedChatData: any
    selectedChatMessages: []
    setSelectedChatType: (selectedChatType: any) => void
    setSelectedChatData: (selectedChatData: any) => void
    closeChat: () => void
    setSelectedChatMessages: (selectedChatMessages: any) => void
}

export const useContactStore = create<ContactState>()((set) => ({
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages: [],
    setSelectedChatType: (state) => set({selectedChatType: state}),
    setSelectedChatData: (state) => set({selectedChatData: state}),
    closeChat: () => set({selectedChatData: undefined, selectedChatType: undefined, selectedChatMessages: []}),
    setSelectedChatMessages: (state) => set({selectedChatMessages: state}) 
}))