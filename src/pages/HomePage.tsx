import React from 'react';
import HeroSection from '../components/Home/HeroSection';
import HomeFooter from '../components/Home/HomeFooter';
import BeatmapUrlLoader from '../components/Beatmap/BeatmapUrlLoader';

const HomePage: React.FC = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
    <HeroSection />
    
    {/* Beatmap Search Section */}
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-2xl">
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
    
    <HomeFooter />
  </div>
);

export default HomePage;
