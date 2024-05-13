import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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

export default function Index() {
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
        message: 'What would you like to learn about this library?',
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
      // console.log(messageListRef.current.scrollHeight);
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
  
  const router = useRouter();
  const handleChange = (event: any) => {
    // console.log(event.target.value);
    router.push(event.target.value);
  };

  const [url, setUrl] = useState('');
  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  let refNum = 0;
  let refRrray: any[] = new Array();

  const [yourname, setYourname] = useState<string>('');
  const [isNameError, setIsNameError] = useState(false);
  const [phonenumber, setPhonenumber] = useState<string>('');
  const [isPhoneError, setIsPhoneError] = useState(false);
  const [email, setEmail] = useState<string>('');
  const [isEmailError, setIsEmailError] = useState(false);
  const [otherMessage, setOtherMessage] = useState<string>('');

  function removeElement<T>(arr: T[], element: T): T[] {
    if (arr.includes(element)) {
        return arr.filter(e => e !== element);
    }
    return arr;
  }

  let selectedValues: any[] = new Array();
  const handleSelectClick = (event: any) => {
    // const dataValue = event.target.getAttribute('data-value');
    if(event.target.classList.contains('active')){
      event.target.classList.remove('active');
      // selectedValues = removeElement(selectedValues, dataValue);
    }else{
      event.target.classList.add('active');
      // selectedValues.push(dataValue);
    }
    // console.log(selectedValues);
    // // console.log(selectedValues.join(','));

    // var activeLinks = document.getElementsByClassName('sel-item active');
    // // console.log(activeLinks);
    // for(var item of activeLinks){
    //   console.log(item.getAttribute('data-value'));
    // }
  };

  const [isSendSuccess, setSendSuccess] = useState(false);
  const [isSendError, setSendError] = useState(false);
  const [sendLoading, setSendLoading] = useState<boolean>(false);

  async function handleSendEmail(e: any) {
    e.preventDefault();
    setSendSuccess(false);
    setSendError(false);
    setSendLoading(true);

    setIsNameError(false);
    setIsPhoneError(false);
    setIsEmailError(false);

    let flag = true;
    if (!yourname) {
      setIsNameError(true);
      flag = false;
    }
    if (!phonenumber) {
      setIsPhoneError(true);
      flag = false;
    }
    if (!email) {
      setIsEmailError(true);
      flag = false;
    }

    let interested_engaging: any[] = new Array();
    var activeLinks = document.getElementsByClassName('sel-item active');
    for(var item of activeLinks){
      var value = item.getAttribute('data-value');
      interested_engaging.push(value);
    }
    // console.log(interested_engaging);
    // console.log(interested_engaging.join(','));
    if(flag){
      try {
        const data = {
          yourname: yourname,
          phonenumber: phonenumber,
          email: email,
          interested_engaging: interested_engaging.join(','),
          otherMessage: otherMessage
        }
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
    
        const body = await res.json();
    
        if (res.ok) {
          // alert(`${body.message} 🚀`);
          setSendSuccess(true);
          setSendLoading(false);
        }
    
        if (res.status === 400) {
          // alert(`${body.message} 😢`);
          setSendError(true);
          setSendLoading(false);
        }
      } catch (err) {
        setSendError(true);
        setSendLoading(false);
        console.log('Something went wrong: ', err);
      }
    }else{
      setSendLoading(false);
    }
  }

  return (
    <>
      <Layout>
      <div id="page-top" className="index page">
      <section className='left-panel pt-4 pb-5'>
        <div className="container">
            <div className="row justify-content-center align-items-center">
                <div className="col-12 col-lg-11">
                    {/* <img src="/images/logo-2.svg" style={{width: '93px'}} /> */}
                    <Image
                      src="/images/logo-2.svg"
                      alt="JHL"
                      width={0}
                      height={0}
                      style={{ width: '93px', height: 'auto' }}
                    />
                </div>
                <div className="col-12 col-lg-11 pt-5">
                    <div className="font-size-16 font-Poppins-Medium text-line-height-20 color-purple-2">home / directory / directory1 /  directory2</div>
                    <div className="form-check pt-4">
                        <input className="form-check-input" type="checkbox" value="" id="check_1" />
                        <label className="form-check-label">
                            Include subdirectory content?
                        </label>
                    </div>
                    <div className="font-size-16 font-Poppins-Regular text-line-height-20 color-purple-2 pt-4">Analyzing current directory or upload your own PDF for analysis</div>
                    <div className="font-size-16 font-Poppins-Bold text-line-height-20 color-blue pt-4">... / Directory 2 /</div>
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
                        <input className="form-check-input" type="checkbox" value="" id="check_2" />
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
                      <select onChange={handleChange} id="selectWebsite" className="form-select" style={{width: 'auto'}} value={url}>
                        <option value="http://gsk-chatpdf-bexsero.jhldigital.com/">Bexsero</option>
                        <option value="http://gsk-chatpdf-shingrix.jhldigital.com/">Shingrix</option>
                        <option value="http://gsk-chatpdf-twinrix.jhldigital.com/">Twinrix</option>
                      </select>
                      {/* <input type='hidden' value={url} /> */}
                        <div className="title mt-4">JHL <span>Literature Explorer</span></div>
                        <main className={styles.main}>
                          <div className={styles.cloud} style={{width: '100%'}}>
                            <div ref={messageListRef} className={styles.messagelist} id='messageList'>
                              {messages.map((message, index) => {
                                let icon;
                                let className;
                                if (message.type === 'apiMessage') {
                                  icon = (
                                    <Image
                                      key={index}
                                      src="/bot-image-3.png"
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
                                      width="40"
                                      height="40"
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
                                        className="references-box"
                                        key={`sourceDocsAccordion-${index}`}
                                      >
                                        <div className='references-title'>References: </div>
                                          
                                          {message.sourceDocs.map((doc, index, array) => {
                                            const ref = doc.metadata.source;
                                            console.log('-----T-------');
                                            console.log(ref);
                                            console.log(refRrray);
                                            console.log(refRrray.includes(ref));
                                            if(!refRrray.includes(ref)){
                                              console.log('num: -----'+refNum);
                                              refRrray.push(ref);
                                              refNum = refNum + 1;
                                              console.log('num: ====='+refNum);
                                              return <div key={`messageSourceDocs-${index}`}>
                                                <p className="mt-1">
                                                  {refNum}. {doc.metadata.source}
                                                </p>
                                              </div>;
                                            }
                                            if(array.at(-1) === doc){
                                              refNum = 0;
                                              refRrray = new Array();
                                            }
                                            console.log('result num: '+refNum);
                                            console.log('result refRrray'+refRrray);
                                            console.log('-----Te-------');
                                          })
                                          }
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
                                      : 'Ask me…'
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
              <form onSubmit={handleSendEmail}>
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-11">
                        <div className="title">Contact JHL Advanced</div>
                    </div>
                    <div className="col-12 col-lg-3 pt-4">
                        <div className="form-group">
                            <input type="text" className="form-control" id="yourname" placeholder="Your Name" autoComplete='off'
                              value={yourname}
                              onChange={(e) => setYourname(e.target.value)}  />
                        </div>
                        {isNameError && <div className="error-msg pt-3" id="your_name_error">Please fill your name.</div>}
                        
                        <div className="form-group pt-4">
                            <input type="text" className="form-control" id="phone_number" placeholder="Your Phone Number" autoComplete='off'
                              value={phonenumber}
                              onChange={(e) => setPhonenumber(e.target.value)}  />
                        </div>
                        {isPhoneError && <div className="error-msg pt-3" id="phone_number_error">Please fill your phone number.</div>}
        
                        <div className="form-group pt-4">
                            <input type="text" className="form-control" id="email_address" placeholder="Your Email Address" autoComplete='off'
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}  />
                        </div>
                        {isEmailError && <div className="error-msg pt-3" id="email_error">Please fill your email address.</div>}
                    </div>
                    <div className="col-12 col-lg-8 pt-4">
                        <div className="font-Poppins-Medium font-size-16 text-line-height-18 color-white">I am interested in engaging JHL for:</div>
                        <div className="pt-4">
                            <a onClick={handleSelectClick} className="sel-item item-1" data-value="RX STRATEGY">RX STRATEGY</a>
                            <a onClick={handleSelectClick} className="sel-item item-2" data-value="CLM">CLM</a>
                            <a onClick={handleSelectClick} className="sel-item item-3" data-value="UI/UX DESIGN">UI/UX DESIGN</a>
                            <a onClick={handleSelectClick} className="sel-item item-4" data-value="APPS">APPS</a>
                            <a onClick={handleSelectClick} className="sel-item item-5" data-value="CONFERENCE STANDS">CONFERENCE STANDS</a>
                            <a onClick={handleSelectClick} className="sel-item item-6" data-value="EMAIL MARKETING">EMAIL MARKETING</a>
                            <a onClick={handleSelectClick} className="sel-item item-7" data-value="MARKETING MATERIALS">MARKETING MATERIALS</a>
                            <a onClick={handleSelectClick} className="sel-item item-8" data-value="VIRTUAL REALITY">VIRTUAL REALITY</a>
                            <a onClick={handleSelectClick} className="sel-item item-9" data-value="SOCIAL MEDIA CAMPAIGN">SOCIAL MEDIA CAMPAIGN</a>
                            <a onClick={handleSelectClick} className="sel-item item-10" data-value="PATIENT KIT">PATIENT KIT</a>
                        </div>
                        <div className="row justify-content-center align-items-end">
                            <div className="col-12 col-md-8">
                                <div className="form-group pt-2">
                                    <input type="text" className="form-control" id="other" placeholder="Other (please specify)" autoComplete='off'
                                      value={otherMessage}
                                      onChange={(e) => setOtherMessage(e.target.value)}  />
                                </div>
                            </div>
                            <div className="col-12 col-md-4 text-end">
                                <button type='submit' className="btn send-btn font-uppercase mt-3" id="send"
                                  disabled={sendLoading}>Send<span className="icon"></span>
                                  {sendLoading ? (
                                    <div className='loadingwheel'>
                                      <LoadingDots color="#000" />
                                    </div>
                                  ) : (
                                    <span className='bor'></span>
                                  )}
                                  </button>
                            </div>
                            <div className="col-12 text-end">
                                {isSendSuccess && <div className="success-msg pt-3 text-end">Submitted successfully.</div>}
                                {isSendError && <div className="error-msg pt-3 text-end">Something went wrong, Please try again later.</div>}
                            </div>
                        </div>
                    </div>
                </div>
                </form>
            </div>
        </div>
    </section>
    </div>
      </Layout>
    </>
  );
}
