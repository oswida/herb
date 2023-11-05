import {
  compress,
  compressToBase64,
  decompress,
  decompressFromBase64,
} from "@eonasdan/lz-string";

// export const compressData = (data: any) => {
//   return compress(JSON.stringify(data)) as string;
// };

export const compressData64 = (data: any) => {
  return compressToBase64(JSON.stringify(data));
};

// export const decompressData = (data: any) => {
//   const d = decompress(data);
//   return JSON.parse(d);
// };

export const decompressData64 = (data: any) => {
  const d = decompressFromBase64(data);
  try {
    return JSON.parse(d);
  } catch (e) {
    return undefined;
  }
};
