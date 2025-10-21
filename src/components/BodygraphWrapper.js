'use client';

import { useState, useEffect } from 'react';
import BodyGraphHDGradient from './BodyGraphHDGradient';
import GateCard from './ui/GateCard';
import GateModal from './ui/GateModal';
import ChannelModal from './ui/ChannelModal';

export default function BodygraphWrapper({ sessionData }) {
  const [gatesData, setGatesData] = useState({});
  const [loadingGates, setLoadingGates] = useState(true);
  const [selectedGate, setSelectedGate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);

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

  const handleChannelClick = (channel) => {
    const [gate1, gate2] = channel.split('-').map(Number);
    
    // Mapowanie centrów dla kanałów (podstawowe mapowanie)
    const centerMap = {
      1: 'G', 2: 'Sacral', 3: 'Sacral', 4: 'Ajna', 5: 'Sacral', 6: 'Solar Plexus',
      7: 'G', 8: 'Throat', 9: 'Sacral', 10: 'G', 11: 'Ajna', 12: 'Throat',
      13: 'G', 14: 'Sacral', 15: 'G', 16: 'Throat', 17: 'Ajna', 18: 'Spleen',
      19: 'Root', 20: 'Throat', 21: 'Ego', 22: 'Throat', 23: 'Throat', 24: 'Ajna',
      25: 'G', 26: 'Ego', 27: 'Sacral', 28: 'Spleen', 29: 'Sacral', 30: 'Solar Plexus',
      31: 'G', 32: 'Spleen', 33: 'G', 34: 'Throat', 35: 'Throat', 36: 'Solar Plexus',
      37: 'Solar Plexus', 38: 'Spleen', 39: 'Root', 40: 'Solar Plexus', 41: 'Solar Plexus',
      42: 'Sacral', 43: 'Ajna', 44: 'Ego', 45: 'Ego', 46: 'Sacral', 47: 'Ajna',
      48: 'Spleen', 49: 'Root', 50: 'Sacral', 51: 'G', 52: 'Sacral', 53: 'Sacral',
      54: 'Spleen', 55: 'Root', 56: 'Ajna', 57: 'G', 58: 'Spleen', 59: 'Solar Plexus',
      60: 'Sacral', 61: 'Ajna', 62: 'Ajna', 63: 'Head', 64: 'Ajna'
    };

    const channelInfo = {
      channel: channel,
      gate1: gate1,
      gate2: gate2,
      center1: centerMap[gate1] || 'Unknown',
      center2: centerMap[gate2] || 'Unknown',
      description: `Kanał ${channel} łączy centra ${centerMap[gate1] || 'Unknown'} i ${centerMap[gate2] || 'Unknown'}, tworząc stabilne połączenie energetyczne.`,
      meaning: `Ten kanał reprezentuje stałe połączenie między centrami ${centerMap[gate1] || 'Unknown'} i ${centerMap[gate2] || 'Unknown'}, które jest zawsze aktywne w Twoim wykresie Human Design.`,
      gate1Info: gatesData[gate1] ? `${gatesData[gate1].name} - ${gatesData[gate1].theme}` : `Bramka ${gate1}`,
      gate2Info: gatesData[gate2] ? `${gatesData[gate2].name} - ${gatesData[gate2].theme}` : `Bramka ${gate2}`
    };

    setSelectedChannel(channelInfo);
    setIsChannelModalOpen(true);
  };

  const handleCloseChannelModal = () => {
    setIsChannelModalOpen(false);
    setSelectedChannel(null);
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
    <div className="bg-white rounded-lg shadow-lg">

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
          <div className="mt-8 pt-8 border-t border-gray-200 p-6">
            <h3 className="text-xl font-semibold mb-4">Zdefiniowane Kanały</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {definedChannels.map((channel) => {
                const [gate1, gate2] = channel.split('-').map(Number);
                return (
                  <div
                    key={channel}
                    className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:bg-blue-100 transition cursor-pointer"
                    onClick={() => handleChannelClick(channel)}
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
        <div className="mt-8 pt-8 border-t border-gray-200 p-6">
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

      <ChannelModal
        channelInfo={selectedChannel}
        isOpen={isChannelModalOpen}
        onClose={handleCloseChannelModal}
      />
    </>
  );
}
