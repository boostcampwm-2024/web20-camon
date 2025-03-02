import { Banner, LivePreviewList } from '@/widgets';

export function HomePage() {
  return (
    <div className="flex flex-col justify-start w-full min-h-[calc(100vh-74px)]">
      <Banner />
      <LivePreviewList />
    </div>
  );
}
