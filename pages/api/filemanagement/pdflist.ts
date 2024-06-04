import type { NextApiRequest, NextApiResponse } from 'next';
import * as fs from 'fs';
import * as path from 'path';

// const directoryPath = process.env.OBJECT_ADDRESS+'/public/myDirectory';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {

    const { directoryname } = req.body;

    let directoryPath = process.env.PDF_DIRECTORY+'';
    
    if(directoryname != ''){
      directoryPath = directoryPath+'/'+directoryname;
    }
    
    let filesArray: string[] = [];

    fs.readdir(directoryPath, { withFileTypes: true }, (err, files) => {
      if (err) {
        console.error(err);
        return;
      }

      const fileslist = files.filter((file) => file.isFile());
      fileslist.forEach((fil) => {
        filesArray.push(fil.name);
      });

      res.status(200).json({ message: directoryPath, directoryPath: directoryPath,files: filesArray});
    });

    return;
}


function listFilesAndDirectories(directory: string): void {
  if (!fs.existsSync(directory)) {
      console.log('Directory does not exist.');
      return;
  }

  const items = fs.readdirSync(directory);
  for (const item of items) {
      const fullPath = path.join(directory, item);
      const stats = fs.lstatSync(fullPath);
      if (stats.isDirectory()) {
          console.log('Directory: ' + item);
          listFilesAndDirectories(fullPath);
      } else {
          console.log('File: ' + item);
      }
  }
}