import React, { useRef } from 'react';
import HeroSection from '../components/Home/HeroSection';
import HomeFooter from '../components/Home/HomeFooter';
import BeatmapUrlLoader from '../components/Beatmap/BeatmapUrlLoader';

const HomePage: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  return (
    <div ref={wrapperRef} className="min-h-screen flex flex-col m1-galaxy">
      {/* Hero (snap section 1) */}
      <section data-snap-section>
        <HeroSection />
      </section>

      {/* Beatmap Search (snap section 2) */}
      <section data-snap-section className="min-h-screen flex items-center py-16 px-4">
        <div className="container mx-auto max-w-2xl w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Explore Beatmaps
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Load any beatmap from osu! using its URL and preview it with audio
            </p>
          </div>
          <BeatmapUrlLoader />
        </div>
      </section>

      <section data-snap-section>
        <HomeFooter />
      </section>
    </div>
  );
};

export default HomePage;
