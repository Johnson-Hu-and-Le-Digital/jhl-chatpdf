import type { NextApiRequest, NextApiResponse } from 'next';
import * as fs from 'fs';
import * as path from 'path';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {

    const { directoryname } = req.body;

    const directoryPath = process.env.PDF_DIRECTORY+'/'+directoryname;

    // Check if the directory exists
    if (!fs.existsSync(directoryPath)) {
        // If it doesn't exist, create the directory
        fs.mkdirSync(directoryPath);
        // console.log(`Directory '${directoryPath}' created.`);
        res.status(200).json({ message: `Directory '${directoryPath}' created.` });
    } else {
        // console.log(`Directory '${directoryPath}' already exists.`);
        fs.readdir(directoryPath, { withFileTypes: true }, (err, files) => {
            if (err) {
              console.error(err);
              return;
            }
            // 过滤出所有文件夹
            const directories = files.filter((file) => file.isDirectory());
            // 打印文件夹名称
            // console.log('Directories:');
            directories.forEach((dir) => console.log(dir.name));
          });

        res.status(400).json({ message: `Directory '${directoryPath}' already exists.` });
    }

    return;
}