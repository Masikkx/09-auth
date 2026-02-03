import axios from "axios";
import { cookies } from "next/headers";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";
import type { FetchNotesParams, NotesResponse } from "./clientApi";

const baseURL = process.env.NEXT_PUBLIC_API_URL + "/api";

const getServerApi = async () => {
  const cookieStore = await cookies();

  return axios.create({
    baseURL,
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
};

export const fetchNotes = async (params: FetchNotesParams) => {
  const api = await getServerApi();
  const res = await api.get<NotesResponse>("/notes", { params });
  return res.data;
};

export const fetchNoteById = async (id: string) => {
  const api = await getServerApi();
  const res = await api.get<Note>(`/notes/${id}`);
  return res.data;
};

export const getMe = async () => {
  const api = await getServerApi();
  const res = await api.get<User>("/users/me");
  return res.data;
};

export const checkSession = async () => {
  const api = await getServerApi();
  const res = await api.get<User | { success: boolean } | null>("/auth/session");

  if (!res.data) return null;
  if ("email" in res.data) return res.data;

  if ("success" in res.data && res.data.success) {
    try {
      const meRes = await api.get<User>("/users/me");
      return meRes.data;
    } catch {
      return null;
    }
  }

  return null;
};