import { openDatabase } from "./opendatabase";

export const loadItem = async <T>({
  collectionName,
  id,
  validate,
}: {
  collectionName: string;
  id: string;
  validate: (data: unknown) => T;
}): Promise<T | undefined> => {
  const db = await openDatabase();
  const transaction = db.transaction(collectionName, "readonly");
  const store = transaction.objectStore(collectionName);

  return new Promise((resolve, reject) => {
    const getRequest = store.get(id);

    getRequest.onsuccess = () => {
      if (getRequest.result) {
        console.log(`Item loaded successfully from the IndexedDB collection '${collectionName}'.`, getRequest.result);

        try {
          const item = validate(getRequest.result);
          resolve(item);
        } catch (err) {
          const message = `Validation failed for the retrieved item with the ID ${id} from the IndexedDB collection ${collectionName}.`;
          console.error(message, err);
          reject(new Error(message));
        }
      } else {
        console.log(`No item found with the ID ${id} in the IndexedDB collection '${collectionName}'.`);
        resolve(undefined);
      }
    };

    getRequest.onerror = (event) => {
      const message = `Error retrieving item with the ID ${id} from the IndexedDB collection '${collectionName}'.`;
      console.error(message, event);
      reject(new Error(message));
    };

    transaction.onerror = (event) => {
      const message = `Transaction error in '${collectionName}'.`;
      console.error(message, event);
      reject(message);
    };
  });
};
