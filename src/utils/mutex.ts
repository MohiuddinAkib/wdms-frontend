import { Mutex } from "async-mutex";

export const csrfMutex = new Mutex();