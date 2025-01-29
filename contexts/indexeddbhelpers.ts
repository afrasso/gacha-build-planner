import { Artifact, Build, validateArtifact, validateArtifacts, validateBuild, validateBuilds } from "@/types";

const DB_VERSION = 1;

const openDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("genshin", DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains("artifacts")) {
        db.createObjectStore("artifacts", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("builds")) {
        db.createObjectStore("builds", { keyPath: "characterId" });
      }
    };

    request.onsuccess = (event) => resolve((event.target as IDBOpenDBRequest).result);

    request.onerror = () => reject(new Error("Failed to open IndexedDB"));
  });
};

const loadItemFromIndexedDB = async <T>({
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
        const item = validate(getRequest.result);
        resolve(item);
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
  });
};

const loadItemsFromIndexedDB = async <T>({
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
      console.log(
        `${getRequest.result.length} items loaded successfully from the IndexedDB collection ${collectionName}.`
      );
      const items = validate(getRequest.result);
      resolve(items);
    };

    getRequest.onerror = (event) => {
      const message = `Error loading item from the IndexedDB collection '${collectionName}'.`;
      console.error(message, event);
      reject(new Error(message));
    };
  });
};

const saveItemToIndexedDB = async <T>({ collectionName, item }: { collectionName: string; item: T }): Promise<void> => {
  const db = await openDatabase();
  const transaction = db.transaction(collectionName, "readwrite");
  const store = transaction.objectStore(collectionName);

  return new Promise((resolve, reject) => {
    const putRequest = store.put(item);

    putRequest.onsuccess = () => {
      console.log(`Item saved successfully to the IndexedDB collection '${collectionName}'.`, item);
      resolve();
    };

    putRequest.onerror = (event) => {
      const message = `Error saving item to the IndexedDB collection '${collectionName}'.`;
      console.error(message, event);
      reject(new Error(message));
    };
  });
};

const saveItemsToIndexedDB = async <T>({
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
    items.forEach((item) => store.put(item));

    transaction.oncomplete = () => {
      console.log(`All items saved successfully to the IndexedDB collection '${collectionName}'.`);
      resolve();
    };

    transaction.onerror = (event) => {
      const message = `Error saving items to IndexedDB collection '${collectionName}'.`;
      console.error(message, event);
      reject(new Error(message));
    };
  });
};

export const loadArtifactFromIndexedDB = async (id: string): Promise<Artifact | undefined> => {
  return loadItemFromIndexedDB({ collectionName: "artifacts", id, validate: validateArtifact });
};

export const loadArtifactsFromIndexedDB = async (): Promise<Artifact[]> => {
  return loadItemsFromIndexedDB({ collectionName: "artifacts", validate: validateArtifacts });
};

export const loadBuildFromIndexedDB = async (characterId: string): Promise<Build | undefined> => {
  return loadItemFromIndexedDB({ collectionName: "builds", id: characterId, validate: validateBuild });
};

export const loadBuildsFromIndexedDB = async (): Promise<Build[]> => {
  return loadItemsFromIndexedDB({ collectionName: "builds", validate: validateBuilds });
};

export const saveArtifactToIndexedDB = async (artifact: Artifact): Promise<void> => {
  return saveItemToIndexedDB({ collectionName: "artifacts", item: artifact });
};

export const saveArtifactsToIndexedDB = async (artifacts: Artifact[]): Promise<void> => {
  return saveItemsToIndexedDB({ collectionName: "artifacts", items: artifacts });
};

export const saveBuildToIndexedDB = async (build: Build): Promise<void> => {
  return saveItemToIndexedDB({ collectionName: "builds", item: build });
};

export const saveBuildsToIndexedDB = async (builds: Build[]): Promise<void> => {
  return saveItemsToIndexedDB({ collectionName: "builds", items: builds });
};
