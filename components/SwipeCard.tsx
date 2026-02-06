
import React, { useRef, useState, useEffect } from 'react';
import { Profile } from '../types';
import { Info, AlertCircle, RefreshCw, Mic, PhoneOff, Video, FlipHorizontal, Timer } from 'lucide-react';

interface SwipeCardProps {
  profile: Profile;
  onSwipe: (direction: 'left' | 'right') => void;
  isTop: boolean;
}

const SwipeCard: React.FC<SwipeCardProps> = ({ profile, onSwipe, isTop }) => {
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [time, setTime] = useState(14); // 初期秒数
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // タイマーのシミュレーション
  useEffect(() => {
    let interval: number;
    if (isTop && !isLoading && !videoError) {
      interval = window.setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTop, isLoading, videoError]);

  useEffect(() => {
    if (isTop && videoRef.current && !videoError) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn("Autoplay failed:", error);
        });
      }
    }
  }, [isTop, videoError, profile.videoUrl]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    setVideoError(null);
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isTop) return;
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
    videoRef.current?.play().catch(() => {});
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isTop) return;
    setStartX(e.clientX);
    setIsDragging(true);
    videoRef.current?.play().catch(() => {});
  };

  const handleMove = (xPos: number) => {
    if (!isDragging || !isTop) return;
    const x = xPos - startX;
    setCurrentX(x);
  };

  const handleEnd = () => {
    if (!isDragging || !isTop) return;
    const threshold = 120;
    if (currentX > threshold) {
      onSwipe('right');
    } else if (currentX < -threshold) {
      onSwipe('left');
    }
    setIsDragging(false);
    setCurrentX(0);
  };

  const rotation = currentX / 10;

  return (
    <div
      ref={cardRef}
      className={`absolute inset-0 w-full h-full transition-transform duration-200 cursor-grab active:cursor-grabbing ${!isDragging ? 'ease-out' : ''}`}
      style={{
        transform: `translateX(${currentX}px) rotate(${rotation}deg)`,
        zIndex: isTop ? 10 : 0,
        touchAction: 'none'
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onTouchEnd={handleEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={(e) => isDragging && handleMove(e.clientX)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
    >
      <div className="relative w-full h-full rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] bg-black flex items-center justify-center">
        
        {/* 動画本体: crossOriginを削除し、referrerPolicyを追加 */}
        <video
          key={profile.videoUrl}
          ref={videoRef}
          src={profile.videoUrl}
          className={`w-full h-full object-cover transition-opacity duration-700 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          loop
          muted
          playsInline
          autoPlay
          preload="auto"
          referrerPolicy="no-referrer"
          onLoadedData={() => {
            setIsLoading(false);
            setVideoError(null);
          }}
          onError={(e) => {
            console.error("Video Error:", (e.target as HTMLVideoElement).error);
            setVideoError("動画の読み込みに失敗しました。サーバーの制限か、URLが無効です。");
            setIsLoading(false);
          }}
        />

        {/* --- ビデオ通話オーバーレイUI --- */}
        {!isLoading && !videoError && (
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
            <div className="flex justify-between items-start">
              <div className="bg-black/20 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2 border border-white/20">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-white text-sm font-mono tracking-tighter">{formatTime(time)}</span>
              </div>
              <div className="w-24 h-32 bg-zinc-800 rounded-xl overflow-hidden border-2 border-white/30 shadow-xl">
                 <img src="https://picsum.photos/seed/me/200/300" className="w-full h-full object-cover grayscale-[0.2]" alt="me" />
              </div>
            </div>

            <div className="flex flex-col items-center gap-6 pb-20">
              <div className="flex items-center gap-5 pointer-events-auto">
                <button className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white">
                  <Mic size={20} />
                </button>
                <button className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-white shadow-lg shadow-red-500/40 transform active:scale-90 transition-transform">
                  <PhoneOff size={28} fill="currentColor" />
                </button>
                <button className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white">
                  <Video size={20} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading/Error State */}
        {(isLoading || videoError) && (
          <div className="absolute inset-0 bg-zinc-900 flex flex-col items-center justify-center z-20 text-center p-6">
            {isLoading && !videoError ? (
              <>
                <div className="w-12 h-12 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin mb-4"></div>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Connecting...</p>
              </>
            ) : (
              <>
                <AlertCircle size={48} className="text-rose-500 mb-4" />
                <p className="text-white font-bold mb-4">{videoError}</p>
                <button onClick={handleRetry} className="bg-white/10 text-white px-6 py-2 rounded-full text-sm border border-white/20">再読込</button>
              </>
            )}
          </div>
        )}

        {/* スワイプ時のラベル */}
        {isDragging && currentX > 50 && (
          <div className="absolute inset-0 bg-green-500/20 z-30 flex items-center justify-center">
             <div className="border-[8px] border-green-500 text-green-500 font-black text-6xl px-8 py-4 rounded-3xl rotate-[-12deg] bg-black/20">スキ</div>
          </div>
        )}
        {isDragging && currentX < -50 && (
          <div className="absolute inset-0 bg-red-500/20 z-30 flex items-center justify-center">
             <div className="border-[8px] border-red-500 text-red-500 font-black text-6xl px-8 py-4 rounded-3xl rotate-[12deg] bg-black/20">NO</div>
          </div>
        )}

        {/* 下部のプロフィール情報 */}
        <div className="absolute inset-x-0 bottom-0 p-8 pt-20 swipe-gradient pointer-events-none z-10">
          <div className="flex items-end justify-between mb-2">
            <div>
              <h3 className="text-white text-3xl font-black flex items-center gap-2">
                {profile.name} <span className="text-xl font-bold opacity-80">{profile.age}</span>
                <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
              </h3>
              <p className="text-white/70 text-xs font-bold mt-1 flex items-center gap-1">
                 <Timer size={12} /> 今すぐ通話可能
              </p>
            </div>
          </div>
          <p className="text-white/90 text-sm leading-relaxed line-clamp-2 font-medium">
            {profile.bio}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SwipeCard;
