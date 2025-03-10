const DB_VERSION = 1;

export const openDatabase = ({ databaseName }: { databaseName: string }): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    // A flag to prevent multiple resolve/reject calls.
    let upgradeFailed = false;

    const request = indexedDB.open(databaseName, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const target = event.target as IDBOpenDBRequest;
      const db = target.result;
      console.log(`Upgrading IndexedDB to version ${DB_VERSION}...`);

      try {
        if (!db.objectStoreNames.contains("artifacts")) {
          db.createObjectStore("artifacts", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("builds")) {
          db.createObjectStore("builds", { keyPath: "characterId" });
        }

        const upgradeTransaction = target.transaction;
        if (!upgradeTransaction) {
          upgradeFailed = true;
          const message = "Unexpected error: upgrade transaction is null.";
          console.error(message);
          return reject(new Error(message));
        }

        upgradeTransaction.oncomplete = () => {
          console.log("IndexedDB upgrade complete.");
        };

        upgradeTransaction.onerror = () => {
          if (!upgradeFailed) {
            upgradeFailed = true;
            const message = "Error during IndexedDB upgrade transaction.";
            console.error(message);
            db.close();
            reject(new Error(message));
          }
        };
        upgradeTransaction.onabort = () => {
          if (!upgradeFailed) {
            upgradeFailed = true;
            const message = "IndexedDB upgrade transaction aborted.";
            console.error(message);
            db.close();
            reject(new Error(message));
          }
        };
      } catch (err) {
        if (!upgradeFailed) {
          upgradeFailed = true;
          console.error("Unexpected error during IndexedDB upgrade.", err);
          db.close();
          reject(err);
        }
      }
    };

    request.onsuccess = (event) => {
      if (upgradeFailed) {
        return;
      }

      const db = (event.target as IDBOpenDBRequest).result;

      if (db.version !== DB_VERSION) {
        console.warn(`IndexedDB version mismatch: expected ${DB_VERSION}, but got ${db.version}.`);
      }

      resolve(db);
    };

    request.onerror = (event) => {
      if (upgradeFailed) {
        return;
      }

      const eventMessage = (event.target as IDBOpenDBRequest).error?.message;
      const message = eventMessage
        ? `Failed to open IndexedDB: ${eventMessage}.`
        : `Unexpected error when opening IndexedDB.`;
      console.error(message, event);
      reject(new Error(message));
    };
  });
};
