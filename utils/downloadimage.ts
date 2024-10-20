import axios from "axios";
import fs from "fs";

const downloadImage = async ({ savePath, url }: { savePath: string; url: string }) => {
  try {
    const response = await axios({
      method: "GET",
      responseType: "arraybuffer",
      timeout: 30000,
      url,
    });

    if (response.status === 200) {
      console.log(`Downloading image from ${url}`);

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
    } else {
      throw new Error(`Failed to download image. Status code: ${response.status}`);
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error during Axios request:", err.message);
    } else {
      console.error("Unknown error during Axios request:", err);
    }
    throw err;
  }
};

export default downloadImage;
