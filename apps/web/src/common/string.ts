import { compressToBase64, decompressFromBase64 } from "@eonasdan/lz-string";

export const compressData64 = (data: any) => {
  return compressToBase64(JSON.stringify(data));
};

export const decompressData64 = (data: any) => {
  const d = decompressFromBase64(data);
  try {
    return JSON.parse(d);
  } catch (e) {
    return undefined;
  }
};
