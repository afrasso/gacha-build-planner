import { openDatabase } from "./opendatabase";

export const deleteItem = async ({
  collectionName,
  databaseName,
  id,
}: {
  collectionName: string;
  databaseName: string;
  id: string;
}): Promise<void> => {
  const db = await openDatabase({ databaseName });
  const transaction = db.transaction(collectionName, "readwrite");
  const store = transaction.objectStore(collectionName);

  return new Promise((resolve, reject) => {
    const deleteRequest = store.delete(id);

    deleteRequest.onsuccess = () => {
      console.log(`Requested to delete item with the ID '${id}' from the IndexedDB collection '${collectionName}'.`);
    };

    deleteRequest.onerror = (event) => {
      const message = `Error deleting item with the ID ${id} from the IndexedDB collection '${collectionName}'.`;
      console.error(message, event);
      reject(new Error(message));
    };

    transaction.oncomplete = () => {
      console.log(`Item with the ID ${id} deleted successfully from the IndexedDB collection '${collectionName}'.`);
      resolve();
    };

    transaction.onerror = (event) => {
      const message = `Transaction error while deleting an item from the IndexedDB collection '${collectionName}'.`;
      console.error(message, event);
      reject(new Error(message));
    };
  });
};
