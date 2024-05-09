import { useRef, useState, useEffect } from 'react';
import Layout from '@/components/layout';
import styles from '@/styles/Home.module.css';
// import fonts from '@/styles/fonts.module.css';
// import indexcss from '@/styles/index.module.css';
import { Message } from '@/types/chat';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import LoadingDots from '@/components/ui/LoadingDots';
import { Document } from 'langchain/document';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function Home() {
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [messageState, setMessageState] = useState<{
    messages: Message[];
    pending?: string;
    history: [string, string][];
    pendingSourceDocs?: Document[];
  }>({
    messages: [
      {
        message: 'Hi, what would you like to learn about this document?',
        type: 'apiMessage',
      },
    ],
    history: [],
  });

  const { messages, history } = messageState;

  const messageListRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  //handle form submission
  async function handleSubmit(e: any) {
    e.preventDefault();

    setError(null);

    if (!query) {
      alert('Please input a question');
      return;
    }

    const question = query.trim();

    setMessageState((state) => ({
      ...state,
      messages: [
        ...state.messages,
        {
          type: 'userMessage',
          message: question,
        },
      ],
    }));

    setLoading(true);
    setQuery('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          history,
        }),
      });
      const data = await response.json();
      console.log('data', data);

      if (data.error) {
        setError(data.error);
      } else {
        setMessageState((state) => ({
          ...state,
          messages: [
            ...state.messages,
            {
              type: 'apiMessage',
              message: data.text,
              sourceDocs: data.sourceDocuments,
            },
          ],
          history: [...state.history, [question, data.text]],
        }));
      }
      console.log('messageState', messageState);

      setLoading(false);

      //scroll to bottom
      messageListRef.current?.scrollTo(0, messageListRef.current.scrollHeight);
    } catch (error) {
      setLoading(false);
      setError('An error occurred while fetching the data. Please try again.');
      console.log('error', error);
    }
  }

  //prevent empty submissions
  const handleEnter = (e: any) => {
    if (e.key === 'Enter' && query) {
      handleSubmit(e);
    } else if (e.key == 'Enter') {
      e.preventDefault();
    }
  };


  return (
    <>
      <Layout>
      <div id="page-top" className="index page">
      <section className='left-panel pt-4 pb-5'>
        <div className="container">
            <div className="row justify-content-center align-items-center">
                <div className="col-12 col-lg-11">
                    <img src="/images/logo-2.svg" style={{width: '93px'}} />
                </div>
                <div className="col-12 col-lg-11 pt-5">
                    <div className="font-size-16 font-Poppins-Medium text-line-height-20 color-purple-2">home / directory / directory1 /  directory2</div>
                    <div className="form-check pt-4">
                        <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                        <label className="form-check-label">
                            Include subdirectory content?
                        </label>
                    </div>
                    <div className="font-size-16 font-Poppins-Regular text-line-height-20 color-purple-2 pt-4">Analyzing current director or upload your own PDF for analysis</div>
                    <div className="font-size-16 font-Poppins-SemiBold text-line-height-20 color-blue pt-4">... / Directory 2 /</div>
                    <div className="upDirectory">
                        <hr />
                        <div className="previous flist"><span className="before"></span> Up directory</div>
                    </div>
                    <div className="directoryList">
                        <hr />
                        <div className="directory flist"><span className="before"></span> Directory 3</div>
                        
                    </div>
                    <div className='pdfListBox'>
                      <div className="pdfList" id="filename_1">
                          <hr />
                          <div className="pdf-file flist"><span className="before"></span> pdf filename_1.pdf <span className="after delete-btn"></span></div>
                      </div>
                      <div className="pdfList" id="filename_2">
                          <hr />
                          <div className="pdf-file flist"><span className="before"></span> pdf filename_2.pdf <span className="after delete-btn"></span></div>
                      </div>
                    </div>
                    <div className="mt-4" id="drop_area">Drag PDF to upload <br />to selected directory</div>
                    <div className="form-check pt-4">
                        <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                        <label className="form-check-label">
                            Override and upload to my personal directory user.documents
                        </label>
                    </div>
                </div>
            </div>
        </div>
      </section>
      <section className="right-panel">
        <div className="top-panel pt-5 pb-5">
            <div className="container">
                <div className="row justify-content-center align-items-center">
                    <div className="col-12 col-lg-9">
                        <div className="title">Introducing the <span>AIAnalyzer</span></div>
                        
                        <main className={styles.main}>
                          <div className={styles.cloud} style={{width: '100%'}}>
                            <div ref={messageListRef} className={styles.messagelist}>
                              {messages.map((message, index) => {
                                let icon;
                                let className;
                                if (message.type === 'apiMessage') {
                                  icon = (
                                    <Image
                                      key={index}
                                      src="/bot-image.svg"
                                      alt="AI"
                                      width="40"
                                      height="40"
                                      className={styles.boticon}
                                      priority
                                    />
                                  );
                                  className = styles.apimessage;
                                } else {
                                  icon = (
                                    <Image
                                      key={index}
                                      src="/user-icon.svg"
                                      alt="Me"
                                      width="30"
                                      height="30"
                                      className={styles.usericon}
                                      priority
                                    />
                                  );
                                  // The latest message sent by the user will be animated while waiting for a response
                                  className =
                                    loading && index === messages.length - 1
                                      ? styles.usermessagewaiting
                                      : styles.usermessage;
                                }
                                return (
                                  <>
                                    <div key={`chatMessage-${index}`} className={className}>
                                      {icon}
                                      <div className={styles.markdownanswer}>
                                        <ReactMarkdown linkTarget="_blank">
                                          {message.message}
                                        </ReactMarkdown>
                                      </div>
                                    </div>
                                    {message.sourceDocs && (
                                      <div
                                        className="p-5"
                                        key={`sourceDocsAccordion-${index}`}
                                      >
                                        <Accordion
                                          type="single"
                                          collapsible
                                          className="flex-col"
                                        >
                                          {message.sourceDocs.map((doc, index) => (
                                            <div key={`messageSourceDocs-${index}`}>
                                              <AccordionItem value={`item-${index}`}>
                                                <AccordionTrigger>
                                                  <h3>Source {index + 1}</h3>
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                  <ReactMarkdown linkTarget="_blank">
                                                    {doc.pageContent}
                                                  </ReactMarkdown>
                                                  <p className="mt-2">
                                                    <b>Source:</b> {doc.metadata.source}
                                                  </p>
                                                </AccordionContent>
                                              </AccordionItem>
                                            </div>
                                          ))}
                                        </Accordion>
                                      </div>
                                    )}
                                  </>
                                );
                              })}
                            </div>
                          </div>
                          <div className={styles.center} style={{width: '100%'}}>
                            <div className={styles.cloudform} style={{width: '100%'}}>
                              <form onSubmit={handleSubmit}>
                                <textarea
                                  disabled={loading}
                                  onKeyDown={handleEnter}
                                  ref={textAreaRef}
                                  autoFocus={false}
                                  rows={1}
                                  maxLength={512}
                                  id="userInput"
                                  name="userInput"
                                  placeholder={
                                    loading
                                      ? 'Waiting for response...'
                                      : 'Message AIAnalyzer ...'
                                  }
                                  value={query}
                                  onChange={(e) => setQuery(e.target.value)}
                                  className={styles.textarea}
                                  style={{width: '100%'}}
                                />
                                <button
                                  type="submit"
                                  disabled={loading}
                                  className='form_generatebutton'
                                >
                                  {loading ? (
                                    <div className={styles.loadingwheel}>
                                      <LoadingDots color="#000" />
                                    </div>
                                  ) : (
                                    // Send icon SVG in input field
                                    // <svg
                                    //   viewBox="0 0 20 20"
                                    //   className={styles.svgicon}
                                    //   xmlns="http://www.w3.org/2000/svg"
                                    // >
                                    //   <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                                    // </svg>
                                    <span className='bor'></span>
                                  )}
                                </button>
                              </form>
                            </div>
                          </div>
                          {error && (
                            <div className="border border-red-400 rounded-md p-4">
                              <p className="text-red-500">{error}</p>
                            </div>
                          )}
                        </main>
                    </div>
                </div>
            </div>
            <div className="pt-5"></div>
        </div>
        <div className="panel-form pt-5 pb-5">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="title">Contact JHL Advanced</div>
                    </div>
                    <div className="col-12 col-md-4 pt-4">
                        <div className="form-group">
                            <input type="text" className="form-control" id="yourname" placeholder="Your Name"  />
                        </div>
                        <div className="error-msg pt-3" id="your_name_error" style={{display: 'none'}}>Please fill your name.</div>
                        
                        <div className="form-group pt-4">
                            <input type="text" className="form-control" id="phone_number" placeholder="Your Phone Number"  />
                        </div>
                        <div className="error-msg pt-3" id="phone_number_error" style={{display: 'none'}}>Please fill your phone number.</div>
        
                        <div className="form-group pt-4">
                            <input type="text" className="form-control" id="email_address" placeholder="Your Email Address"  />
                        </div>
                        <div className="error-msg pt-3" id="email_error" style={{display: 'none'}}>Please fill your email address.</div>
                    </div>
                    <div className="col-12 col-md-8 pt-4">
                        <div className="font-roc-grotesk-wide-Regular font-size-16 text-line-height-18 color-shallow-blue">I am interested in engaging JHL for:</div>
                        <div className="pt-4">
                            <a className="sel-item item-1" data-value="RX STRATEGY">RX STRATEGY</a>
                            <a className="sel-item item-2" data-value="CLM">CLM</a>
                            <a className="sel-item item-3" data-value="UI/UX DESIGN">UI/UX DESIGN</a>
                            <a className="sel-item item-4" data-value="APPS">APPS</a>
                            <a className="sel-item item-5" data-value="CONFERENCE STANDS">CONFERENCE STANDS</a>
                            <a className="sel-item item-6" data-value="EMAIL MARKETING">EMAIL MARKETING</a>
                            <a className="sel-item item-7" data-value="MARKETING MATERIALS">MARKETING MATERIALS</a>
                            <a className="sel-item item-8" data-value="VIRTUAL REALITY">VIRTUAL REALITY</a>
                            <a className="sel-item item-9" data-value="SOCIAL MEDIA CAMPAIGN">SOCIAL MEDIA CAMPAIGN</a>
                            <a className="sel-item item-10" data-value="PATIENT KIT">PATIENT KIT</a>
                        </div>
                        <div className="row justify-content-center align-items-end">
                            <div className="col-12 col-md-8">
                                <div className="form-group pt-2">
                                    <input type="text" className="form-control" id="other" placeholder="Other (please specify)" />
                                </div>
                            </div>
                            <div className="col-12 col-md-4 text-end">
                                <a className="btn send-btn font-uppercase mt-3" id="send">Send<span className="icon"></span></a>
                            </div>
                            <div className="col-12 text-end">
                                <div className="success-msg pt-3 text-end" style={{display: 'none'}}>Submitted successfully.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    </div>
      </Layout>
    </>
  );
}
