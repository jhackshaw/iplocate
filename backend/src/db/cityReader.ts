import { Reader } from "@maxmind/geoip2-node";
import ReaderModel from "@maxmind/geoip2-node/dist/src/readerModel";
import fs from "fs";

let reader: ReaderModel | null = null;

// cache the reader instance for use between requests
export const getReader = () => {
  if (reader) {
    return reader;
  }
  const dbBuffer = fs.readFileSync(process.env.GEOIP_DATABASE_PATH!);
  reader = Reader.openBuffer(dbBuffer);
  return reader;
};
