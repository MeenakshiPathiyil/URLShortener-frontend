// @ts-ignore
'use client'
import React, { useState,useEffect }from 'react';
import axios from 'axios';

let longUrlInput: HTMLInputElement | null = null;
const YourComponent = () => {
  console.log("YourComponent rendered")
  const [shortenedUrl, setShortenedUrl] = React.useState('');
  const [deletionMessage, setDeletionMessage] = useState('');
  const [inputValue, setInputValue] = useState('');

  const handleInputRef = (input: HTMLInputElement | null) => {
    console.log("Input recieved")
    longUrlInput = input;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("handleSubmit entered")
    e.preventDefault();
    try {
      if (longUrlInput?.value) {
        const response = await axios.post('http://localhost:8000/shorten_url', { url: longUrlInput.value });
        setShortenedUrl(response.data.shortened_url);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.delete(`http://localhost:8000/delete_url/`, {data: {url: inputValue}});
      setDeletionMessage(response.data.message);
      forceUpdate();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const RedirectComponent = () => {
    useEffect(() => {
      const fetchRedirect = async () => {
        const pathname = window.location.pathname; 
        const shortHash = pathname.substring(1); 
  
        if (!shortHash) return; 
  
        try {
          const response = await axios.get(`http://localhost:8000/${shortHash}/`);
          const originalUrl = response.data.original_url;
          window.location.href = originalUrl; 
        } catch (error) {
          console.error('Redirection Error:', error);
        }
      };
  
      fetchRedirect();
    }, []);
  
    return null; 
  };
  
  

  const forceUpdate = () => {
    setUpdate({});
  }

  const [update, setUpdate] = React.useState({});

  {console.log("html")}
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500">
      <h1 className="font-serif text-5xl">URL Shortener</h1>
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="flex flex-row items-center justify-center space-x-4">
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Enter the URL" ref={handleInputRef} className="w-80 p-3 rounded-lg border border-black focus:outline-none focus:border-black bg-gray-700 text-gray-300" />
            <button type="submit" className=" font-serif w-20 p-3 rounded-lg border border-gray-400 bg-gray-400 text-gray-950 ml-4 md-1">Submit</button>
          </form>
        </div>
        <div className="flex flex-col items-center justify-center">
          {shortenedUrl && <p className="text-gray-900">Shortened URL: {shortenedUrl}</p>}
        </div>
      </div>
      <div className="flex flex-col items-enter justify-center">
        <div className="flex flex-row items-center justify-center">
          <form onSubmit={handleDelete}>
            <input type="text" placeholder="Enter the URL" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="w-80 p-3 rounded-lg border border-black focus:outline-none focus:border-black bg-gray-700 text-gray-300" />
            <button type="submit" className="font-serif w-20 p-3 rounded-lg border border-gray-400 bg-gray-400 text-gray-950 ml-4 md-1">Delete</button>
          </form>
        </div>
        <div className="flex flex-row items-center justify-center">
          {deletionMessage && <p className="font-serif text-gray-900">Message: {deletionMessage}</p>}
        </div>
      </div>
      <div>
        <RedirectComponent/>
      </div>
    </main>
  );
};


export default YourComponent;
