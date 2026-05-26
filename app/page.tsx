'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [budget, setBudget] = useState(1000);
  const [mood, setMood] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [date, setDate] = useState('2026-09-20');
  const [returnDate, setReturnDate] = useState('2026-09-27');
  
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [factIndex, setFactIndex] = useState(0);
  
  const [passport, setPassport] = useState<any[]>([]);
  const [showPassport, setShowPassport] = useState(false);
  const [copied, setCopied] = useState(false);

  const moods = ['Cold', 'Beach', 'City', 'Nature'];

  const travelFacts = [
    "Connecting to Google Flights radars...",
    "Did you know the world's shortest commercial flight lasts just 57 seconds?",
    "Matching budgets, dates, and routes...",
    "Finding the best getaway for your budget...",
    "Almost there... confirming flight availability...",
    "Did you know airplane windows are oval to prevent structural stress?"
  ];

  useEffect(() => {
    const savedPassport = localStorage.getItem('acaso_passport');
    if (savedPassport) {
      setPassport(JSON.parse(savedPassport));
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSearching) {
      interval = setInterval(() => {
        setFactIndex((prev) => (prev + 1) % travelFacts.length);
      }, 2200);
    } else {
      setFactIndex(0);
    }
    return () => clearInterval(interval);
  }, [isSearching]);

  const handleSearch = async () => {
    setIsSearching(true);
    setIsRevealed(false); 
    setCopied(false);
    
    const moodMapPT: Record<string, string> = { 'Cold': 'Frio', 'Beach': 'Praia', 'City': 'Cidade', 'Nature': 'Natureza' };
    const moodPT = moodMapPT[mood] || 'Cidade';

    try {
      const response = await fetch(`/api/voos?budget=${budget}&mood=${moodPT}&passengers=${passengers}&date=${date}&returnDate=${returnDate}`);
      const data = await response.json();
      data.success ? setResult(data.flight) : setResult('not_found');
    } catch (error) {
      setResult('not_found');
    } finally {
      setIsSearching(false);
    }
  };

  const revealDestination = () => {
    setIsRevealed(true);
    if (result) {
      const countryInEN = result.country === 'Espanha' ? 'Spain' : result.country === 'Polónia' ? 'Poland' : result.country === 'Hungria' ? 'Hungary' : result.country === 'França' ? 'France' : result.country === 'Itália' ? 'Italy' : result.country === 'Suíça' ? 'Switzerland' : result.country === 'Noruega' ? 'Norway' : result.country === 'Dinamarca' ? 'Denmark' : result.country === 'Reino Unido' ? 'United Kingdom' : result.country === 'Países Baixos' ? 'Netherlands' : result.country === 'Grécia' ? 'Greece' : result.country === 'Croácia' ? 'Croatia' : result.country === 'Eslovénia' ? 'Slovenia' : result.country === 'Escócia' ? 'Scotland' : result.country;
      
      const newEntry = { city: result.city, country: countryInEN, image: result.image };
      if (!passport.some(entry => entry.city === newEntry.city)) {
        const newPassport = [...passport, newEntry];
        setPassport(newPassport);
        localStorage.setItem('acaso_passport', JSON.stringify(newPassport));
      }
    }
  };

  const shareSurprise = () => {
    const text = `🤫 Pack your bags! I booked a mystery trip for us from ${new Date(date).toLocaleDateString('pt-PT')} to ${new Date(returnDate).toLocaleDateString('pt-PT')}. All I can say is that the vibe is ${mood}... Discover the destination here: https://acaso-iota.vercel.app`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const resetSearch = () => {
    setResult(null);
    setIsRevealed(false);
    setCopied(false);
    setMood('');
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 relative bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/acaso_background_2.jpg')" }}>
      <div className="absolute inset-0 bg-black/60 pointer-events-none"></div>
      {/* Botão do Passaporte ajustado para telemóvel (mais afastado do topo e menor) */}
      <button 
        onClick={() => setShowPassport(true)}
        className="absolute top-6 right-4 sm:top-6 sm:right-6 bg-zinc-900 border border-zinc-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 hover:bg-zinc-800 transition-colors shadow-lg z-20"
      >
        <span>My Passport ({passport.length})</span>
      </button>

      {/* MODAL DO PASSAPORTE */}
      {showPassport && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-zinc-900 w-full max-w-lg rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-zinc-800 shadow-2xl relative overflow-hidden">
            <button onClick={() => setShowPassport(false)} className="absolute top-3 right-3 sm:top-4 sm:right-4 text-zinc-400 hover:text-white text-xl font-bold p-2">✕</button>
            <h2 className="text-xl sm:text-2xl font-black mb-1">Your Passport</h2>
            <p className="text-zinc-500 text-xs sm:text-sm mb-4 sm:mb-6">Collection of mystery destinations you've unlocked.</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {passport.length === 0 ? (
                <p className="col-span-full text-center text-zinc-500 py-10 text-sm font-medium border border-dashed border-zinc-800 rounded-xl">Your passport is empty.<br/>Reveal your first trip!</p>
              ) : (
                passport.map((p, i) => (
                  <div key={i} className="relative group rounded-xl overflow-hidden aspect-[4/5] border border-zinc-800 cursor-pointer">
                    <img src={p.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={p.city} 
                         onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=600&auto=format&fit=crop'; }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-2 sm:p-3">
                      <p className="text-[9px] sm:text-[10px] text-zinc-400 uppercase font-bold leading-none">{p.country}</p>
                      <p className="text-xs sm:text-sm font-black text-white truncate">{p.city}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header com margem superior maior no mobile para fugir do botão */}
      <div className="text-center max-w-2xl mb-6 sm:mb-8 mt-16 sm:mt-12 px-2">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-2 sm:mb-4 cursor-pointer" onClick={resetSearch}>
          ACASO
        </h1>
        <p className="text-zinc-400 text-xs sm:text-base leading-relaxed">Surprise round-trips using real-time Google Flights prices.</p>
      </div>

      {/* Cartão principal ajustado nas margens e paddings */}
      <div className="w-full max-w-md bg-zinc-900 p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-zinc-800 shadow-2xl relative overflow-hidden min-h-[480px] sm:min-h-[550px] flex flex-col justify-center">
        
        {isSearching && (
          <div className="text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-5 sm:mb-6"></div>
            <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Preparing for takeoff...</h2>
            <p key={factIndex} className="text-zinc-400 text-xs sm:text-sm animate-in fade-in zoom-in-95 duration-500 min-h-[40px] px-2">
              {travelFacts[factIndex]}
            </p>
          </div>
        )}

        {!isSearching && result === 'not_found' && (
          <div className="text-center">
            <h2 className="text-lg sm:text-xl font-bold text-red-400 mb-3 sm:mb-4">No flights available</h2>
            <p className="text-zinc-400 mb-5 sm:mb-6 text-xs sm:text-sm">The budget is too tight for this vibe, or the selected destination is currently expensive.</p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button onClick={handleSearch} className="w-full bg-blue-600 py-3 sm:py-4 rounded-xl font-bold text-xs sm:text-sm">Roll the Dice Again</button>
              <button onClick={resetSearch} className="w-full bg-zinc-800 py-3 sm:py-4 rounded-xl font-bold text-xs sm:text-sm">Change Filters</button>
            </div>
          </div>
        )}

        {!isSearching && result && result !== 'not_found' && (
          <div className="animate-in fade-in duration-500">
            {isRevealed ? (
              <div className="bg-white text-zinc-900 rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden mb-5 sm:mb-6">
                <div className="h-28 sm:h-32 w-full relative bg-zinc-200">
                    <img src={result.image} alt={result.city} className="w-full h-full object-cover animate-in fade-in duration-700" 
                         onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=600&auto=format&fit=crop'; }}/>
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20"></div>
                </div>
                <div className="p-4 sm:p-5">
                  <h2 className="text-2xl sm:text-3xl font-black">{result.city}</h2>
                  <p className="text-zinc-500 font-bold mb-3 sm:mb-4 text-sm sm:text-base">
                    {result.country === 'Espanha' ? 'Spain' : result.country === 'Polónia' ? 'Poland' : result.country === 'Hungria' ? 'Hungary' : result.country === 'França' ? 'France' : result.country === 'Itália' ? 'Italy' : result.country === 'Suíça' ? 'Switzerland' : result.country === 'Noruega' ? 'Norway' : result.country === 'Dinamarca' ? 'Denmark' : result.country === 'Reino Unido' ? 'United Kingdom' : result.country === 'Países Baixos' ? 'Netherlands' : result.country === 'Grécia' ? 'Greece' : result.country === 'Croácia' ? 'Croatia' : result.country === 'Eslovénia' ? 'Slovenia' : result.country === 'Escócia' ? 'Scotland' : result.country}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 border-t border-dashed pt-3 sm:pt-4">
                    <div>
                      <p className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase">Departure</p>
                      <p className="font-bold text-xs sm:text-sm">{new Date(date).toLocaleDateString('pt-PT')}</p>
                    </div>
                    <div>
                      <p className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase text-right">Return</p>
                      <p className="font-bold text-xs sm:text-sm text-right">{new Date(returnDate).toLocaleDateString('pt-PT')}</p>
                    </div>
                    <div className="col-span-2 bg-zinc-100 p-2 sm:p-3 rounded-xl flex justify-between items-center border border-zinc-200">
                      <span className="text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-wider line-clamp-1 mr-2">Flight by {result.airline}</span>
                      <span className="text-xs sm:text-sm font-black text-blue-600 shrink-0">{result.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-zinc-950 p-5 sm:p-6 rounded-xl sm:rounded-2xl border border-zinc-800 mb-5 sm:mb-6">
                <p className="text-blue-500 font-bold text-[10px] sm:text-xs uppercase mb-2">Mystery Destination Found</p>
                <p className="text-zinc-300 italic leading-relaxed text-sm">"Your destination with a {mood.toLowerCase()} vibe is ready. You are one click away from finding out where you are going."</p>
              </div>
            )}
            
            <div className="flex justify-between items-center mb-5 sm:mb-6">
              <span className="text-zinc-400 font-medium text-sm sm:text-base">Total Cost:</span>
              <span className="text-xl sm:text-2xl font-black">{result.totalPrice}€</span>
            </div>

            {isRevealed ? (
              <div className="flex flex-col gap-2 sm:gap-3">
                <a href={result.bookingLink} target="_blank" rel="noopener noreferrer" className="w-full bg-green-600 text-white text-center font-bold py-3 sm:py-4 rounded-xl transition-all hover:bg-green-500 shadow-lg shadow-green-500/30 text-xs sm:text-sm">
                  Book on Google Flights
                </a>
                
                <button onClick={shareSurprise} className="w-full bg-purple-600 text-white font-bold py-3 sm:py-4 rounded-xl transition-all hover:bg-purple-500 text-xs sm:text-sm">
                  {copied ? 'Message Copied! 🤫' : 'Send Surprise via WhatsApp'}
                </button>
                
                <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-1 sm:mt-2">
                  <button onClick={handleSearch} className="w-full bg-zinc-800 text-zinc-300 font-bold py-2.5 sm:py-3 rounded-xl hover:bg-zinc-700 hover:text-white transition-colors text-xs sm:text-sm">
                    Try Another
                  </button>
                  <button onClick={resetSearch} className="w-full bg-zinc-800 text-zinc-300 font-bold py-2.5 sm:py-3 rounded-xl hover:bg-zinc-700 hover:text-white transition-colors text-xs sm:text-sm">
                    New Search
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={revealDestination} className="w-full bg-blue-600 text-white font-bold py-3.5 sm:py-4 rounded-xl transition-all hover:bg-blue-500 hover:scale-[1.02] shadow-lg shadow-blue-500/30 text-sm">Reveal Destination</button>
            )}
          </div>
        )}

        {!isSearching && !result && (
          <div className="flex flex-col gap-4 sm:gap-5">
            
            {/* NOVO BLOCO FLEXBOX PARA AS DATAS */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
              <div className="flex-1 w-full min-w-0">
                <label className="text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Departure</label>
                <input 
                  type="date" 
                  value={date} 
                  onChange={e => setDate(e.target.value)} 
                  className="w-full block box-border appearance-none bg-zinc-950 p-2.5 sm:p-3 rounded-xl border border-zinc-800 text-xs sm:text-sm font-medium mt-1 outline-none focus:border-blue-500 [color-scheme:dark]" 
                />
              </div>
              <div className="flex-1 w-full min-w-0">
                <label className="text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Return</label>
                <input 
                  type="date" 
                  value={returnDate} 
                  onChange={e => setReturnDate(e.target.value)} 
                  className="w-full block box-border appearance-none bg-zinc-950 p-2.5 sm:p-3 rounded-xl border border-zinc-800 text-xs sm:text-sm font-medium mt-1 outline-none focus:border-blue-500 [color-scheme:dark]" 
                />
              </div>
            </div>

            <div className="flex items-center justify-between bg-zinc-950 p-2.5 sm:p-3 rounded-xl border border-zinc-800 mt-1 sm:mt-2">
               <span className="text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Travelers</span>
               <div className="flex items-center gap-3 sm:gap-4">
                 <button onClick={() => setPassengers(Math.max(1, passengers-1))} className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-zinc-800 rounded-lg hover:bg-zinc-700 text-sm sm:text-lg font-bold">-</button>
                 <span className="font-bold text-sm">{passengers}</span>
                 <button onClick={() => setPassengers(passengers+1)} className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-zinc-800 rounded-lg hover:bg-zinc-700 text-sm sm:text-lg font-bold">+</button>
               </div>
            </div>

            <div className="mt-1 sm:mt-2">
              <div className="flex justify-between mb-2">
                <span className="text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Max Budget</span>
                <span className="font-bold text-sm">{budget}€</span>
              </div>
              <input type="range" min="100" max="2000" step="50" value={budget} onChange={e => setBudget(Number(e.target.value))} className="w-full accent-blue-500 cursor-pointer" />
            </div>

            <div className="mt-1 sm:mt-2">
              <label className="text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block">What's your Vibe?</label>
              <div className="grid grid-cols-2 gap-2">
                {moods.map(m => (
                  <button key={m} onClick={() => setMood(m)} className={`py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold border transition-all ${mood === m ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}>{m}</button>
                ))}
              </div>
            </div>

            <button onClick={handleSearch} disabled={!mood} className={`w-full py-3.5 sm:py-4 rounded-xl font-bold mt-2 transition-all text-sm ${mood ? 'bg-white text-black hover:bg-zinc-200 hover:scale-[1.02]' : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'}`}>Find Mystery Trip</button>
          </div>
        )}
      </div>
      
      <footer className="mt-8 text-zinc-500 text-[10px] sm:text-xs z-10 flex gap-4">
        <p>© 2026 ACASO - Mystery Trips</p>
        <a href="#" className="hover:text-white transition-colors">Privacy</a>
        <a href="#" className="hover:text-white transition-colors">Contact</a>
      </footer> 
    </main>
  );
}