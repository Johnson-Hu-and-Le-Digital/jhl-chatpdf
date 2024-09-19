import type { NextApiRequest, NextApiResponse } from 'next';
import * as fs from 'fs';
import * as path from 'path';
import { Pinecone } from '@pinecone-database/pinecone';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {

    const { directoryname, modifyPromptEngineering } = req.body;

    const directoryPath = process.env.PDF_DIRECTORY+'/'+directoryname;

    // Check if the directory exists
    if (fs.existsSync(directoryPath)) {

        const data = {
          prompt_engineering: modifyPromptEngineering
        };
         
        const configContent = JSON.stringify(data, null, 2);

        fs.writeFile(directoryPath+'/config.json', configContent, { mode: 0o600 }, (err) => {
          if (err) {
            console.error(err);
            return;
          }
        });

        res.status(200).json({ message: `Prompt Engineering modify successfully.`});
    } else {
        res.status(400).json({ message: `Directory '${directoryPath}' does not exist.` });
    }

    return;
}