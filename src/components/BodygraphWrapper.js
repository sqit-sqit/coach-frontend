'use client';

import { useState, useEffect } from 'react';
import BodyGraphHDGradient from './BodyGraphHDGradient';
import GateCard from './ui/GateCard';
import GateModal from './ui/GateModal';

export default function BodygraphWrapper({ sessionData }) {
  const [gatesData, setGatesData] = useState({});
  const [loadingGates, setLoadingGates] = useState(true);
  const [selectedGate, setSelectedGate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchGatesData = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        console.log('Fetching gates data from:', `${API_URL}/hd/gates/pl`);
        const response = await fetch(`${API_URL}/hd/gates/pl`);
        if (response.ok) {
          const data = await response.json();
          console.log('Gates data loaded:', data);
          setGatesData(data);
        } else {
          console.error('Failed to fetch gates data:', response.status);
        }
      } catch (error) {
        console.error('Error fetching gates data:', error);
      } finally {
        setLoadingGates(false);
      }
    };

    fetchGatesData();
  }, []);

  const handleGateClick = (gateNumber, gateInfo) => {
    setSelectedGate({
      gateNumber,
      ...gateInfo
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGate(null);
  };

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
    <>
    <div className="bg-white p-8 rounded-lg shadow-lg">

        {/* Bodygraph z panelami - responsive layout */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-4 lg:gap-6">
          {/* Bodygraph */}
          <div className="order-1">
            <BodyGraphHDGradient 
              definedCenters={definedCenters}
              definedChannels={definedChannels}
              activeGates={activeGates}
            />
          </div>

          {/* Combined Design & Personality Panel */}
          <div className="flex flex-col items-center order-2 sm:order-1">
            <h3 className="font-semibold text-gray-800 mb-2 text-center text-xs md:text-sm">Design & Personality</h3>
            <div className="min-w-20 md:min-w-24 lg:min-w-28 max-w-32 md:max-w-36 lg:max-w-40 bg-gray-50 border border-gray-200 rounded-lg p-2 md:p-3">
              <div className="space-y-1">
                {design.map((dActivation, idx) => {
                  // Znajdź odpowiadającą aktywację Personality dla tej samej planety
                  const pActivation = personality.find(p => p.planet === dActivation.planet);
                  
                  return (
                    <div key={`combined-${idx}`} className="flex items-center justify-between bg-white rounded px-2 py-1 text-xs md:text-sm gap-1 md:gap-2">
                      <span className="font-medium text-rose-700 flex-shrink-0 min-w-0">{fmt(dActivation)}</span>
                      <span className="font-bold text-gray-800 text-lg flex-shrink-0">{planetSymbols[dActivation.planet] || dActivation.planet}</span>
                      <span className="font-medium text-gray-900 flex-shrink-0 min-w-0">{pActivation ? fmt(pActivation) : '-'}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Channels Section */}
        {definedChannels && definedChannels.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-semibold mb-4">Zdefiniowane Kanały</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {definedChannels.map((channel) => {
                const [gate1, gate2] = channel.split('-').map(Number);
                return (
                  <div
                    key={channel}
                    className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:bg-blue-100 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {gate1}
                        </div>
                        <span className="text-blue-600 font-semibold">-</span>
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {gate2}
                        </div>
                      </div>
                      <span className="text-blue-700 text-sm font-medium">
                        Kanał {channel}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Gates Section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-xl font-semibold mb-4">Aktywne Bramki (Gates)</h3>
          {loadingGates ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Ładowanie danych bramek...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {activeGates.sort((a, b) => a - b).map((gate) => {
                const isDesign = designGates.has(gate);
                const isPersonality = personalityGates.has(gate);
                const isBoth = isDesign && isPersonality;
                const gateInfo = gatesData[gate];
                
                const activationType = isBoth ? 'both' : isDesign ? 'design' : isPersonality ? 'personality' : 'none';
                
                console.log(`Rendering gate ${gate}:`, { isDesign, isPersonality, isBoth, gateInfo, activationType });
                
                return (
                  <GateCard
                    key={gate}
                    gateNumber={gate}
                    gateInfo={gateInfo}
                    activationType={activationType}
                    onClick={() => handleGateClick(gate, gateInfo)}
                  />
                );
              })}
            </div>
          )}
        </div>

      </div>

      <GateModal
        gateInfo={selectedGate}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
