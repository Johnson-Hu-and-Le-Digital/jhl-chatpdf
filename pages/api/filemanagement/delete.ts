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

    const queryResponse = await index.query({
      vector: [0.96,0.61,0.41,0.87,0.9,0.65,0.27,0.93,0.17,0.64,0.25,0.11,0.03,0.07,0.2,0.14,0.88,0.07,0.17,0.88,0.04,0.74,0.08,0.41,0.14,0.36,0.07,0.09,0.2,0.8,0.84,0.05,0.02,0.92,0.14,0.68,0.51,0.77,0.96,0.66,0.08,0.91,0.15,0.44,0.77,0.47,0.51,0.68,0.1,0.94,0.95,0.11,0.44,0.83,0.8,0.37,0.02,0.11,0.01,0.57,0.1,0.22,0.09,0.23,0.16,0.29,0.3,0.28,0.39,0.12,0.8,0.61,0.25,0.18,0.95,0.18,0.57,0.83,0.12,0.8,0.65,0.06,0.8,0.4,0.29,0.5,0.63,0.29,0.28,0.59,0.72,0.89,0.72,1,0.41,0.86,0.25,0.49,0.32,0.25,0.81,0.09,0.59,0.5,0.23,0.26,0.38,0.55,0.41,0.22,0.15,0.27,0.37,0.81,0.1,0.56,0.27,0.36,0.09,0.82,0.74,0.05,0.38,0.57,0.62,0.36,0.41,0.71,0.33,0.15,0.95,0.62,0.4,0.05,0.17,0.96,0.3,0.13,0.76,0.02,0.66,0.63,0.2,0.41,0.89,0.27,0.03,0.32,0.38,0.6,0.3,0.52,0.27,0.6,0.59,0.8,0.89,0.56,0.65,0.42,0.32,0.42,0.71,0.44,0.58,0.56,0.07,0.1,0.52,0.54,0.26,0.68,0.18,0.58,0.72,0.1,0.54,0.32,0.48,0.47,0.6,0.59,0.8,0.51,0.69,0.91,0.76,0.68,0.67,0.98,0.22,0.53,0.77,0.18,1,0.68,0.4,0.08,0.33,0.67,0.68,0.79,0.95,0.14,0.18,0.92,0.96,0.37,0.89,0.91,0.03,0.95,0.15,0.95,0.14,0.73,0.5,0.59,0.1,0.86,0.91,0.38,0.59,0.67,0.65,0.14,0.6,0.92,0.24,0.53,0.63,0.55,0.3,0.67,0.31,0.31,0.62,0.07,0.02,0.46,0.52,0.82,0.74,0.74,0.8,0.33,0.73,0.65,0.19,0.9,0.06,0.49,0.36,0.35,0.73,0.5,0.6,0.62,0.84,0.89,0.8,0.87,0.72,0.11,0.75,0.23,0.81,0.08,0.45,0.7,0.65,0.97,0.61,0.95,0.62,0.38,0.54,0.65,0.23,0.97,0.82,0.91,0.75,0.01,0.5,0.19,0.1,0.62,0.41,0.89,0.54,0.67,0.51,0,0.5,0,0.24,0.17,0.32,0.43,0.62,0.86,0.86,0.71,0.3,0.39,0.9,0.93,0.66,0.1,0.87,0.37,0.47,0.92,0.97,0.06,0.06,0.64,0.95,0.7,1,0.13,0.89,0.92,0.02,0.61,0.4,0.7,0.57,0.34,0.25,0.69,0.56,0.65,0.81,0.06,0.91,0.79,0.81,0.81,0.5,0.27,0.22,0.27,0.48,0.09,0.54,0.94,0.37,0.76,0.99,0.81,0.42,0.66,0.5,0.91,0.94,0.56,0.47,0.19,0.01,0.6,0.41,0.31,0.98,0.18,0.8,0.05,0.61,0.5,0.54,0.67,0.51,0.96,0.08,0.68,0.34,0.46,0.38,0.12,0.91,0.93,0.33,0.77,0.44,0.16,0.88,0.36,0.86,0.1,0.57,0.14,0.14,0.18,0.8,0.9,0.63,0.1,0.91,0.16,0.76,0.42,0.26,0.27,0.06,0.68,0.67,0.23,0.99,0.44,0.13,0.47,0.07,0.09,0.29,0.39,0.67,0.1,0.1,0.73,0.47,0.34,0.88,0.26,0.37,0.72,0.27,0.93,0.21,0.24,1,0.21,0.22,0.38,0.85,0.1,0.8,0.21,0.51,0.26,0.25,0.5,0.79,0.12,0.79,0.63,0.46,0.22,0.04,0.95,0.22,0.13,0.43,0.52,0.24,0.97,0.4,0.88,0.87,0.77,0.87,0.09,0.69,0.78,0.84,0.87,0.07,0.25,0.33,0.47,0.83,0.16,0.85,0.25,0.4,0.34,0.75,0.29,0.74,0.06,0.49,0.12,0.9,0.49,0.8,0.23,0.63,0.53,0.39,0.17,0.4,0.47,0.53,0.08,0.63,0.72,0.57,0.62,0.83,0.26,0.68,0.39,0.66,0.61,0.59,0.74,0.62,0.71,0.21,0.87,0.3,0.49,0.81,0.2,0.14,0.91,0.71,0.61,0.99,0.92,0.93,0.5,0.33,0.45,0.61,0.85,0.72,0.33,0.95,0.4,0.76,0.88,0.89,0.05,0.85,0.28,0.74,0.59,0.51,0.94,0.41,0.67,0.36,0.74,0.5,0.67,0.47,0.03,0.14,0.48,0.56,0.74,0.87,0.41,0.11,0.17,0.14,0.71,0.15,0.95,0.59,0.62,0.37,0.61,0.92,0.34,0.34,0.1,0.92,0.9,0.37,0.71,0.74,0.03,0.85,0.99,0.77,0.76,0.2,0.06,0.14,0.34,0.16,0.27,0.31,0.28,0.88,0.69,0.22,0.49,0.83,0.21,0.87,0.99,0.47,0.99,0.94,0.3,0.31,0.33,0.65,0.53,0.13,0.25,0.58,0.01,0.09,0.58,0.13,1,0.73,0.85,0.15,0.32,0.16,0.16,0.73,0.47,0.84,0.31,0.15,0.25,0.68,0.17,0.28,0.86,0.44,0.18,0.04,0.91,0.71,0.81,0.7,0.96,0.75,0.38,0.21,0.52,0.5,0.37,0.85,0.5,0.48,0.86,0.26,0.55,0.45,0.44,0.81,0.49,0.22,0.77,0.81,0.17,0.5,0.47,0.19,0.45,0.42,0.68,0.17,0.52,0.2,0.02,0.07,0.28,0.97,0.31,0.33,0.92,0.47,0.45,0.17,0.71,0.57,0.95,0.07,0.86,0.64,0.07,0.44,0.26,0.55,0.91,0.31,0.99,0.82,0.82,0.72,0.62,0.44,0.63,0.68,0.46,0.51,0.35,0.56,0.14,0.73,0.91,0.01,0.36,0.72,0.67,0.27,0.22,0.81,0.12,0.37,1,0.38,0.36,0.08,0.24,0.97,0.41,0.83,0.13,0.44,0.23,0.72,0.04,0.94,0.98,0.39,0.49,0.95,0.96,0.59,0.95,0.04,0.02,0.86,0.09,0.57,0.84,0.55,0.5,0.37,0.4,0.13,0.99,0.5,0.7,0.35,0.45,0.91,0.29,0.67,0.07,0.94,0.22,0.08,0.84,0.31,0.02,0.25,0.5,0.29,0.67,0.97,0.93,0.94,0.46,0.04,0.16,0.85,0.07,0.49,0.15,0.77,0.24,0.33,0.52,0.11,0.83,0.14,0.04,0.69,0.74,0.17,0.56,0.23,0.85,0.08,0.18,0.3,0.18,0.67,0.02,0.09,0.79,0.4,0.15,0.88,0.88,0.76,0.94,0.29,0.3,0.74,0.1,0.08,0.5,0.69,0.49,0.1,0.08,0.47,0.5,0.52,0.07,0.29,0.93,0.72,0.16,0.17,0.77,0.9,0.51,0.92,0.12,0.21,0.28,0.8,0.59,0.99,0.49,0.55,0.77,0.15,0.94,0.28,0.47,0.97,0.56,0.71,0.58,0.19,0.43,0.77,0.37,0.06,0.11,0.48,0.88,0.16,0.62,0.12,0.68,0.83,0.25,0.1,0.91,0.94,0.6,0.79,0.65,0.44,0.61,0.86,0.38,0.9,0.41,0.42,0.19,0.48,0.34,0.52,0.72,0.27,0.79,0.84,0.79,0.47,0.9,0.26,0.06,0.37,0.02,0.01,0.25,0.69,0.57,0.02,0.59,0.49,0.01,0.87,0.9,0.56,0.16,0.89,0.57,0.71,0.26,0.12,0.15,0.65,0.17,0.74,0.91,0.88,0.61,0.71,0.41,0.64,0.21,0.81,0.45,0.21,0.04,0.85,0.44,0.97,0.08,0.43,0.07,0.76,0.13,0.38,0.3,0.47,0.74,0.33,0.28,0.41,0.04,0.82,0.36,0.63,0.63,0.96,0.23,0.22,0.55,0.69,0.3,0.84,0.05,0.29,0.93,0.88,0.65,0.13,0.06,0.39,0.87,0.02,0.64,0.38,0.43,0.37,0.91,0.65,0.58,0.35,0.03,0.18,0.9,0.29,0.48,0.96,0.48,0.24,0.88,0.26,0.57,0.74,0.54,0.06,0.66,0.74,0.68,0.62,0.83,0.05,0.32,0.23,0.96,0.49,0.26,0.16,0.1,0.04,0.29,0.91,0.51,0.13,0.89,0.55,0.67,0.71,0.8,0.66,0.35,0.82,0.67,0.93,0.56,0.5,0.67,0.38,0.89,0.38,0.62,0.78,0.07,0.12,0.49,0.06,0.85,0.94,0.08,0.02,0.67,0.25,0.2,0.09,0.98,0.28,0.61,0.33,0.12,0.01,0.01,0.89,0.07,0.22,0.73,0.4,0.2,0.64,0.69,0.57,0.56,0.45,0.45,0.76,0.83,0.2,0.59,0.84,0.04,0.97,0.46,0.34,0.49,0.81,0.85,0.08,0.96,0.26,0.49,0.28,0.88,0.17,0.52,0.75,0.17,0.97,0.6,0.17,0.25,0.32,0.19,0.47,0.45,0.88,0.16,0.07,0.87,0.24,0.44,0.95,0.74,0.16,0.31,0.89,0.79,0.54,0.32,0.47,0.74,0.39,0.76,0.64,0.25,0.88,0.13,0.64,0.29,0.58,0.46,0.06,0.75,0.08,0.77,0.13,0.44,0.84,0.74,0.93,0.51,0.83,0.7,0.7,0.51,0.01,0.5,0.51,0.99,1,0.09,0.56,0.9,0.12,0.79,0.82,0.93,0.94,0.3,0.81,0.46,0.21,0.09,0.23,0.52,0.82,0.01,0.79,0.57,0.09,0.06,0.97,0.57,0.03,0.05,0.01,0.67,0.23,0.72,0.2,0.87,0.25,0.69,0.25,0.2,0.53,0.36,0.16,0.88,0.02,0.5,0.36,0.43,0.77,0.46,0.34,0.95,0.07,0.56,0.79,0.89,0.82,0.74,0.35,0.93,0.35,0.79,0.33,0.03,0,0.57,0.97,0.82,0.37,0.3,0.38,0.65,0.05,0.62,0.5,0.66,0,0.67,0.27,0.41,0.62,0.6,0.5,0.12,0.76,0.65,0.87,0.95,0.61,0.04,0.67,0.67,0.99,0.72,0.62,0.17,0.35,0.4,0.16,0.55,0.3,0.68,0.69,0.92,0.45,0.87,0.26,0.91,0.3,0.49,0.83,0.83,0.38,0.61,0.4,0.99,0.12,0.61,0.8,0.89,0.94,0.56,0.6,0.29,0.96,0.18,0.55,0.03,0.5,0.54,0.93,0.95,0.94,0.04,0.97,0.53,0.55,0.86,0.77,0.14,0.15,0.73,0.94,0.8,0.01,0.62,0.02,0.44,0.46,0.04,0.03,0.05,0.28,0.94,0.67,0.09,0.51,0.16,0.31,0.41,0.08,0.37,0.32,0.62,0.35,0.67,0.09,0.89,0.56,0.8,0.3,0.46,0.02,0.55,0.5,0.72,0.64,0.53,0.44,0.07,0.94,0.61,0.81,0.38,0.76,0.13,0.52,0.11,0.02,0.48,0.26,0.2,0.01,0.69,0.85,0.22,0.56,0.61,0.81,0.15,0.71,0.84,0.49,0.84,0.25,0.58,0.94,0.69,1,0.59,0.13,0.77,0.2,0.49,0.41,0.77,0.95,0.49,0.41,0.89,0.16,0.53,0.07,0.09,0.94,0.85,0.73,0.86,0.05,0.5,0.76,0.26,0.57,0.04,0.73,0.59,0.22,0.08,0.05,0.35,0.57,0.6,0.5,0.33,0.38,0.43,0.52,0.39,0.23,0.47,0.04,0.66,0.67,0.82,0.76,0.94,0.88,0.58,0.3,0.33,0,0.29,0.96,0.22,0.59,0.68,0.5,0.13,0.32,0.29,0.27,0.97,0.68,0.58,0.35,0.6,0.08,0.43,0.78,0.94,0.93,0.29,0.75,0.48,0.6,0.74,0.59,0.19,0.08,0.55,0.1,0.54,0.53,0.02,0.39,0.98,0.53,0.03,0.13,0.98,0.31,0.17,0.22,0.59,0.34,0.18,0.77,0.97,0.37,1,0.72,0.84,0.31,0.75,0.66,0.94,0.97,0.01,0.92,0.48,0.31,0.43,0.93,0.79,0.85,0.25,0.54,0.16,0.92,0.37,0.64,0.63,0.39,0.19,0.36,0.2,0.9,0.92,0.35,0.89,0.88,0.41,0.75,0.99,0.73,0.11,0.12,0.23,0.08,0.95,0.29,0.87,0.78,0.97,0.11,0.56,0.93,0.15,0.06,0.02,0.68,0.82,0.31,0.13,0.41,0.33,0.85,0.82,0.96,0.92,0.55,0.27,0.15,0.94,0.82,0.4,0.52,0.31,0.73,0.25,0.68,0.19,0.76,0.78,0.71,0.73,0.4,0.85,0.09,0.68,0.2,0.16,0.59,0.35,0.88,0.7,0.78,0.86,0.03,0.59,0.39,0.58,0.8,0.67,0.14,0.84,0.28,0.02,0.89,0.16,0.73,0.58,0.55,0.21,0.73,0.75,0.82,0.29,0.63,0.36,0.21,0.53,0.46,0.57,0.61,0.54,0.75,0.52],
      filter: { 'source': pdfurl, },
      topK: 10,
      includeMetadata: true,
    });
    console.log(queryResponse);
    
    await index.deleteMany({
      'source': pdfurl,
    });

    
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