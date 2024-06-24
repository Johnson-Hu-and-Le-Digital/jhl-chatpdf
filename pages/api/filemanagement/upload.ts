import type { NextApiRequest, NextApiResponse } from 'next'
import { promises as fs } from "fs";
import path from "path";
import { File } from 'formidable';
import * as formidable from 'formidable';
import { exec } from 'child_process';

import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';
import { pinecone } from '@/utils/pinecone-client';
// import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from '@/config/pinecone';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
// import { DirectoryLoader } from '@langchain/community/document_loaders/fs/pdf';

export const config = {
    api: {
        bodyParser: false,
    }
};

type ProcessedFiles = Array<[string, File]>;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    let status = 200,
        resultBody = { status: 'ok', message: 'Files were uploaded successfully', filepath: ''};

    /* Get files using formidable */
    const files = await new Promise<ProcessedFiles | undefined>((resolve, reject) => {
        const form = new formidable.IncomingForm();
        const files: ProcessedFiles = [];
        form.on('file', function (field, file) {
          files.push([field, file]);
        })
        form.on('end', () => resolve(files));
        form.on('error', err => reject(err));
        form.parse(req, (fields, files) => {
          // console.log(files);
          req.body = files;
        });

    }).catch(e => {
        status = 500;
        resultBody = {
            status: 'fail', message: 'Upload error', filepath: ''
        }
    });

    // console.log(files?.length);

    if (files?.length) {
        /* Create directory for uploads */
        
        // const targetPath = process.env.PDF_DIRECTORY+'/directory3/';
        const targetPath = process.env.PDF_DIRECTORY+'/'+req.body.filepath+'/';
        /* Move uploaded files to directory */
        for (const file of files) {
          
            const tempPath = file[1].filepath;

            await fs.rename(tempPath, targetPath + file[1].originalFilename);

            let fileDir = req.body.filepath;
            fileDir = fileDir[0];
            let fileDirLo = fileDir.toLowerCase();
            let index_name = fileDirLo.replaceAll(' ', '-').replaceAll('_', '-');
            const importPath = process.env.PDF_DIRECTORY+'/'+fileDir;

            const names_pace = file[1].originalFilename;

            try {
                /*load raw docs from the all files in the directory */
                const directoryLoader = new DirectoryLoader(importPath, {
                  '.pdf': (path) => new PDFLoader(path),
                });
            
                // const loader = new PDFLoader(filePath);
                const rawDocs = await directoryLoader.load();
            
                /* Split text into chunks */
                const textSplitter = new RecursiveCharacterTextSplitter({
                  chunkSize: 1000,
                  chunkOverlap: 200,
                });

                const BATCH_SIZE = 100; // Adjust this value as needed
            
                const docs = await textSplitter.splitDocuments(rawDocs);
                // console.log('split docs', docs);
            
                console.log('creating vector store...');
                /*create and store the embeddings in the vectorStore*/
                const embeddings = new OpenAIEmbeddings();

                // const index = pinecone.Index(PINECONE_INDEX_NAME); //change to your own index name
                const index = pinecone.Index(index_name);
            
                //embed the PDF documents
                // await PineconeStore.fromDocuments(docs, embeddings, {
                //   pineconeIndex: index,
                //   namespace: names_pace?.toString(),
                //   textKey: 'text',
                // });

                // Split docs into batches
                for (let i = 0; i < docs.length; i += BATCH_SIZE) {
                  const batch = docs.slice(i, i + BATCH_SIZE);
                  // Embed and upsert each batch separately
                  await PineconeStore.fromDocuments(batch, embeddings, {
                    pineconeIndex: index,
                    namespace: names_pace?.toString(),
                    textKey: 'text',
                  });
                }
              } catch (error) {
                console.log('error', error);
                // throw new Error('Failed to ingest your data');
                resultBody = { status: 'no', message: 'Files were upload Error.', filepath: req.body.filepath};
              }
        }

        resultBody = { status: 'ok', message: 'Files were uploaded successfully', filepath: req.body.filepath};

    }

    res.status(status).json(resultBody);
}

export default handler;