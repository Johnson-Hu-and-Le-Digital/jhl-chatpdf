// import { ChatOpenAI } from 'langchain/chat_models/openai';
import { ChatOpenAI } from '@langchain/openai';
// import { ChatPromptTemplate } from 'langchain/prompts';
import { ChatPromptTemplate } from '@langchain/core/prompts';
// import { RunnableSequence } from 'langchain/schema/runnable';
import { RunnableSequence } from '@langchain/core/runnables';
// import { StringOutputParser } from 'langchain/schema/output_parser';
import { StringOutputParser } from '@langchain/core/output_parsers';
import type { Document } from 'langchain/document';
// import type { VectorStoreRetriever } from 'langchain/vectorstores/base';
import type { VectorStoreRetriever } from '@langchain/core/vectorstores';

const combineDocumentsFn = (docs: Document[], separator = '\n\n' as any) => {
  const serializedDocs = docs.map((doc) => doc.pageContent);
  return serializedDocs.join(separator);
};

export const makeChain = (retriever: VectorStoreRetriever, additional: string) => {

  const CONDENSE_TEMPLATE = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.
  ${additional}

  <chat_history>
    {chat_history}
  </chat_history>

  Follow Up Input: {question}
  Standalone question:`;

  const QA_TEMPLATE = `You are an expert researcher. Use the following pieces of context to answer the question at the end.
  If you don't know the answer, just say you don't know. DO NOT try to make up an answer.
  If the question is not related to the context or chat history, politely respond that you are tuned to only answer questions that are related to the context.
  ${additional}

  <context>
    {context}
  </context>

  <chat_history>
    {chat_history}
  </chat_history>

  Question: {question}
  Helpful answer in markdown:`;

  const condenseQuestionPrompt =
    ChatPromptTemplate.fromTemplate(CONDENSE_TEMPLATE);
  const answerPrompt = ChatPromptTemplate.fromTemplate(QA_TEMPLATE);

  const model = new ChatOpenAI({
    temperature: 0, // increase temperature to get more creative answers
    modelName: 'gpt-4', //change this to gpt-4 if you have access
    // prefixMessages: [
    //   {
    //     "role" : "system",
    //     "content": "You are a helpful translator. Translate the user sentence to French.",
    //   },
    //   {
    //     "role" : "user",
    //     "content" : "I love programming.",
    //   },
    //   {
    //     "role" : "assistant",
    //     "content" : ""
    //   }
    // ]
  });

  // Rephrase the initial question into a dereferenced standalone question based on
  // the chat history to allow effective vectorstore querying.
  const standaloneQuestionChain = RunnableSequence.from([
    condenseQuestionPrompt,
    model,
    new StringOutputParser(),
  ]);

  // Retrieve documents based on a query, then format them.
  const retrievalChain = retriever.pipe(combineDocumentsFn);

  // Generate an answer to the standalone question based on the chat history
  // and retrieved documents. Additionally, we return the source documents directly.
  const answerChain = RunnableSequence.from([
    {
      context: RunnableSequence.from([
        (input) => input.question,
        retrievalChain,
      ]),
      chat_history: (input) => input.chat_history,
      question: (input) => input.question,
    },
    answerPrompt,
    model,
    new StringOutputParser(),
  ]);

  // First generate a standalone question, then answer it based on
  // chat history and retrieved context documents.
  const conversationalRetrievalQAChain = RunnableSequence.from([
    {
      question: standaloneQuestionChain,
      chat_history: (input) => input.chat_history,
    },
    answerChain,
  ]);

  return conversationalRetrievalQAChain;
};
