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

        res.status(500).json({ message: err});
        return;
      }

      const fileslist = files.filter((file) => file.isFile());
      fileslist.forEach((fil) => {
        let filename = fil.name;
        let lastFourChars = filename.slice(-4);
        if(lastFourChars === '.pdf'){
          filesArray.push(fil.name);
        }
      });

      let additional = '';
      if(fs.existsSync(directoryPath+'/config.json')){
        const data = fs.readFileSync(directoryPath+'/config.json', 'utf8');
        const jsonData = JSON.parse(data);
        // console.log(jsonData.prompt_engineering);
        additional = jsonData.prompt_engineering;
      }
      console.log("additional: "+additional);

      res.status(200).json({ message: directoryPath, directoryPath: directoryPath,files: filesArray,additional: additional});
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