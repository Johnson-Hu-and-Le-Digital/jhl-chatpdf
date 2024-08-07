import type { NextApiRequest, NextApiResponse } from 'next';
import * as fs from 'fs';
import * as path from 'path';

import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';
import type { Document } from 'langchain/document';
import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from '@/config/pinecone';

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

    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY ?? '',
    });

    let fileDirLo = delDir.toLowerCase();
    let index_name = fileDirLo.replaceAll(' ', '-').replaceAll('_', '-');
    // index_name = process.env.PINECONE_INDEX_PREFIX+'-'+index_name;
    if(process.env.PINECONE_INDEX_PREFIX != undefined && process.env.PINECONE_INDEX_PREFIX != ''){
      index_name = process.env.PINECONE_INDEX_PREFIX+'-'+index_name;
    }
    console.log("index name: "+index_name);

    console.log('PINECONE_NAME_SPACE : ', PINECONE_NAME_SPACE);

    const sanitizedFilename = pdfname!.replace(/[^\w\s-]/g, '');
    const normalizedFilename = path.normalize(sanitizedFilename.replace(/\s+/g, '_'));
    const prefixT = normalizedFilename+'#';
    console.log('prefixT : '+prefixT);
    const index = pinecone.index(index_name).namespace(PINECONE_NAME_SPACE);

    const results = await index.listPaginated({ prefix: prefixT, limit: 100 });
    console.log('results : ', results);
    const vectorIds = results.vectors!.map((vector) => vector.id);
    await index.deleteMany(vectorIds);

    let pagination_token = results.pagination?.next;
    while (pagination_token != undefined) {

      const while_list = await index.listPaginated({ prefix: prefixT, limit: 100, paginationToken: pagination_token });
      console.log('while_list : ', while_list);
      
      const while_vectorIds = while_list.vectors!.map((vector) => vector.id);
      console.log('while_vectorIds : ', while_vectorIds);

      if(while_vectorIds.length > 0){
        await index.deleteMany(while_vectorIds);
      }

      console.log('results pagination next: ', while_list.pagination?.next);
      pagination_token = while_list.pagination?.next;

    }


    // const vectorIds = results.vectors!.map((vector) => vector.id);
    // await index.deleteMany(vectorIds);

    // console.log('results pagination next: ', results.pagination?.next);

    // if(results.pagination?.next != undefined){
      
    //   const pageTwoList = await index.listPaginated({ prefix: prefixT, limit: 100, paginationToken: results.pagination?.next });
    //   console.log('pageTwoList : ', pageTwoList);
      
    //   const pageTwoVectorIds = pageTwoList.vectors!.map((vector) => vector.id);
    //   console.log('pageTwoVectorIds : ', pageTwoVectorIds);

    //   if(pageTwoVectorIds.length > 0){
    //     await index.deleteMany(pageTwoVectorIds);
    //   }
    // }

    // const pageOneList = await index.listPaginated({ prefix: prefixT });
    // const pageOneVectorIds = pageOneList.vectors!.map((vector) => vector.id);
    // console.log('pageOneVectorIds : ', pageOneVectorIds);

    // // Then, delete the first page of records by ID:
    // await index.deleteMany(pageOneVectorIds);

    // // For a second page of returned records:
    // const pageTwoList = await index.listPaginated({ prefix: prefixT, paginationToken: pageOneList.pagination!.next });
    // const pageTwoVectorIds = pageTwoList.vectors!.map((vector) => vector.id);
    // console.log('pageTwoVectorIds : ', pageTwoVectorIds);

    // await index.deleteMany(pageTwoVectorIds);


    deleteFile(pdfurl);

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