"use client";
import React, { useState, useEffect } from 'react';

// positive reaction images 
import blush from "../../public/images/pos/blush.png";
import flushed from "../../public/images/pos/flushed.png";
import happy from "../../public/images/pos/happy.png";
import happyevil from "../../public/images/pos/happyevil.png";
import happynaps from "../../public/images/pos/happynaps.png";
import smug from "../../public/images/pos/smug.png";
import wow from "../../public/images/pos/wow.png";

// negative reaction images
import cry from "../../public/images/neg/cry.png";
import derp from "../../public/images/neg/derp.png";
import dizzy from "../../public/images/neg/dizzy.png";
import mad from "../../public/images/neg/mad.png";
import shocked from "../../public/images/neg/shocked.png";
import smugevil from "../../public/images/neg/smugevil.png";
import tired from "../../public/images/neg/tired.png";

export default function Landing() {
  const [status, setStatus] = useState({
    is_live: false,
    stream_url: null,
    last_stream_end: null,
    time_since_end: null
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/status`);
      if (!response.ok) throw new Error('Failed to fetch status');
      const data = await response.json();
      setStatus(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch stream status');
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 60000); // Poll every minute
    return () => clearInterval(interval);
  }, []);

  const formatTimeSince = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m without Nimi`;
  };

  // Image logic

  const [image, setImage] = useState(null);
  const [comment, setComment] = useState(null);
  const posImg = [
    [blush, "omg what a cute live tapir! go watch now!"],
    [flushed, "nimi? sorry, nimi? sorry, nimi? sorry-"],
    [happy, "cute nimi live now! come watch!!"],
    [happyevil, "cute nimi live now! you WILL watch"],
    [happynaps, "hey, that's us! come watch with the rest of us!"],
    [smug, "CLEARLY you're not watching the nimi stream"],
    [wow, "NIMI? LIVE? RIGHT NOW??? YAYYYYYYYY"],
  ];
  const negImg = [
    [cry, "i miss nimi... where's nimi..."],
    [derp, "my brain short-circuiting when no nimi"],
    [dizzy, "1 second without nimi has me confused"],
    [mad, "streamer stream! encore! but like for streams!"],
    [shocked, "where is my sunshine i cannot find the nimi stream"],
    [smugevil, "CLEARLY you miss nimi"],
    [tired, "me when it's not NST... need nimium"],
  ];

  function getRandomNumber() { // hard coded for number of images in each folder
    return Math.floor(Math.random() * 7);
  }

  function getImageComment(is_live){
    var imgCom;
    if(is_live){ return posImg[getRandomNumber()] } 
    else { return negImg[getRandomNumber()] }

  }

  useEffect(() => {
    const [img, com] = getImageComment(status.is_live);
    setImage(img);
    setComment(com);
  }, [status.is_live])

  if (loading) return <p className='flex flex-grow flex-col justify-self-center'>Loading...</p>

  return (
    <main className="flex-grow flex flex-col justify-evenly text-center items-center">
      <h1 className='text-5xl font-bold text-[#4f6d59] drop-shadow-lg'>Where's Nimi?</h1>
      <div>
        {/* <img src={image} className="aspect-auto min-w-[400px] min-h-[400px] sm:max-w-[400px] sm:max-h-[429px] justify-self-center"/> */}
        <img src={image} className='aspect-auto max-w-[400px]'/>
        <p className='pt-3'>{comment}</p>
      </div>
      <div className="bg-[#99DBE1] w-[300px] sm:w-1/2 py-5 rounded-lg drop-shadow-lg">
      {!status.is_live && status.last_stream_end && (
          <p className="mt-2 text-gray-600">
              {formatTimeSince(status.time_since_end)}
          </p>
      )}
      {status.is_live && status.stream_url && (
          <div>
              <div className="flex items-center gap-2 justify-self-center">
                <span className={`h-3 w-3 rounded-full ${
                  status.is_live ? 'bg-red-500' : 'bg-gray-500'
                }`} />
                <span className="font-medium">
                  {status.is_live ? 'LIVE NOW' : 'Offline'}
                </span>
              </div>
              <a
                  href={status.stream_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 text-blue-500 hover:underline block justify-self-center"
              >
                  Watch Stream
              </a>
              
          </div>
      )}
      </div>
      {error && (
      <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
      </div>
      )}
    </main>
  );
};
