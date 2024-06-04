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
    // if(pdfDirectory != ''){
    //   directoryPath = pdfDirectory+'';
    // }
    // if(directoryname != ''){
    //   directoryPath = directoryPath+'/'+directoryname;
    // }
    
    let directoryArray: string[] = [];
    // let filesArray: string[] = [];
    fs.readdir(directoryPath, { withFileTypes: true }, (err, files) => {
      if (err) {
        console.error(err);
        return;
      }

      //Directorys
      const directories = files.filter((file) => file.isDirectory());
      directories.forEach((dir) => {
        // console.log(dir.name)
        directoryArray.push(dir.name);
      });

      // const fileslist = files.filter((file) => file.isFile());
      // fileslist.forEach((fil) => {
      //   // console.log(fil.name)
      //   filesArray.push(fil.name);
      // });

      // let nowdirectory = 'gpt4Pdf';
      // if(directoryname != ''){
      //   nowdirectory = directoryname;
      // }
      // const lastSlashIndexNew = directoryPath.lastIndexOf("/");
      // const nowdirectory = directoryPath.substring(lastSlashIndexNew + 1);

      // res.status(200).json({ message: directoryPath, nowdirectory: nowdirectory, directorys: directoryArray, files: filesArray});
      res.status(200).json({ message: directoryPath, directorys: directoryArray, directoryname: directoryname});
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