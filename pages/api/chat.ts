import type { NextApiRequest, NextApiResponse } from 'next';
import type { Document } from 'langchain/document';
// import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { OpenAIEmbeddings } from '@langchain/openai';
// import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { PineconeStore } from '@langchain/pinecone';
import { makeChain } from '@/utils/makechain';
import { pinecone } from '@/utils/pinecone-client';
import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from '@/config/pinecone';
import * as fs from 'fs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { question, history, selectIndex } = req.body;

  console.log('question : ', question);
  console.log('history : ', history);
  console.log('selectIndex : ', selectIndex);

  //only accept post requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!question) {
    return res.status(400).json({ message: 'No question in the request' });
  }
  // OpenAI recommends replacing newlines with spaces for best results
  const sanitizedQuestion = question.trim().replaceAll('\n', ' ');

  try {
    // const index = pinecone.Index(PINECONE_INDEX_NAME);

    const filePath = process.env.PDF_DIRECTORY+'/'+selectIndex+'/';
    const files = fs.readdirSync(filePath);
    const firstFileName = files[0];
    console.log('firstFileName : ', firstFileName);

    const index_name_space = firstFileName ? firstFileName : '';

    let fileDirLo = selectIndex.toLowerCase();
    let index_name = fileDirLo.replaceAll(' ', '-').replaceAll('_', '-');
    
    if(process.env.PINECONE_INDEX_PREFIX != undefined && process.env.PINECONE_INDEX_PREFIX != ''){
      index_name = process.env.PINECONE_INDEX_PREFIX+'-'+index_name;
    }
    console.log("index name: "+index_name);

    const index = pinecone.Index(index_name);

    const namespace = [];

    /* create vectorstore*/
    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({}),
      {
        pineconeIndex: index,
        textKey: 'text',
        namespace: PINECONE_NAME_SPACE, //namespace comes from your config folder
        // namespace: index_name_space
        // namespace: 'Bexsero;Australian Product Information;May;2019;1-23.pdf,CDC;2022;1;Meningococcal Disease Causes and How It Spreads.pdf,Nolan_Vaccine_2019- Published version.pdf,Pelton SI. Journal of Adolescent Health. 2010;46-S9-S15.pdf,Viner RM;The Lancet Neurology;2012;11;774-783.pdf',
      },
    );

    // vectorStore.similaritySearch();
    console.log('vectorStore : ', vectorStore);

    // Use a callback to get intermediate sources from the middle of the chain
    let resolveWithDocuments: (value: Document[]) => void;
    const documentPromise = new Promise<Document[]>((resolve) => {
      console.log('resolve : ',resolve);
      resolveWithDocuments = resolve;
    });
    const retriever = vectorStore.asRetriever({
      callbacks: [
        {
          handleRetrieverEnd(documents) {
            console.log('documents : ', documents);
            resolveWithDocuments(documents);
          },
        },
      ],
    });

    let additional = 'Rinvoq and upadacitinib are the same drug, rinvoq is the trade name and upadacitinib is the drug name.';
    //create chain
    const chain = makeChain(retriever, additional);

    const pastMessages = history
      .map((message: [string, string]) => {
        return [`Human: ${message[0]}`, `Assistant: ${message[1]}`].join('\n');
      })
      .join('\n');
    console.log('pastMessages : ', pastMessages);

    //Ask a question using chat history
    const response = await chain.invoke({
      question: sanitizedQuestion,
      chat_history: pastMessages,
    });

    const sourceDocuments = await documentPromise;

    console.log('response : ', response);
    console.log('sourceDocuments : ', sourceDocuments);
    res.status(200).json({ text: response, sourceDocuments });
  } catch (error: any) {
    console.log('error', error);
    res.status(500).json({ error: error.message || 'Something went wrong' });
  }
}
