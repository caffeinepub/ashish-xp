import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface FileItem {
    id: bigint;
    title: string;
    featured: boolean;
    thumbnailUrl: string;
    downloadUrl: string;
    category: string;
}
export interface backendInterface {
    addFile(title: string, category: string, thumbnailUrl: string, downloadUrl: string): Promise<bigint>;
    deleteFile(id: bigint): Promise<void>;
    getFeatured(): Promise<Array<FileItem>>;
    getFiles(): Promise<Array<FileItem>>;
    getFilesByCategory(category: string): Promise<Array<FileItem>>;
    getNotice(): Promise<string>;
    seedData(): Promise<void>;
    setFeatured(id: bigint, featured: boolean): Promise<void>;
    setNotice(message: string): Promise<void>;
    updateFile(id: bigint, title: string, category: string, thumbnailUrl: string, downloadUrl: string, featured: boolean): Promise<void>;
    verifyAccessPassword(hash: string): Promise<boolean>;
    verifyAdminPassword(hash: string): Promise<boolean>;
}
