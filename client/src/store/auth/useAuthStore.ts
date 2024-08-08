import {create} from 'zustand'

export interface AuthState {
    userInfo: any
    setUserInfo: (userInfo: any) => void
}

export const useAuthStore = create<AuthState>()((set) => ({
    userInfo: undefined,
    setUserInfo: (state) => set({userInfo: state})
}))