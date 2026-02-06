
import React, { useState, useCallback, useMemo } from 'react';
import { MOCK_PROFILES } from './constants';
import { Profile, MatchResult } from './types';
import SwipeCard from './components/SwipeCard';
import { generateMatchMessage } from './services/geminiService';
import { Heart, X, Star, Flame } from 'lucide-react';

const HeartMeteor = ({ delay, left, size, duration }: { delay: number; left: string; size: number; duration: number }) => (
  <div
    className="animate-heart-fall text-rose-400/30"
    style={{
      left,
      fontSize: `${size}px`,
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`,
    }}
  >
    💓
  </div>
);

const App: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>(MOCK_PROFILES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastMatch, setLastMatch] = useState<MatchResult | null>(null);
  const [isMatchOpen, setIsMatchOpen] = useState(false);

  const meteors = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      delay: Math.random() * 10,
      left: `${Math.random() * 120 - 10}%`,
      size: 15 + Math.random() * 25,
      duration: 6 + Math.random() * 8,
    }));
  }, []);

  const handleSwipe = useCallback(async (direction: 'left' | 'right') => {
    const currentProfile = profiles[currentIndex];
    
    if (direction === 'right') {
      if (Math.random() > 0.4) {
        const message = await generateMatchMessage(currentProfile.name);
        setLastMatch({ profile: currentProfile, message });
        setIsMatchOpen(true);
      }
    }

    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setTimeout(() => {
        setCurrentIndex(0);
        setProfiles([...MOCK_PROFILES].sort(() => Math.random() - 0.5));
      }, 500);
    }
  }, [currentIndex, profiles]);

  return (
    <div className="fixed inset-0 bg-white text-zinc-900 flex flex-col items-center justify-center overflow-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {meteors.map((m) => (
          <HeartMeteor key={m.id} {...m} />
        ))}
      </div>

      <main className="relative w-full max-w-md h-full flex flex-col items-center justify-start py-8 px-4 z-10 gap-4">
        <div className="text-center w-full shrink-0 mb-2">
          <h1 className="text-4xl font-black text-rose-500 italic tracking-tighter drop-shadow-sm">
            キューンマッチ
          </h1>
          <p className="text-rose-400/70 text-sm font-bold mt-1">
            ドキドキが、すぐそこに。
          </p>
        </div>

        <div className="relative w-full flex-grow max-h-[78vh]">
          <div className="relative w-full h-full">
            {profiles.map((profile, index) => {
              if (index < currentIndex) return null;
              if (index > currentIndex + 1) return null;
              
              return (
                <SwipeCard
                  key={profile.id}
                  profile={profile}
                  onSwipe={handleSwipe}
                  isTop={index === currentIndex}
                />
              );
            })}
            
            {currentIndex >= profiles.length && (
              <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-50 rounded-[32px] text-center p-8 border border-zinc-200 shadow-inner">
                <Flame size={48} className="text-rose-500 animate-pulse mb-6" />
                <h3 className="text-2xl font-black mb-3 text-zinc-800">新しいお相手を検索中...</h3>
              </div>
            )}
          </div>
        </div>

        <div className="w-full flex flex-col items-center shrink-0 py-4">
          <div className="flex justify-center items-center gap-6">
            <button onClick={() => handleSwipe('left')} className="w-16 h-16 rounded-full bg-white border-2 border-zinc-100 flex items-center justify-center text-zinc-400 hover:text-red-500 shadow-xl">
              <X size={28} strokeWidth={3} />
            </button>
            <button className="w-12 h-12 rounded-full bg-white border border-zinc-100 flex items-center justify-center text-zinc-400 hover:text-blue-400 shadow-md">
              <Star size={20} fill="currentColor" />
            </button>
            <button onClick={() => handleSwipe('right')} className="w-16 h-16 rounded-full bg-white border-2 border-zinc-100 flex items-center justify-center text-zinc-400 hover:text-green-500 shadow-xl">
              <Heart size={28} fill="currentColor" />
            </button>
          </div>
        </div>
      </main>

      {isMatchOpen && lastMatch && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsMatchOpen(false)}></div>
          <div className="relative w-full max-w-sm bg-white rounded-[40px] p-10 text-center animate-in fade-in zoom-in duration-300">
            <div className="text-rose-500 font-black text-[38px] mb-8 italic tracking-tighter uppercase leading-none">Matched!</div>
            
            <div className="flex justify-center items-center gap-4 mb-8">
              <div className="w-24 h-24 rounded-full border-4 border-rose-500 p-1 bg-white overflow-hidden shadow-lg">
                <img src={`https://picsum.photos/seed/you/200`} className="w-full h-full rounded-full object-cover" alt="あなた" />
              </div>
              <div className="w-24 h-24 rounded-full border-4 border-rose-500 p-1 bg-white overflow-hidden shadow-lg">
                <video 
                  key={lastMatch.profile.videoUrl}
                  src={lastMatch.profile.videoUrl} 
                  className="w-full h-full rounded-full object-cover" 
                  muted autoPlay loop playsInline 
                />
              </div>
            </div>

            <div className="bg-rose-50 rounded-2xl p-5 mb-8 border border-rose-100">
              <p className="text-base font-bold text-zinc-800">「{lastMatch.message}」</p>
            </div>

            <button onClick={() => setIsMatchOpen(false)} className="w-full bg-gradient-to-r from-rose-600 to-pink-500 text-white py-4 rounded-2xl font-black text-lg shadow-lg">メッセージを送る</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
