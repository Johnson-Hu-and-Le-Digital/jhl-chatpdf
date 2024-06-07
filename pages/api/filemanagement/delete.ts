import type { NextApiRequest, NextApiResponse } from 'next';
import * as fs from 'fs';
import * as path from 'path';
import { Pinecone } from '@pinecone-database/pinecone';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {

    const { pdfname, delDir } = req.body;

    // 文件路径
    // const filePath = 'example.txt';
    const pdfurl = process.env.PDF_DIRECTORY+'/'+delDir+'/'+pdfname;
    
    // 删除文件
    fs.unlink(pdfurl, (err) => {
    if (err) throw err;
        console.log('文件已删除');

        // const pinecone = new Pinecone({
        //   apiKey: process.env.PINECONE_API_KEY ?? '',
        // });
        // pinecone.deleteIndex('test-library-index');

        res.status(200).json({ message: `PDF deleted successfully.`, delDir: delDir});
    });

    

    return;
}