import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { FileItem } from "../backend";
import { useActor } from "./useActor";

export type { FileItem };

export function useGetFiles() {
  const { actor, isFetching } = useActor();
  return useQuery<FileItem[]>({
    queryKey: ["files"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFiles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetFeatured() {
  const { actor, isFetching } = useActor();
  return useQuery<FileItem[]>({
    queryKey: ["featured"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFeatured();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetNotice() {
  const { actor, isFetching } = useActor();
  return useQuery<string>({
    queryKey: ["notice"],
    queryFn: async () => {
      if (!actor) return "";
      return actor.getNotice();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSeedData() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.seedData();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      queryClient.invalidateQueries({ queryKey: ["featured"] });
    },
  });
}

export function useAddFile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      title: string;
      category: string;
      thumbnailUrl: string;
      downloadUrl: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.addFile(
        args.title,
        args.category,
        args.thumbnailUrl,
        args.downloadUrl,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      queryClient.invalidateQueries({ queryKey: ["featured"] });
    },
  });
}

export function useUpdateFile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      id: bigint;
      title: string;
      category: string;
      thumbnailUrl: string;
      downloadUrl: string;
      featured: boolean;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateFile(
        args.id,
        args.title,
        args.category,
        args.thumbnailUrl,
        args.downloadUrl,
        args.featured,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      queryClient.invalidateQueries({ queryKey: ["featured"] });
    },
  });
}

export function useDeleteFile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteFile(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      queryClient.invalidateQueries({ queryKey: ["featured"] });
    },
  });
}

export function useSetFeatured() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (args: { id: bigint; featured: boolean }) => {
      if (!actor) throw new Error("No actor");
      return actor.setFeatured(args.id, args.featured);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      queryClient.invalidateQueries({ queryKey: ["featured"] });
    },
  });
}

export function useSetNotice() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (message: string) => {
      if (!actor) throw new Error("No actor");
      return actor.setNotice(message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notice"] });
    },
  });
}
