import { Mutex } from "async-mutex";

export const csrfMutex = new Mutex();

export const authMutex = new Mutex();