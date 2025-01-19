# backend/app.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import asyncio, re, requests
from bs4 import BeautifulSoup
from datetime import datetime
from typing import Optional

# Single channel state
class StreamState:
    def __init__(self):
        self.is_live: bool = False
        self.stream_url: Optional[str] = None
        self.last_stream_end: Optional[datetime] = None

stream_state = StreamState()
CHANNEL = "https://www.youtube.com/@niminightmare" 

@asynccontextmanager
async def lifespan(app: FastAPI):
    asyncio.create_task(monitor_stream())
    yield

app = FastAPI(lifespan=lifespan)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://wheres-nimi.vercel.app"],  # Replace with your Vercel domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def check_if_live() -> tuple[bool, Optional[str]]:
    """
    Check if a YouTube channel is currently live streaming.
    Works with channel URLs, handles, or custom URLs.
    
    Args:
        channel_url (str): Full channel URL or just the channel name/handle
    
    Returns:
        tuple: (is_live, stream_url) if successful, (False, None) if not live or error
    """
    try:
        # Ensure we have a full URL
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9',
        }
        
        # Get the channel page
        response = requests.get(CHANNEL, headers=headers)
        if response.status_code != 200:
            print(f"Failed to access channel. Status code: {response.status_code}")
            return False, None
            
        # Look for live stream indicators
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Method 1: Look for live stream links
        for link in soup.find_all('link'):
            if link.get('rel') == ['canonical'] and '/watch?v=' in link.get('href', ''):
                # Verify if it's a live stream
                video_url = link['href']
                video_response = requests.get(video_url, headers=headers)
                if 'LIVE' in video_response.text:
                    return True, video_url
        
        # Method 2: Search for live badges in the page source
        if 'LIVE_STREAM_OFFLINE' not in response.text:
            live_indicators = [
                '"isLive":true',
                'LIVE_STREAM_OFFLINE":false',
                'LIVE_STATUS":"LIVE"',
                'label":"LIVE"'
            ]
            for indicator in live_indicators:
                if indicator in response.text:
                    # Try to extract the live video URL
                    video_id_match = re.search(r'"videoId":"([^"]+)".*?"LIVE"', response.text)
                    if video_id_match:
                        video_id = video_id_match.group(1)
                        return True, f"https://www.youtube.com/watch?v={video_id}"
                    return True, None
        
        return False, None
        
    except Exception as e:
        print(f"Error checking live status: {str(e)}")
        return False, None

async def monitor_stream():
    """Background task to monitor the stream"""
    while True:
        is_live, stream_url = check_if_live()
        
        # Check if stream just ended
        if stream_state.is_live and not is_live:
            stream_state.last_stream_end = datetime.now()
        
        stream_state.is_live = is_live
        stream_state.stream_url = stream_url
        
        await asyncio.sleep(60)  # Check every minute

@app.get("/status")
async def get_status():
    """Get current stream status"""
    return {
        "is_live": stream_state.is_live,
        "stream_url": stream_state.stream_url,
        "last_stream_end": stream_state.last_stream_end.isoformat() if stream_state.last_stream_end else None,
        "time_since_end": (datetime.now() - stream_state.last_stream_end).total_seconds() if stream_state.last_stream_end else None
    }