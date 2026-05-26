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
  
  // NOVOS ESTADOS: Passaporte e Feedback de Cópia
  const [passport, setPassport] = useState<any[]>([]);
  const [showPassport, setShowPassport] = useState(false);
  const [copied, setCopied] = useState(false);

  const moods = ['Frio', 'Praia', 'Cidade', 'Natureza'];

  const travelFacts = [
    "A contactar os radares do Google Flights...",
    "Sabias que o voo comercial mais curto do mundo dura apenas 57 segundos?",
    "A cruzar orçamentos, datas e rotas...",
    "A procurar a melhor escapadinha para o teu orçamento...",
    "Quase lá... a confirmar a disponibilidade do voo...",
    "Sabias que as janelas dos aviões são ovais para evitar quebras de pressão?"
  ];

  // CARREGAR O SAVE: Vai buscar as viagens antigas à memória do browser ao iniciar
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
    
    try {
      const response = await fetch(`/api/voos?budget=${budget}&mood=${mood}&passengers=${passengers}&date=${date}&returnDate=${returnDate}`);
      const data = await response.json();
      data.success ? setResult(data.flight) : setResult('not_found');
    } catch (error) {
      setResult('not_found');
    } finally {
      setIsSearching(false);
    }
  };

  // FUNÇÃO DE REVELAÇÃO: Mostra o destino e guarda no Passaporte!
  const revealDestination = () => {
    setIsRevealed(true);
    if (result) {
      const newEntry = { city: result.city, country: result.country, image: result.image };
      // Evitar destinos duplicados no passaporte
      if (!passport.some(entry => entry.city === newEntry.city)) {
        const newPassport = [...passport, newEntry];
        setPassport(newPassport);
        localStorage.setItem('acaso_passport', JSON.stringify(newPassport));
      }
    }
  };

  // FUNÇÃO DE PARTILHA
  const shareSurprise = () => {
    const text = `🤫 Prepara as malas! Tenho uma viagem surpresa para nós de ${new Date(date).toLocaleDateString('pt-PT')} a ${new Date(returnDate).toLocaleDateString('pt-PT')}. Só te digo que a vibe é ${mood}... Descobre o destino aqui: [Link em Breve]`;
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
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-zinc-50 p-6 relative">
      
      {/* BOTÃO DO PASSAPORTE NO TOPO */}
      <button 
        onClick={() => setShowPassport(true)}
        className="absolute top-6 right-6 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-zinc-800 transition-colors shadow-lg"
      >
        <span>🛂 Passaporte ({passport.length})</span>
      </button>

      {/* MODAL DO PASSAPORTE */}
      {showPassport && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-zinc-900 w-full max-w-lg rounded-3xl p-6 border border-zinc-800 shadow-2xl relative overflow-hidden">
            <button onClick={() => setShowPassport(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-white text-xl font-bold p-2">✕</button>
            <h2 className="text-2xl font-black mb-1">O Teu Passaporte</h2>
            <p className="text-zinc-500 text-sm mb-6">Coleção de destinos que já desbloqueaste.</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {passport.length === 0 ? (
                <p className="col-span-full text-center text-zinc-500 py-10 text-sm font-medium border border-dashed border-zinc-800 rounded-xl">Ainda não carimbaste o teu passaporte.<br/>Revela a tua primeira viagem!</p>
              ) : (
                passport.map((p, i) => (
                  <div key={i} className="relative group rounded-xl overflow-hidden aspect-[4/5] border border-zinc-800 cursor-pointer">
                    <img src={p.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={p.city} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-3">
                      <p className="text-[10px] text-zinc-400 uppercase font-bold leading-none">{p.country}</p>
                      <p className="text-sm font-black text-white truncate">{p.city}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <div className="text-center max-w-2xl mb-8 mt-12">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4 cursor-pointer" onClick={resetSearch}>
          Viagens às <span className="text-blue-500">Cegas</span>
        </h1>
        <p className="text-zinc-400">Ida e volta surpresa com preços reais do Google Flights.</p>
      </div>

      <div className="w-full max-w-md bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-2xl relative overflow-hidden min-h-[550px] flex flex-col justify-center">
        
        {isSearching && (
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-xl font-bold mb-3">A preparar a descolagem...</h2>
            <p key={factIndex} className="text-zinc-400 text-sm animate-in fade-in zoom-in-95 duration-500 min-h-[40px] px-2">
              {travelFacts[factIndex]}
            </p>
          </div>
        )}

        {!isSearching && result === 'not_found' && (
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-400 mb-4">Sem voos disponíveis</h2>
            <p className="text-zinc-400 mb-6 text-sm">O orçamento está apertado para essa vibe ou o destino sorteado está caro.</p>
            <div className="flex gap-3">
              <button onClick={handleSearch} className="w-full bg-blue-600 py-4 rounded-xl font-bold transition-colors hover:bg-blue-500 text-sm">Rodar Roleta Novamente</button>
              <button onClick={resetSearch} className="w-full bg-zinc-800 py-4 rounded-xl font-bold transition-colors hover:bg-zinc-700 text-sm">Mudar Filtros</button>
            </div>
          </div>
        )}

        {!isSearching && result && result !== 'not_found' && (
          <div className="animate-in fade-in duration-500">
            {isRevealed ? (
              <div className="bg-white text-zinc-900 rounded-2xl shadow-2xl overflow-hidden mb-6">
                <div className="h-32 w-full relative bg-zinc-200">
                    <img src={result.image} alt={result.city} className="w-full h-full object-cover animate-in fade-in duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20"></div>
                </div>
                <div className="p-5">
                  <h2 className="text-3xl font-black">{result.city}</h2>
                  <p className="text-zinc-500 font-bold mb-4">{result.country}</p>
                  
                  <div className="grid grid-cols-2 gap-4 border-t border-dashed pt-4">
                    <div>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase">Partida</p>
                      <p className="font-bold text-sm">{new Date(date).toLocaleDateString('pt-PT')}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase text-right">Regresso</p>
                      <p className="font-bold text-sm text-right">{new Date(returnDate).toLocaleDateString('pt-PT')}</p>
                    </div>
                    <div className="col-span-2 bg-zinc-100 p-3 rounded-xl flex justify-between items-center border border-zinc-200">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{result.airline}</span>
                      <span className="text-sm font-black text-blue-600">{result.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 mb-6">
                <p className="text-blue-500 font-bold text-xs uppercase mb-2">Destino Mistério Encontrado</p>
                <p className="text-zinc-300 italic leading-relaxed">"O teu destino com a vibe de {mood} está pronto. Estás a {passengers === 1 ? 'um clique' : 'um clique para todos'} de saber para onde vão."</p>
                <p className="text-zinc-500 text-xs mt-4">Dica: {result.hint}</p>
              </div>
            )}
            
            <div className="flex justify-between items-center mb-6">
              <span className="text-zinc-400 font-medium">Total (Ida e Volta):</span>
              <span className="text-2xl font-black">{result.totalPrice}€</span>
            </div>

            {isRevealed ? (
              <div className="flex flex-col gap-3">
                <a href={result.bookingLink} target="_blank" rel="noopener noreferrer" className="w-full bg-green-600 text-white text-center font-bold py-4 rounded-xl transition-all hover:bg-green-500 flex items-center justify-center gap-2">
                  <span>Reservar no Google Flights</span>
                </a>
                
                {/* BOTÃO DE PARTILHA SECRETA */}
                <button onClick={shareSurprise} className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl transition-all hover:bg-purple-500 flex items-center justify-center gap-2">
                  <span>{copied ? 'Mensagem Copiada! 🤫' : 'Enviar Surpresa no WhatsApp'}</span>
                </button>
                
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <button onClick={handleSearch} className="w-full bg-zinc-800 text-zinc-300 font-bold py-3 rounded-xl hover:bg-zinc-700 hover:text-white transition-colors text-sm">
                    Tentar Outro Sítio
                  </button>
                  <button onClick={resetSearch} className="w-full bg-zinc-800 text-zinc-300 font-bold py-3 rounded-xl hover:bg-zinc-700 hover:text-white transition-colors text-sm">
                    Nova Pesquisa
                  </button>
                </div>
              </div>
            ) : (
              // AGORA USAMOS A FUNÇÃO revealDestination PARA GUARDAR O SAVE
              <button onClick={revealDestination} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl transition-all hover:bg-blue-500 hover:scale-[1.02] shadow-lg shadow-blue-500/30">Revelar Destino</button>
            )}
          </div>
        )}

        {!isSearching && !result && (
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Partida</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-sm font-medium mt-1 outline-none focus:border-blue-500 [color-scheme:dark]" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Regresso</label>
                <input type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)} className="w-full bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-sm font-medium mt-1 outline-none focus:border-blue-500 [color-scheme:dark]" />
              </div>
            </div>

            <div className="flex items-center justify-between bg-zinc-950 p-3 rounded-xl border border-zinc-800 mt-2">
               <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Viajantes</span>
               <div className="flex items-center gap-4">
                 <button onClick={() => setPassengers(Math.max(1, passengers-1))} className="w-8 h-8 flex items-center justify-center bg-zinc-800 rounded-lg hover:bg-zinc-700 text-lg font-bold">-</button>
                 <span className="font-bold">{passengers}</span>
                 <button onClick={() => setPassengers(passengers+1)} className="w-8 h-8 flex items-center justify-center bg-zinc-800 rounded-lg hover:bg-zinc-700 text-lg font-bold">+</button>
               </div>
            </div>

            <div className="mt-2">
              <div className="flex justify-between mb-2">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Orçamento Total</span>
                <span className="font-bold">{budget}€</span>
              </div>
              <input type="range" min="100" max="2000" step="50" value={budget} onChange={e => setBudget(Number(e.target.value))} className="w-full accent-blue-500 cursor-pointer" />
            </div>

            <div className="mt-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Qual é a tua Vibe?</label>
              <div className="grid grid-cols-2 gap-2">
                {['Frio', 'Praia', 'Cidade', 'Natureza'].map(m => (
                  <button key={m} onClick={() => setMood(m)} className={`py-3 rounded-xl text-xs font-bold border transition-all ${mood === m ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}>{m}</button>
                ))}
              </div>
            </div>

            <button onClick={handleSearch} disabled={!mood} className={`w-full py-4 rounded-xl font-bold mt-2 transition-all ${mood ? 'bg-white text-black hover:bg-zinc-200 hover:scale-[1.02]' : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'}`}>Procurar Viagem</button>
          </div>
        )}
      </div>
    </main>
  );
}