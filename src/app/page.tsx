import YouTubeVideos from "@/components/YouTubeVideos";

export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  const channelId = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <YouTubeVideos apiKey={apiKey} channelId={channelId} />
    </main>
  );
}
