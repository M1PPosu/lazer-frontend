import React from 'react';
import HeroSection from '../components/Home/HeroSection';
import HomeFooter from '../components/Home/HomeFooter';
import BeatmapUrlLoader from '../components/Beatmap/BeatmapUrlLoader';

const HomePage: React.FC = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
    <HeroSection />
    <HomeFooter />
  </div>
);

export default HomePage;
