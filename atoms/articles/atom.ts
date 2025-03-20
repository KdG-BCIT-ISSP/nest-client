import { atom } from "jotai";
import { ArticleCardType } from "@/types/ArticleCardType";

export type ArticlesState = ArticleCardType[];

export const articlesAtom = atom<ArticlesState>([]);
