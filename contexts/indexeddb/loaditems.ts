import { openDatabase } from "./opendatabase";

export const loadItems = async <T>({
  collectionName,
  validate,
}: {
  collectionName: string;
  validate: (data: unknown) => T[];
}): Promise<T[]> => {
  const db = await openDatabase();
  const transaction = db.transaction(collectionName, "readonly");
  const store = transaction.objectStore(collectionName);

  return new Promise((resolve, reject) => {
    const getRequest = store.getAll();

    getRequest.onsuccess = () => {
      if (getRequest.result) {
        console.log(
          `${getRequest.result.length} items loaded successfully from the IndexedDB collection ${collectionName}.`
        );

        try {
          const items = validate(getRequest.result);
          resolve(items);
        } catch (err) {
          const message = `Validation failed for the items retrieved from the IndexedDB collection ${collectionName}.`;
          console.error(message, err);
          reject(new Error(message));
        }
      } else {
        const message = `Unexpected error: no result when retrieving items from the IndexedDB collection ${collectionName}.`;
        console.log(message);
        reject(new Error(message));
      }
    };

    getRequest.onerror = (event) => {
      const message = `Error loading item from the IndexedDB collection '${collectionName}'.`;
      console.error(message, event);
      reject(new Error(message));
    };

    transaction.onerror = (event) => {
      const message = `Transaction error in '${collectionName}'.`;
      console.error(message, event);
      reject(new Error(message));
    };
  });
};
