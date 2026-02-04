import { cookies } from "next/headers";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";
import type { AxiosResponse } from "axios";
import type { FetchNotesParams, NotesResponse } from "./clientApi";
import { api } from "./api";

const getCookieHeader = async () => {
  const cookieStore = await cookies();

  return { Cookie: cookieStore.toString() };
};

export const fetchNotes = async (params: FetchNotesParams) => {
  const headers = await getCookieHeader();
  const res = await api.get<NotesResponse>("/notes", { params, headers });
  return res.data;
};

export const fetchNoteById = async (id: string) => {
  const headers = await getCookieHeader();
  const res = await api.get<Note>(`/notes/${id}`, { headers });
  return res.data;
};

export const getMe = async () => {
  const headers = await getCookieHeader();
  const res = await api.get<User>("/users/me", { headers });
  return res.data;
};

export const checkSession = async (): Promise<
  AxiosResponse<User | { success: boolean } | null>
> => {
  const headers = await getCookieHeader();
  return api.get<User | { success: boolean } | null>("/auth/session", {
    headers,
  });
};
