import type { NextApiRequest, NextApiResponse } from 'next';
import * as fs from 'fs';
import * as path from 'path';
import { Pinecone } from '@pinecone-database/pinecone';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {

    const { directoryname, promptEngineering } = req.body;

    const directoryPath = process.env.PDF_DIRECTORY+'/'+directoryname;

    // Check if the directory exists
    if (!fs.existsSync(directoryPath)) {
        // If it doesn't exist, create the directory

        fs.mkdirSync(directoryPath);

        // const configContent = `prompt_engineering = Rinvoq and upadacitinib are the same drug, rinvoq is the trade name and upadacitinib is the drug name.`;
        
        const data = {
          prompt_engineering: promptEngineering
        };
         
        const configContent = JSON.stringify(data, null, 2);

        fs.writeFile(directoryPath+'/config.json', configContent, { mode: 0o600 }, (err) => {
          if (err) {
            console.error(err);
            return;
          }
        });
        
        const pinecone = new Pinecone({
          apiKey: process.env.PINECONE_API_KEY ?? '',
        });

        let indexname = directoryname.toLowerCase();
        indexname = indexname.replaceAll(' ', '-').replaceAll('_', '-');
        if(process.env.PINECONE_INDEX_PREFIX != undefined && process.env.PINECONE_INDEX_PREFIX != ''){
          indexname = process.env.PINECONE_INDEX_PREFIX+'-'+indexname;
        }
        // console.log('indexname : ',indexname);
        await pinecone.createIndex({
          name: indexname,
          dimension: 1536,
          metric: 'cosine',
          spec: {
            serverless: {
              cloud: 'aws',
              region: 'us-east-1'
            }
          }
        });

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