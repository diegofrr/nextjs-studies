'use client';

import '@/lib/ShakaPlayer/shaka-player.css';
import { useSearchParams } from 'next/navigation';

import NotFound from '../not-found';

import { VideoPlayer } from './components/VideoPlayer';

export default function Watch() {
  const streamId = useSearchParams().get('v');

  return !streamId ? (
    <NotFound />
  ) : (
    <main className="h-screen w-full flex items-center justify-center min-h-screen">
      <VideoPlayer.Root streamId={streamId}>
        <VideoPlayer.Header />
        <VideoPlayer.Content />
      </VideoPlayer.Root>
    </main>
  );
}
