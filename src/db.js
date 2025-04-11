import { openDB } from 'idb';

const DB_NAME = 'offline-image-db';
const STORE_NAME = 'images';

export async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    }
  });
}

export async function saveImage(blob) {
  const db = await getDB();
  await db.add(STORE_NAME, { blob });
}

export async function getImages() {
  const db = await getDB();
  return await db.getAll(STORE_NAME);
}
