import React, { useState, useRef } from 'react';
import { 
  Download, Image as ImageIcon, Music, Video, 
  AlertCircle, Loader2, Clipboard, Check, 
  Link2, Sparkles, Zap, Eye, Heart, MessageCircle, Share2, Copy
} from 'lucide-react';

export default function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  
  const [downloadingType, setDownloadingType] = useState(null);
  const inputRef = useRef(null);

  // Format angka ke format M/K (contoh: 1500000 -> 1.5M)
  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        inputRef.current?.focus();
      }
    } catch (err) {
      setError('Gagal akses clipboard bro. Coba paste manual.');
    }
  };

  const handleCopyCaption = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 2000);
    } catch (err) {
      console.error('Failed to copy');
    }
  };

  const fetchTikTokData = async (e) => {
    e?.preventDefault();
    if (!url) {
      setError('Masukkan link TikTok-nya dulu ya.');
      return;
    }

    if (!url.includes('tiktok.com')) {
      setError('Link tidak valid. Pastikan dari TikTok.');
      return;
    }

    setLoading(true);
    setError('');
    setData(null);

    try {
      const response = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`);
      const result = await response.json();

      if (result.code === 0) {
        setData(result.data);
      } else {
        setError(result.msg || 'Video tidak ditemukan atau akun di-private.');
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan. Coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  const forceDownload = async (fileUrl, filename, typeId) => {
    setDownloadingType(typeId);
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error('Network error');
      const blob = await response.blob();
      
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      // Fallback
      const fallbackLink = document.createElement('a');
      fallbackLink.href = `${fileUrl}&dl=1`;
      fallbackLink.target = '_blank';
      fallbackLink.download = filename;
      document.body.appendChild(fallbackLink);
      fallbackLink.click();
      document.body.removeChild(fallbackLink);
    } finally {
      setDownloadingType(null);
    }
  };

  return (
    <div 
      className="min-h-screen text-gray-100 font-sans selection:bg-purple-500 selection:text-white flex flex-col relative overflow-hidden bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')` }}
    >
      {/* Dark Overlay for Readability & Blur */}
      <div className="absolute inset-0 bg-[#05050a]/80 backdrop-blur-md z-0 pointer-events-none"></div>

      {/* Custom Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shine {
          to { background-position: 200% center; }
        }
        .animate-shine {
          background-size: 200% auto;
          animation: shine 3s linear infinite;
        }

        .glass-panel {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
        }
      `}} />

      <div className="relative z-10 flex-grow flex flex-col items-center pt-16 pb-12 px-4 sm:px-6 w-full max-w-5xl mx-auto">
        
        {/* --- PREMIUM DITYA BADGE --- */}
        <div className="group cursor-default inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-10 transition-all hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]">
          <Sparkles className="w-4 h-4 text-purple-400 group-hover:text-cyan-400 transition-colors" />
          <span className="text-sm font-medium text-gray-300">
            Crafted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 font-bold group-hover:animate-shine">Ditya</span>
          </span>
        </div>

        {/* --- HEADER --- */}
        <header className="text-center mb-12 w-full">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 pb-2 drop-shadow-2xl">
            TokDrop<span className="text-purple-500">.</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-lg mx-auto font-light drop-shadow-md">
            Download konten tanpa watermark. <br/> <span className="text-cyan-400 font-medium">Instan. Gratis. Kualitas HD.</span>
          </p>
        </header>

        {/* --- SEARCH BOX --- */}
        <div className="w-full max-w-3xl z-20 transition-all duration-500 hover:-translate-y-1">
          <form onSubmit={fetchTikTokData} className="relative group">
            {/* Animated Glow Border */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-cyan-500 to-pink-600 rounded-[28px] blur opacity-40 group-hover:opacity-70 transition duration-500"></div>
            
            <div className="relative flex flex-col sm:flex-row items-center bg-black/60 backdrop-blur-2xl border border-white/20 rounded-[24px] p-2 overflow-hidden shadow-2xl">
              
              <div className="flex-1 flex items-center w-full px-4 py-2">
                <Link2 className="w-6 h-6 text-purple-400 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste link TikTok di sini..."
                  className="w-full bg-transparent text-white text-lg py-3 pl-4 pr-2 focus:outline-none placeholder-gray-400 font-light"
                  required
                />
                
                {/* Instant Paste Button */}
                <button
                  type="button"
                  onClick={handlePaste}
                  className="flex items-center justify-center p-2.5 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-cyan-400 rounded-xl transition-all mr-2 border border-white/10 hover:border-cyan-500/50 group/paste backdrop-blur-md"
                  title="Paste otomatis"
                >
                  {copied ? <Check className="w-5 h-5 text-green-400" /> : <Clipboard className="w-5 h-5 group-hover/paste:scale-110 transition-transform" />}
                </button>
              </div>

              {/* Extract Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto mt-2 sm:mt-0 bg-gradient-to-r from-purple-600 to-cyan-500 animate-shine text-white font-bold py-4 px-10 rounded-xl transition-all disabled:opacity-70 flex items-center justify-center gap-2 min-w-[160px] shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] active:scale-95 border border-white/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="tracking-wide">Proses...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    <span className="tracking-wide">Extract</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* --- ERROR MESSAGE --- */}
        {error && (
          <div className="mt-8 w-full max-w-2xl transform transition-all duration-300">
            <div className="bg-red-500/20 border border-red-500/50 backdrop-blur-md text-red-200 px-6 py-4 rounded-2xl flex items-center gap-4 text-sm shadow-xl">
              <AlertCircle className="w-6 h-6 flex-shrink-0 text-red-400" />
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* --- RESULT AREA --- */}
        {data && (
          <div className="mt-12 w-full max-w-4xl glass-panel rounded-[32px] overflow-hidden shadow-2xl transition-all duration-700 opacity-100 translate-y-0 border border-white/10">
            <div className="flex flex-col md:flex-row">
              
              {/* Thumbnail & Profile */}
              <div className="md:w-5/12 relative group bg-black overflow-hidden">
                <img 
                  src={data.cover} 
                  alt="Thumbnail" 
                  className="w-full h-80 md:h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05050a] via-[#05050a]/50 to-transparent"></div>
                
                {/* Profile Info */}
                <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full blur opacity-80"></div>
                      <img 
                        src={data.author.avatar} 
                        alt="Avatar"
                        className="relative w-14 h-14 rounded-full border-2 border-white/40 object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg drop-shadow-md">{data.author.nickname}</h3>
                      <p className="text-cyan-400 text-sm font-medium drop-shadow-md">@{data.author.unique_id}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Download Actions & Stats */}
              <div className="md:w-7/12 p-8 md:p-10 flex flex-col justify-center bg-black/40">
                
                {/* Fitur Baru: Video Analytics Stats */}
                <div className="grid grid-cols-4 gap-2 mb-6 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <Eye className="w-5 h-5 text-cyan-400" />
                    <span className="text-xs font-bold text-gray-300">{formatNumber(data.play_count)}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1 border-l border-white/10">
                    <Heart className="w-5 h-5 text-pink-500" />
                    <span className="text-xs font-bold text-gray-300">{formatNumber(data.digg_count)}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1 border-l border-white/10">
                    <MessageCircle className="w-5 h-5 text-green-400" />
                    <span className="text-xs font-bold text-gray-300">{formatNumber(data.comment_count)}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1 border-l border-white/10">
                    <Share2 className="w-5 h-5 text-purple-400" />
                    <span className="text-xs font-bold text-gray-300">{formatNumber(data.share_count)}</span>
                  </div>
                </div>

                {/* Caption Area with Copy Button */}
                <div className="mb-8 relative group/caption">
                  <p className="text-gray-300 line-clamp-3 text-sm font-light leading-relaxed pr-8">
                    {data.title || "Tidak ada deskripsi pada postingan ini."}
                  </p>
                  {data.title && (
                    <button 
                      onClick={() => handleCopyCaption(data.title)}
                      className="absolute top-0 right-0 p-2 bg-white/5 hover:bg-white/15 rounded-lg text-gray-400 hover:text-white transition-colors"
                      title="Copy Caption"
                    >
                      {copiedCaption ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {!data.images && (
                    <>
                      {/* Button Video HD */}
                      {data.hdplay && (
                        <button 
                          onClick={() => forceDownload(data.hdplay, `TokDrop_HD_${data.id}.mp4`, 'hd')}
                          disabled={downloadingType !== null}
                          className="group relative w-full overflow-hidden rounded-2xl p-[1px] disabled:opacity-60 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                        >
                          <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-80 group-hover:opacity-100 transition-opacity"></span>
                          <div className="relative flex items-center justify-between bg-[#13131a]/90 backdrop-blur-xl px-6 py-4 rounded-[15px] transition-all">
                            <div className="flex items-center gap-4">
                              <div className="bg-gradient-to-br from-cyan-400 to-purple-500 p-2 rounded-lg shadow-lg">
                                <Video className="w-5 h-5 text-white" />
                              </div>
                              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 text-lg">Video HD (Kualitas Tinggi)</span>
                            </div>
                            {downloadingType === 'hd' ? (
                              <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
                            ) : (
                              <Download className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors group-hover:-translate-y-1 group-hover:scale-110 duration-300" />
                            )}
                          </div>
                        </button>
                      )}

                      {/* Button Video Normal */}
                      <button 
                        onClick={() => forceDownload(data.play, `TokDrop_SD_${data.id}.mp4`, 'video')}
                        disabled={downloadingType !== null}
                        className="group w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 text-gray-200 font-medium py-4 px-6 rounded-2xl flex items-center justify-between transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:-translate-y-1 disabled:opacity-50"
                      >
                        <div className="flex items-center gap-4">
                          <Video className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                          <span className="text-base">Video Normal (No Watermark)</span>
                        </div>
                        {downloadingType === 'video' ? <Loader2 className="w-6 h-6 animate-spin text-white" /> : <Download className="w-6 h-6 text-gray-500 group-hover:text-cyan-400 transition-colors" />}
                      </button>
                    </>
                  )}

                  {/* Button Audio */}
                  <button 
                    onClick={() => forceDownload(data.music, `TokDrop_Audio_${data.id}.mp3`, 'audio')}
                    disabled={downloadingType !== null}
                    className="group w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 text-gray-200 font-medium py-4 px-6 rounded-2xl flex items-center justify-between transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:-translate-y-1 disabled:opacity-50"
                  >
                    <div className="flex items-center gap-4">
                      <Music className="w-5 h-5 text-gray-400 group-hover:text-pink-400 transition-colors" />
                      <span className="text-base">Download Audio MP3</span>
                    </div>
                    {downloadingType === 'audio' ? <Loader2 className="w-6 h-6 animate-spin text-white" /> : <Download className="w-6 h-6 text-gray-500 group-hover:text-pink-400 transition-colors" />}
                  </button>
                </div>
              </div>
            </div>

            {/* --- PHOTO SLIDESHOW GRID --- */}
            {data.images && data.images.length > 0 && (
              <div className="p-8 md:p-10 border-t border-white/10 bg-black/60 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-bold text-white flex items-center gap-3 text-lg">
                    <ImageIcon className="w-6 h-6 text-purple-400" /> 
                    Photo Slideshow
                  </h3>
                  <span className="bg-purple-500/20 border border-purple-500/50 text-purple-200 text-xs uppercase tracking-wider px-3 py-1.5 rounded-lg font-bold">
                    {data.images.length} Photos
                  </span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                  {data.images.map((img, idx) => (
                    <div key={idx} className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-white/5 border border-white/10 transition-all hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:-translate-y-2 hover:border-purple-500/50 duration-500">
                      <img src={img} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-end pb-6 backdrop-blur-[2px]">
                        <button 
                          onClick={() => forceDownload(img, `TokDrop_Photo_${idx + 1}.jpeg`, `img-${idx}`)}
                          disabled={downloadingType !== null}
                          className="bg-white hover:bg-cyan-400 text-black rounded-full p-4 transform translate-y-6 group-hover:translate-y-0 transition-all duration-500 shadow-2xl"
                        >
                          {downloadingType === `img-${idx}` ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                          ) : (
                            <Download className="w-6 h-6" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* --- FOOTER --- */}
      <footer className="relative z-10 text-center pb-8 pt-12 text-gray-400 text-sm flex flex-col items-center gap-2 mt-auto backdrop-blur-sm bg-black/20 w-full">
        <p className="tracking-wide">
          &copy; {new Date().getFullYear()} <span className="text-white font-semibold">TokDrop</span>. Designed by Ditya.
        </p>
        <p className="text-xs text-gray-500">For educational purposes & open source showcase.</p>
      </footer>
    </div>
  );
}