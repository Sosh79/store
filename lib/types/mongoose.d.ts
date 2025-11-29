/* eslint-disable no-var */
import { Connection } from 'mongoose';

declare global {
  var mongoose: {
    conn: Connection | null;
    promise: Promise<any> | null;
  };
}

export {};
