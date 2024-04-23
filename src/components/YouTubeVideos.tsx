"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";

interface Video {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      high: {
        url: string;
      };
    };
  };
}

interface Props {
  apiKey: string;
  channelId: string;
}

const YouTubeVideos: React.FC<Props> = ({ apiKey, channelId }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [prevPageToken, setPrevPageToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchVideos = async (pageToken = "") => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get<{
        items: Video[];
        nextPageToken?: string;
        prevPageToken?: string;
      }>("https://www.googleapis.com/youtube/v3/search", {
        params: {
          key: apiKey,
          channelId: channelId,
          part: "snippet",
          order: "date",
          maxResults: 10,
          pageToken,
        },
      });
      setVideos(
        pageToken ? [...videos, ...response.data.items] : response.data.items,
      );
      setNextPageToken(response.data.nextPageToken || null);
      setPrevPageToken(response.data.prevPageToken || null);
    } catch (error) {
      setError("動画の取得に失敗しました。もう一度試してください。");
      console.error("動画の取得に失敗しました:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [apiKey, channelId]);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map((video) => (
          <div key={video.id.videoId} className="p-4 shadow-lg rounded-lg">
            <h3 className="font-bold">{video.snippet.title}</h3>
            <Image
              src={video.snippet.thumbnails.high.url}
              alt={video.snippet.description}
              width={480}
              height={360}
              priority
            />
          </div>
        ))}
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <div className="pagination flex justify-center space-x-4">
        {loading && <p>Loading...</p>}
        {!loading && prevPageToken && (
          <button
            className="btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => fetchVideos(prevPageToken)}
          >
            Previous Page
          </button>
        )}
        {!loading && nextPageToken && (
          <button
            className="btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => fetchVideos(nextPageToken)}
          >
            Next Page
          </button>
        )}
      </div>
    </div>
  );
};

export default YouTubeVideos;
