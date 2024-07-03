import type { NextApiRequest, NextApiResponse } from 'next';
import * as fs from 'fs';
import * as path from 'path';
import { Pinecone } from '@pinecone-database/pinecone';

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

        const pinecone = new Pinecone({
          apiKey: process.env.PINECONE_API_KEY ?? '',
        });

        let indexname = directoryname.toLowerCase();
        indexname = indexname.replaceAll(' ', '-').replaceAll('_', '-');
        // console.log(indexname);
        await pinecone.createIndex({
          name: indexname,
          dimension: 1536,
          metric: 'cosine',
          spec: {
            serverless: {
              cloud: 'aws',
              region: 'us-wast-2',
            }
          }
        });

        

        // await pinecone.configureIndex(indexname, { podType: 's1.x2' });

        // console.log(`Directory '${directoryPath}' created.`);
        res.status(200).json({ message: `Directory '${directoryPath}' created.`, directoryname: directoryname });
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