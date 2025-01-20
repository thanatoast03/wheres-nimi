"use client";
import React, { useState, useEffect } from 'react';
import doodle from "../../public/images/doodleLMFAO.png";

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

  if (loading) return <p>Loading...</p>

  return (
    <main className="flex-grow flex flex-col justify-evenly text-center items-center">
        <img src={doodle} className="w-[300px] h-[300px] sm:w-[512px] sm:h-[512px] justify-self-center"/>
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
