import { uniqueId } from "@tldraw/tldraw";
import { useMemo } from "react";
import useLocalStorage from "use-local-storage";

export const useTlDrawData = () => {
  // small hack for user local data
  // TLDRAW_USER_DATA_v3:"{"version":3,"user":{"id":"KIOiRT98VOcbt-y1ZtMXq","locale":"en"}}"
  const [ldata, setLData] = useLocalStorage("TLDRAW_USER_DATA_v3", {});

  const tldrawUserId = useMemo(() => {
    if (Object.keys(ldata).length === 0) {
      const id = uniqueId();
      setLData({ version: 3, user: { id: id, locale: "en" } });
      return id;
    }
    return (ldata as any).user.id;
  }, [ldata]);

  return {
    tldrawUserId,
  };
};
