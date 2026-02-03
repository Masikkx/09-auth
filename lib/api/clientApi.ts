import { api } from "./api";
import type { Note, CreateNote } from "@/types/note";
import type { User } from "@/types/user";

// ---------- NOTES ----------
export type FetchNotesParams = {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
};

export type NotesResponse = {
  notes: Note[];
  totalPages: number;
  page?: number;
  perPage?: number;
  totalItems?: number;
};

export const fetchNotes = async (params: FetchNotesParams) => {
  const res = await api.get<NotesResponse>("/notes", { params });
  return res.data;
};

export const fetchNoteById = async (id: string) => {
  const res = await api.get<Note>(`/notes/${id}`);
  return res.data;
};

export const createNote = async (data: CreateNote) => {
  const res = await api.post<Note>("/notes", data);
  return res.data;
};

export const deleteNote = async (id: string) => {
  const res = await api.delete<Note>(`/notes/${id}`);
  return res.data;
};

// ---------- AUTH ----------
export type RegisterRequest = {
  email: string;
  password: string;
};

export const register = async (data: RegisterRequest) => {
  const res = await api.post<User>("/auth/register", data);
  return res.data;
};

export const login = async (data: RegisterRequest) => {
  const res = await api.post<User>("/auth/login", data);
  return res.data;
};

export const logout = async () => {
  await api.post("/auth/logout");
};

export const checkSession = async () => {
  const res = await api.get<User | { success: boolean } | null>("/auth/session");

  if (!res.data) return null;
  if ("email" in res.data) return res.data;

  if ("success" in res.data && res.data.success) {
    try {
      const me = await getMe();
      return me;
    } catch {
      return null;
    }
  }

  return null;
};

export const getMe = async () => {
  const res = await api.get<User>("/users/me");
  return res.data;
};

export const updateMe = async (data: { username: string }) => {
  const res = await api.patch<User>("/users/me", data);
  return res.data;
};