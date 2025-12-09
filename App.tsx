import React, { useEffect, useState, useRef } from 'react';
import { useOperatingSystem } from './hooks/useOperatingSystem';
import { BackgroundParticles } from './components/BackgroundParticles';
import { WifiCard } from './components/WifiCard';
import { AudioVisualizer } from './components/AudioVisualizer';
import { OSType, APP_LINKS, APP_DEEP_LINKS } from './types';
import { ExternalLink, Smartphone, DownloadCloud, AlertCircle, PlayCircle, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const os = useOperatingSystem();
  
  // ステータス管理: 'idle' -> 'checking_app' (アプリ起動試行) -> 'redirecting_store' (ストアへ)
  const [status, setStatus] = useState<'idle' | 'checking_app' | 'redirecting_store'>('idle');
  const [imageError, setImageError] = useState(false);
  const attemptedRedirectRef = useRef(false);

  useEffect(() => {
    // OS判定が完了するまで待機
    if (os === OSType.UNKNOWN) return;
    if (attemptedRedirectRef.current) return;

    attemptedRedirectRef.current = true;

    // 少し待ってから処理開始（ユーザーに画面を見せるため）
    const startTimer = setTimeout(() => {
      handleAutoRedirect();
    }, 800);

    return () => clearTimeout(startTimer);
  }, [os]);

  const handleAutoRedirect = () => {
    setStatus('checking_app');

    if (os === OSType.ANDROID) {
      // Android: Intentスキームを使用（自動的にアプリ起動 or ストア遷移が行われる）
      window.location.href = APP_DEEP_LINKS.android;
      // UI上は完了扱いにする
      setTimeout(() => setStatus('redirecting_store'), 1000);
    } else if (os === OSType.IOS) {
      // iOS: アプリスキームを試行し、タイムアウトでストアへフォールバック
      const start = Date.now();
      
      // 1. アプリ起動を試みる
      window.location.href = APP_DEEP_LINKS.ios;

      // 2. 一定時間後に画面が隠れていなければ（＝アプリが開かなかったら）ストアへ
      setTimeout(() => {
        const elapsed = Date.now() - start;
        // ページが非表示になっていない = アプリに遷移していない
        if (!document.hidden && elapsed < 3000) {
          setStatus('redirecting_store');
          window.location.href = APP_LINKS.ios;
        }
      }, 2000); // 2秒待機
    } else {
      // その他: Webサイトへ
      setStatus('redirecting_store');
      setTimeout(() => {
        window.location.href = APP_LINKS.web;
      }, 1500);
    }
  };

  const handleManualStore = () => {
    let url = APP_LINKS.web;
    if (os === OSType.IOS) url = APP_LINKS.ios;
    if (os === OSType.ANDROID) url = APP_LINKS.android;
    window.location.href = url;
  };

  const handleManualAppOpen = () => {
    if (os === OSType.ANDROID) {
      window.location.href = APP_DEEP_LINKS.android;
    } else if (os === OSType.IOS) {
      window.location.href = APP_DEEP_LINKS.ios;
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
      <BackgroundParticles />

      <div className="relative z-10 w-full max-w-md flex flex-col items-center animate-fade-in-up">
        
        {/* Main Glass Card */}
        <div className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center">
          
          {/* Logo Section */}
          <div className="relative mb-6 group">
            <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
            <div className="relative w-32 h-32 bg-white rounded-2xl overflow-hidden shadow-lg border-4 border-white/10">
              {!imageError ? (
                <img 
                  src="./app-icon.png" 
                  alt="Karaoke Kan App Icon" 
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <Smartphone className="w-12 h-12 text-blue-500" />
                </div>
              )}
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2 drop-shadow-md">
            カラオケ館公式アプリ
          </h1>

          {/* Dynamic Status Section */}
          <div className="h-28 w-full flex flex-col items-center justify-center transition-all duration-500">
            {status === 'idle' && (
              <div className="flex flex-col items-center animate-pulse">
                <p className="text-blue-200">読み込み中...</p>
              </div>
            )}

            {status === 'checking_app' && (
              <div className="flex flex-col items-center space-y-3">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                <p className="text-lg font-medium text-white">アプリを確認中...</p>
                <p className="text-xs text-blue-200">アプリが起動しない場合はストアへ移動します</p>
              </div>
            )}

            {status === 'redirecting_store' && (
               <div className="flex flex-col items-center animate-fade-in">
                 <AudioVisualizer />
                 <p className="text-white font-semibold mt-2">ストアページへ移動中</p>
               </div>
            )}
          </div>
        </div>

        {/* Wi-Fi Section */}
        <WifiCard />

        {/* Fallback / Manual Actions */}
        <div className="mt-8 w-full space-y-3">
          <p className="text-center text-gray-400 text-xs mb-2">
            画面が変わらない場合は以下を選択してください
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleManualAppOpen}
              className="flex items-center justify-center space-x-2 py-3 px-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold shadow-lg hover:brightness-110 transition-transform active:scale-95"
            >
              <PlayCircle className="w-5 h-5" />
              <span>アプリを開く</span>
            </button>
            <button
              onClick={handleManualStore}
              className="flex items-center justify-center space-x-2 py-3 px-2 bg-white/10 border border-white/20 text-white rounded-xl font-bold hover:bg-white/20 transition-transform active:scale-95"
            >
              <DownloadCloud className="w-5 h-5" />
              <span>ストアへ</span>
            </button>
          </div>

          <button
             onClick={() => window.location.href = APP_LINKS.web}
             className="w-full flex items-center justify-center space-x-2 py-3 text-sm text-blue-300 hover:text-blue-200 transition-colors"
          >
            <span>Webサイトを開く</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {/* Helper for errors */}
        {status !== 'idle' && (
           <div className="mt-6 flex justify-center w-full">
             <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start space-x-2 max-w-xs animate-in fade-in slide-in-from-bottom-4 duration-700">
               <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
               <p className="text-[10px] text-red-200 text-left leading-snug">
                 ※ポップアップブロックによりアプリが起動しない場合があります。その場合は「アプリを開く」または「ストアへ」ボタンを押してください。
               </p>
             </div>
           </div>
        )}

      </div>
    </div>
  );
};

export default App;