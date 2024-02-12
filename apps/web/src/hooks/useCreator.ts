import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";

export const useCreator = (userId: string, creatorApiUrl: string) => {
  const { data, refetch } = useQuery({
    queryKey: ["creatorInfo", userId],
    queryFn: () =>
      fetch(`${creatorApiUrl}/${userId}`, {
        method: "GET",
      }).then((res) => res.json()),
    networkMode: "online",
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  useEffect(() => {
    refetch().then((res) => {
      // console.log("refetch", res);
    });
  }, [userId, creatorApiUrl]);

  const isCreator = useMemo(() => {
    if (!data) return false;
    return data.isCreator;
  }, [data]);

  return { isCreator };
};
