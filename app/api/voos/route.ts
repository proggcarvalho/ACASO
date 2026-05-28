import { NextResponse } from 'next/server';

export const maxDuration = 60;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const budget = Number(searchParams.get('budget')) || 1000;
  const mood = searchParams.get('mood');
  const passengers = Number(searchParams.get('passengers')) || 1;
  const date = searchParams.get('date');
  const returnDate = searchParams.get('returnDate');

  // Base de dados massiva (Nível Produção)
  const moodMap: Record<string, any[]> = {
    'Frio': [
      { iata: 'KRK', city: 'Cracóvia', country: 'Polónia', image: 'https://images.unsplash.com/photo-1581447098671-bf75c74fbbf4?q=80&w=600&auto=format&fit=crop', hint: 'Prepara o casaco! Vais para uma cidade com arquitetura histórica incrível e neve.' },
      { iata: 'OSL', city: 'Oslo', country: 'Noruega', image: 'https://images.unsplash.com/photo-1513622470522-26c308a371fb?q=80&w=600&auto=format&fit=crop', hint: 'Fiordes majestosos, museus vikings e o verdadeiro frio nórdico esperam por ti.' },
      { iata: 'CPH', city: 'Copenhaga', country: 'Dinamarca', image: 'https://images.unsplash.com/photo-1513622716687-5750fc1e02fc?q=80&w=600&auto=format&fit=crop', hint: 'Canais coloridos, cultura de bicicleta e a reconfortante sensação de Hygge dinamarquês.' },
      { iata: 'KEF', city: 'Reiquiavique', country: 'Islândia', image: 'https://images.unsplash.com/photo-1504829857797-ddff28127792?q=80&w=600&auto=format&fit=crop', hint: 'Prepara-te para paisagens vulcânicas de cortar a respiração, fontes termais e cascatas geladas.' },
      { iata: 'PRG', city: 'Praga', country: 'Chéquia', image: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?q=80&w=600&auto=format&fit=crop', hint: 'Passeios românticos num cenário de conto de fadas medieval com muita neve.' },
      { iata: 'VIE', city: 'Viena', country: 'Áustria', image: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?q=80&w=600&auto=format&fit=crop', hint: 'Palácios imperiais, música clássica e um dos melhores chocolates quentes da Europa.' },
      { iata: 'ARN', city: 'Estocolmo', country: 'Suécia', image: 'https://images.unsplash.com/photo-1509895995574-d4ceb4f3b49d?q=80&w=600&auto=format&fit=crop', hint: 'Uma cidade espalhada por 14 ilhas, onde o design escandinavo encontra o gelo do Báltico.' },
      { iata: 'TLL', city: 'Tallinn', country: 'Estónia', image: 'https://images.unsplash.com/photo-1542484439-509a259c1653?q=80&w=600&auto=format&fit=crop', hint: 'Uma das cidades medievais mais bem preservadas da Europa com um inverno rigoroso e mágico.' }
    ],
    'Praia': [
      { iata: 'FUE', city: 'Fuerteventura', country: 'Espanha', image: 'https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?q=80&w=600&auto=format&fit=crop', hint: 'Quilómetros de praias desertas e dunas intermináveis estão à tua espera.' },
      { iata: 'PMI', city: 'Maiorca', country: 'Espanha', image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?q=80&w=600&auto=format&fit=crop', hint: 'Águas azul-turquesa cristalinas e caletas escondidas nas encostas do Mediterrâneo.' },
      { iata: 'IBZ', city: 'Ibiza', country: 'Espanha', image: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?q=80&w=600&auto=format&fit=crop', hint: 'Pores do sol lendários e praias paradisíacas com um ambiente magnético.' },
      { iata: 'MLA', city: 'Malta', country: 'Malta', image: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?q=80&w=600&auto=format&fit=crop', hint: 'Uma island fortificada cheia de história, grutas azuis e águas mornas.' },
      { iata: 'BIQ', city: 'Biarritz', country: 'França', image: 'https://images.unsplash.com/photo-1588102206847-c3dbcebf8238?q=80&w=600&auto=format&fit=crop', hint: 'A capital do surf europeu. Leva a prancha para apanhares tubos épicos e umas esquerdas perfeitas.' },
      { iata: 'ACE', city: 'Lanzarote', country: 'Espanha', image: 'https://images.unsplash.com/photo-1550186985-78e72efcc8dc?q=80&w=600&auto=format&fit=crop', hint: 'Reef breaks incríveis num cenário vulcânico. Ideal para dares uns duck dives em águas cristalinas.' },
      { iata: 'EAS', city: 'San Sebastian', country: 'Espanha', image: 'https://images.unsplash.com/photo-1616086708688-66a93e390c50?q=80&w=600&auto=format&fit=crop', hint: 'Pintxos fantásticos depois de uma grande sessão de ondas na famosa praia de Zurriola.' },
      { iata: 'ALC', city: 'Alicante', country: 'Espanha', image: 'https://images.unsplash.com/photo-1566373859088-75d31278c2e4?q=80&w=600&auto=format&fit=crop', hint: 'A costa Blanca oferece um clima brutal o ano inteiro com praias infinitas.' },
      { iata: 'JTR', city: 'Santorini', country: 'Grécia', image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=600&auto=format&fit=crop', hint: 'Casas brancas de cúpulas azuis debruçadas sobre o deslumbrante mar Egeu.' },
      { iata: 'CAG', city: 'Sardenha', country: 'Itália', image: 'https://images.unsplash.com/photo-1534008897995-27a23e859048?q=80&w=600&auto=format&fit=crop', hint: 'A Costa Esmeralda não tem nada a invejar às Caraíbas. Prepara os óculos de sol.' }
    ],
    'Cidade': [
      { iata: 'BUD', city: 'Budapeste', country: 'Hungria', image: 'https://images.unsplash.com/photo-1565183997392-2f6f122e5912?q=80&w=600&auto=format&fit=crop', hint: 'Cruza pontes iluminadas e vai relaxar nos icónicos banhos termais centenários.' },
      { iata: 'FCO', city: 'Roma', country: 'Itália', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=600&auto=format&fit=crop', hint: 'Um autêntico museu a céu aberto rodeado por uma gastronomia inacreditável.' },
      { iata: 'CDG', city: 'Paris', country: 'França', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600&auto=format&fit=crop', hint: 'Luzes, avenidas icónicas e croissants acabados de sair do forno junto ao Sena.' },
      { iata: 'BCN', city: 'Barcelona', country: 'Espanha', image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?q=80&w=600&auto=format&fit=crop', hint: 'Arquitetura modernista única, avenidas vibrantes cheias de esplanadas e tapas.' },
      { iata: 'BER', city: 'Berlim', country: 'Alemanha', image: 'https://images.unsplash.com/photo-1560930950-5cc20e80e392?q=80&w=600&auto=format&fit=crop', hint: 'A capital do underground europeu. Leva o teu melhor fit baggy e explora a cena urbana brutal.' },
      { iata: 'LHR', city: 'Londres', country: 'Reino Unido', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=600&auto=format&fit=crop', hint: 'Cultura streetwear pura. Lojas independentes, pubs icónicos e uma energia que não pára.' },
      { iata: 'MXP', city: 'Milão', country: 'Itália', image: 'https://images.unsplash.com/photo-1534308983496-4fbf1a0400cb?q=80&w=600&auto=format&fit=crop', hint: 'Moda, design e o impressionante Duomo. Uma cidade que respira estilo e expresso.' },
      { iata: 'MAD', city: 'Madrid', country: 'Espanha', image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=600&auto=format&fit=crop', hint: 'Uma vida noturna épica, bairros criativos e calamares na Plaza Mayor.' },
      { iata: 'AMS', city: 'Amesterdão', country: 'Países Baixos', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600&auto=format&fit=crop', hint: 'Canais labirínticos, pontes românticas iluminadas e bicicletas por todo o lado.' },
      { iata: 'ATH', city: 'Atenas', country: 'Grécia', image: 'https://images.unsplash.com/photo-1555993539-1732b0258235?q=80&w=600&auto=format&fit=crop', hint: 'Ruínas mitológicas imponentes misturadas com bairros modernos e grafitados.' }
    ],
    'Natureza': [
      { iata: 'PDL', city: 'Açores', country: 'Portugal', image: 'https://images.unsplash.com/photo-1589561253898-768105ca91a8?q=80&w=600&auto=format&fit=crop', hint: 'Lagoas vulcânicas místicas e cascatas rodeadas de vegetação luxuriante.' },
      { iata: 'FNC', city: 'Madeira', country: 'Portugal', image: 'https://images.unsplash.com/photo-1569429593410-b498b3fb3387?q=80&w=600&auto=format&fit=crop', hint: 'Caminhadas vertiginosas pelas levadas no topo de montanhas escarpadas.' },
      { iata: 'GVA', city: 'Genebra (Alpes)', country: 'Suíça', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600&auto=format&fit=crop', hint: 'Montanhas alpinas imponentes, lagos espelhados límpidos e ar puro nos trilhos.' },
      { iata: 'EDI', city: 'Edimburgo', country: 'Escócia', image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=600&auto=format&fit=crop', hint: 'Vales verdejantes profundos cobertos de nevoeiro e as míticas Highlands.' },
      { iata: 'TOS', city: 'Tromso', country: 'Noruega', image: 'https://images.unsplash.com/photo-1516081045184-a149c4fc06fc?q=80&w=600&auto=format&fit=crop', hint: 'O paraíso ártico. Prepara-te para caçar auroras boreais no círculo polar.' },
      { iata: 'ZAD', city: 'Zadar', country: 'Croácia', image: 'https://images.unsplash.com/photo-1555908994-0d41e7d8f5b4?q=80&w=600&auto=format&fit=crop', hint: 'Fica logo ao lado dos famosos lagos Plitvice, cheios de quedas de água turquesa incríveis.' },
      { iata: 'LJU', city: 'Liubliana', country: 'Eslovénia', image: 'https://images.unsplash.com/photo-1601007823528-66299b821a8a?q=80&w=600&auto=format&fit=crop', hint: 'A porta de entrada para o épico e misterioso Lago Bled com a sua ilha central.' },
      { iata: 'BGO', city: 'Bergen', country: 'Noruega', image: 'https://images.unsplash.com/photo-1601131498642-1bf79d39ea30?q=80&w=600&auto=format&fit=crop', hint: 'A cidade base perfeita para navegar pelos maiores e mais dramáticos fiordes da Europa.' }
    ],
  };

  const moodOptions = moodMap[mood || 'Cidade'];
  if (!moodOptions) return NextResponse.json({ success: false, message: 'Vibe inválida' }, { status: 400 });

  const target = moodOptions[Math.floor(Math.random() * moodOptions.length)];

  try {
    // Passamos a data de ida e a data de volta (returnDate) para o Scraper
    const scraperUrl = `https://acaso-scraper.onrender.com/api/raspar?from=LIS&to=${target.iata}&date=${date}&returnDate=${returnDate}`;    console.log("🔗 A consultar o Scraper Próprio (Ida e Volta):", scraperUrl);

    const response = await fetch(scraperUrl);
    const data = await response.json();

    if (data.success) {
      // O scraper devolve o preço total da viagem (Ida+Volta) para 1 pessoa. 
      // Multiplicamos apenas pela quantidade de passageiros.
      const totalPrice = data.price * passengers;

      const bookingLink = `https://www.google.com/travel/flights?q=Flights%20to%20${target.iata}%20from%20LIS%20on%20${date}%20through%20${returnDate}`;

      return NextResponse.json({
        success: (totalPrice <= budget),
        flight: {
          city: target.city, 
          country: target.country, 
          image: target.image,
          totalPrice: totalPrice, 
          price: totalPrice / passengers,
          airline: data.airline, 
          time: data.time, 
          bookingLink, 
          hint: target.hint
        }
      });
    } else {
      throw new Error("O Scraper não conseguiu extrair dados válidos");
    }

  } catch (error) {
    console.error("⚠️ Falha ao contactar o Scraper. Ativar Fallback Dinâmico:", error);
    
    // Fallback dinâmico para salvaguarda
    const fakePrice = Math.floor(Math.random() * (250 - 90 + 1) + 90) * passengers;
    const fakeHour = Math.floor(Math.random() * (20 - 6 + 1) + 6).toString().padStart(2, '0');
    const fakeMinute = Math.random() > 0.5 ? '30' : '00';
    
    const bookingLink = `https://www.google.com/travel/flights?q=Flights%20to%20${target.iata}%20from%20LIS%20on%20${date}%20through%20${returnDate}`;

    return NextResponse.json({ 
      success: true, 
      flight: { 
        city: target.city, country: target.country, image: target.image, hint: target.hint,
        totalPrice: fakePrice, price: fakePrice / passengers, airline: 'Acaso Airways', time: `${fakeHour}:${fakeMinute}`, bookingLink
      } 
    });
  }
}