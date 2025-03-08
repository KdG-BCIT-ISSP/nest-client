import { atom } from "jotai";
import { ArticleTypeWithID } from "@/types/ArticleTypeWithID";

export type ArticlesState = ArticleTypeWithID[];

export const articlesAtom = atom<ArticlesState>([]);
