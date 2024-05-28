import type { NextApiRequest, NextApiResponse } from 'next';
import * as fs from 'fs';
import * as path from 'path';

// const directoryPath = process.env.OBJECT_ADDRESS+'/public/myDirectory';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {

    const { nowaddress } = req.body;
    let directoryPath = process.env.PDF_DIRECTORY+'';

    if(directoryPath != nowaddress){
      directoryPath = nowaddress;
      const lastSlashIndex = directoryPath.lastIndexOf("/");
      directoryPath = directoryPath.substring(0, lastSlashIndex);
    }

    const lastSlashIndexNew = directoryPath.lastIndexOf("/");
    const nowdirectory = directoryPath.substring(lastSlashIndexNew + 1);

    let directoryArray: string[] = [];
    let filesArray: string[] = [];

    fs.readdir(directoryPath, { withFileTypes: true }, (err, files) => {
      if (err) {
        console.error(err);
        return;
      }

      //Directorys
      const directories = files.filter((file) => file.isDirectory());
      directories.forEach((dir) => {
        directoryArray.push(dir.name);
      });

      const fileslist = files.filter((file) => file.isFile());
      fileslist.forEach((fil) => {
        filesArray.push(fil.name);
      });

      res.status(200).json({ message: directoryPath, nowdirectory: nowdirectory, directorys: directoryArray, files: filesArray});
    });

    return;
}
