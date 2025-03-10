import { openDatabase } from "./opendatabase";

export const deleteItems = async ({
  collectionName,
  databaseName,
}: {
  collectionName: string;
  databaseName: string;
}): Promise<void> => {
  const db = await openDatabase({ databaseName });
  const transaction = db.transaction(collectionName, "readwrite");
  const store = transaction.objectStore(collectionName);

  return new Promise((resolve, reject) => {
    const clearRequest = store.clear();

    // If we later want to add a console.log for debugging purposes, this is where it would go.
    clearRequest.onsuccess = () => {};

    clearRequest.onerror = (event) => {
      const message = `Error deleting items from the IndexedDB collection '${collectionName}'.`;
      console.error(message, event);
      reject(new Error(message));
    };

    transaction.oncomplete = () => {
      console.log(`All items deleted successfully from the IndexedDB collection '${collectionName}'.`);
      resolve();
    };

    transaction.onerror = (event) => {
      const message = `Transaction error while deleting items from the IndexedDB collection '${collectionName}'.`;
      console.error(message, event);
      reject(new Error(message));
    };
  });
};
