import { create } from 'zustand';

interface CallState {
  isSearching: boolean;
  isMatched: boolean;
  peerData: any | null;
  roomId: string | null;
  peerSocketId: string | null;
  messages: any[];
  setSearching: (status: boolean) => void;
  setMatch: (data: any) => void;
  endCall: () => void;
  addMessage: (msg: any) => void;
}

export const useCallStore = create<CallState>((set) => ({
  isSearching: false,
  isMatched: false,
  peerData: null,
  roomId: null,
  peerSocketId: null,
  messages: [],
  setSearching: (status) => set({ isSearching: status, isMatched: false, peerData: null, roomId: null, peerSocketId: null, messages: [] }),
  setMatch: (data) => set({ isSearching: false, isMatched: true, ...data }),
  endCall: () => set({ isSearching: false, isMatched: false, peerData: null, roomId: null, peerSocketId: null, messages: [] }),
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
}));
