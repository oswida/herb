import useLocalStorage from "use-local-storage";

export const useTlDrawData = () => {
  const [ldata, setLData] = useLocalStorage("TLDRAW_USER_DATA_v3", {});
  return {
    tldrawUserId: (ldata as any).user.id,
  };
};
