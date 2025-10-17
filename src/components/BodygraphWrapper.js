'use client';

import BodyGraphHDGradient from './BodyGraphHDGradient';

export default function BodygraphWrapper({ sessionData }) {
  if (!sessionData) {
    return <div>Ładowanie danych...</div>;
  }

  // Centra z backendu są już w tym samym formacie co w komponencie
  const definedCenters = sessionData.defined_centers || [];

  // Kanały już są w odpowiednim formacie
  const definedChannels = sessionData.defined_channels || [];
  const activeGates = sessionData.active_gates || [];

  // Grupowanie aktywacji planetarnych (Personality/Design)
  const activations = Array.isArray(sessionData.activations) ? sessionData.activations : [];
  const personality = activations.filter(a => a.side === 'Personality' && a.gate);
  const design = activations.filter(a => a.side === 'Design' && a.gate);
  const personalityGates = new Set(personality.map(a => a.gate));
  const designGates = new Set(design.map(a => a.gate));

  const fmt = (a) => `${a.gate}.${a.line}`;

  // Mapowanie symboli planet
  const planetSymbols = {
    'Sun': '☉',
    'Earth': '⊕', 
    'Moon': '☽',
    'Mercury': '☿',
    'Venus': '♀',
    'Mars': '♂',
    'Jupiter': '♃',
    'Saturn': '♄',
    'Uranus': '♅',
    'Neptune': '♆',
    'Pluto': '♇',
    'North Node': '☊',
    'South Node': '☋'
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{sessionData.name}</h2>
        <p className="text-gray-600">Human Design Bodygraph</p>
        <div className="mt-4 p-3 bg-green-100 border-2 border-green-500 rounded-lg">
          <p className="text-green-700 font-bold">✨ PROSTY I ELEGANCKI BODYGRAPH!</p>
        </div>
      </div>

      {/* Bodygraph z panelami po bokach */}
      <div className="flex items-start justify-center gap-6">
        {/* Design Panel (lewa strona) */}
        <div className="flex flex-col items-center">
          <h3 className="font-semibold text-rose-800 mb-3 text-center">Design</h3>
          <div className="w-25 bg-rose-50 border border-rose-200 rounded-lg p-4">
            <div className="space-y-2">
              {design.map((a, idx) => (
                <div key={`d-${idx}`} className="flex items-center justify-between bg-white/70 rounded px-2 py-1 text-lg">
                  <span className="text-gray-700">{planetSymbols[a.planet] || a.planet}</span>
                  <span className="font-medium text-rose-700">{fmt(a)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bodygraph */}
        <div className="flex-shrink-0">
          <BodyGraphHDGradient 
            definedCenters={definedCenters}
            definedChannels={definedChannels}
            activeGates={activeGates}
          />
        </div>

        {/* Personality Panel (prawa strona) */}
        <div className="flex flex-col items-center">
          <h3 className="font-semibold text-gray-800 mb-3 text-center">Personality</h3>
          <div className="w-25 bg-gray-100 border border-gray-200 rounded-lg p-4">
            <div className="space-y-2">
              {personality.map((a, idx) => (
                <div key={`p-${idx}`} className="flex items-center justify-between bg-white rounded px-2 py-1 text-lg">
                  <span className="font-medium text-gray-900">{fmt(a)}</span>
                  <span className="text-gray-700">{planetSymbols[a.planet] || a.planet}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>


      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-green-600 border border-green-800"></div>
          <span>Definiowane centrum</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-white border-2 border-gray-400 rounded"></div>
          <span>Niedefiniowane centrum</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-1 rounded bg-blue-600"></div>
          <span>Definiowany kanał</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-1 rounded bg-gray-300"></div>
          <span>Niedefiniowany kanał</span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg text-sm">
        <h3 className="font-semibold mb-2">Legenda kolorów:</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full bg-black"></span><span>Personality (czarne)</span></div>
          <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full bg-rose-600"></span><span>Design (czerwone)</span></div>
          <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full bg-[linear-gradient(90deg,black_0%,black_50%,#e11d48_50%,#e11d48_100%)]"></span><span>Obie strony</span></div>
        </div>
      </div>
    </div>
  );
}
