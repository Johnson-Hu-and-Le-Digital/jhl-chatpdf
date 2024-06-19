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

    // const pinecone = new Pinecone({
    //   apiKey: process.env.PINECONE_API_KEY ?? '',
    // });

    console.log('pdfurl: '+pdfurl);

    deleteFile(pdfurl);

    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY ?? '',
    });

    let fileDirLo = delDir.toLowerCase();
    const index_name = fileDirLo.replaceAll(' ', '-').replaceAll('_', '-');
    console.log("index name: "+index_name);

    const index = pinecone.index(index_name);
    // pinecone.deleteIndex('test-library-index');
    
    await index.namespace('example-namespace').deleteAll();

    // await index.deleteMany({
    //   'source': pdfurl,
    // });

    
    // 删除文件
    // fs.unlink(pdfurl, (err) => {

    //   try{
    //     const pinecone = new Pinecone({
    //       apiKey: process.env.PINECONE_API_KEY ?? '',
    //     });
    //     const index = pinecone.index("pinecone-index");
    //     // pinecone.deleteIndex('test-library-index');
  
    //     await index.deleteMany({
    //       source: pdfurl,
    //     });

    //     res.status(200).json({ message: `PDF deleted successfully.`, delDir: delDir});

    //   }catch(err){

    //       // console.log(err);
    //       res.status(400).json({ message: err});
    //   }
    //   // if (err) throw err;
    //   // console.log('文件已删除');

    // });

    res.status(200).json({ message: `PDF deleted successfully.`, delDir: delDir});

    return;
}

async function deleteFile(filePath: any) {
  try {
      await fs.unlink(filePath, (err) => {

      });
      console.log('delete success');
  } catch (error) {
      console.error('delete error:', error);
  }
}