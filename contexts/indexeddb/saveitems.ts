import { openDatabase } from "./opendatabase";

export const saveItems = async <T>({
  collectionName,
  items,
}: {
  collectionName: string;
  items: T[];
}): Promise<void> => {
  const db = await openDatabase();
  const transaction = db.transaction(collectionName, "readwrite");
  const store = transaction.objectStore(collectionName);

  return new Promise((resolve, reject) => {
    items.forEach((item) => {
      const putRequest = store.put(item);

      // If we later want to add a console.log for debugging purposes, this is where it would go.
      putRequest.onsuccess = () => {};

      putRequest.onerror = (event) => {
        const message = `Error saving item to IndexedDB collection '${collectionName}'.`;
        console.error(message, event);
        reject(new Error(message));
      };
    });

    transaction.oncomplete = () => {
      console.log(`All items saved successfully to the IndexedDB collection '${collectionName}'.`);
      resolve();
    };

    transaction.onerror = (event) => {
      const message = `Transaction error while saving items to the IndexedDB collection '${collectionName}'.`;
      console.error(message, event);
      reject(new Error(message));
    };
  });
};
