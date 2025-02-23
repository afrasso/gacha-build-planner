import axios, { AxiosError } from "axios";
import fs from "fs";

const downloadImage = async ({
  savePath,
  url,
  verbose = false,
}: {
  savePath: string;
  url: string;
  verbose?: boolean;
}) => {
  try {
    const response = await axios({
      method: "GET",
      responseType: "arraybuffer",
      timeout: 30000,
      url,
    });

    if (verbose) {
      console.log(`Downloading image from ${url}.`);
    }

    await new Promise<void>((resolve, reject) => {
      fs.writeFile(savePath, response.data, (err) => {
        if (err) {
          console.error(`Error saving file to ${savePath}:`, err.message);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  } catch (err) {
    if (err instanceof AxiosError && err.status === 404) {
      console.warn(`File not found at ${url}.`);
    } else {
      console.error(`Error downloading image from ${url}: ${err}`);
    }
    throw err;
  }
};

export default downloadImage;
