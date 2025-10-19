'use client';

import React from "react";

export default function BodyGraphHDGradient({
  definedCenters = [],
  definedChannels = [],
  activeGates = [],
}) {
  // --- 1️⃣ Pozycje centrów
  const CENTER_POS = {
    "Head": [300, 30],
    "Ajna": [300, 150],
    "Throat": [300, 270],
    "G": [300, 390],
    "Ego": [400, 460],
    "Solar Plexus": [480, 550],
    "Spleen": [120, 550],
    "Sacral": [300, 550],
    "Root": [300, 670],
  };

  // --- 2️⃣ Kształty i kolory gradientów (zwiększone Head/Ajna/Throat)
  const CENTER_STYLE = {
    "Head": ["triangle", { orientation: "down", size: 44, color: "#FFD700" }],
    "Ajna": ["triangle", { orientation: "up", size: 44, color: "#ADFF2F" }],
    "Throat": ["square", { size: 84, color: "#87CEFA" }],
    "G": ["diamond", { size: 120, color: "#FFB6C1" }],
    "Ego": ["triangle", { orientation: "right", size: 44, color: "#FF6347" }],
    "Solar Plexus": ["triangle", { orientation: "left", size: 44, color: "#FF8C00" }],
    "Spleen": ["triangle", { orientation: "right", size: 44, color: "#9ACD32" }],
    "Sacral": ["square", { size: 84, color: "#E74C3C" }],
    "Root": ["square", { size: 84, color: "#A0522D" }],
  };

  // --- 3️⃣ Mapowanie bramek do centrów
  const GATE_CENTER = {
    61:"Head",63:"Head",64:"Head",
    47:"Ajna",24:"Ajna",4:"Ajna",11:"Ajna",17:"Ajna",43:"Ajna",
    62:"Throat",23:"Throat",56:"Throat",20:"Throat",16:"Throat",
    12:"Throat",31:"Throat",8:"Throat",33:"Throat",45:"Throat",35:"Throat",
    1:"G",2:"G",7:"G",10:"G",13:"G",15:"G",25:"G",46:"G",
    21:"Ego",26:"Ego",40:"Ego",51:"Ego",
    6:"Solar Plexus",22:"Solar Plexus",37:"Solar Plexus",
    36:"Solar Plexus",30:"Solar Plexus",49:"Solar Plexus",55:"Solar Plexus",
    18:"Spleen",28:"Spleen",32:"Spleen",44:"Spleen",50:"Spleen",57:"Spleen",48:"Spleen",
    5:"Sacral",9:"Sacral",14:"Sacral",29:"Sacral",34:"Sacral",42:"Sacral",59:"Sacral",27:"Sacral",3:"Sacral",
    38:"Root",39:"Root",41:"Root",52:"Root",53:"Root",54:"Root",58:"Root",60:"Root",19:"Root",
  };

  // --- 4️⃣ Rozmieszczenie bramek (korygowane dla Head/Ajna/Throat)
  const GATE_OFFSETS = {
    // HEAD – 3 bramki szerzej rozmieszczone u podstawy
    61:[0,34], 63:[26,34], 64:[-26,34],

    // AJNA – dwa rzędy (górny i dolny)
    47:[-26,-34], 4:[26,-34], 24:[0,-34],
    17:[-15,-2], 11:[15,-2], 43:[0,30],

    // THROAT – rozłożone równomiernie na 3 krawędziach
    62:[-20,-33], 56:[20,-33], 23:[0,-33],
    35:[33,-19], 12:[33,0], 45:[33,19],
    16:[-33,-12], 20:[-33,8],
    31:[-20,33], 8:[0,33], 33:[20,33],  
    

    // G
    1:[0,-45], 
    7:[-20,-25], 13:[20,-25],
    10:[-45,0], 25:[45,0],
    15:[-20,25],  46:[20,25],
    2:[0,45],  

    // EGO
    21:[-3,-45],51:[-23,-25], 26:[-43,-5], 40:[15,15], 

    // SOLAR PLEXUS (lustrzane w poziomie)
    36:[34,-28], 22:[17,-20], 37:[0,-12],
    6:[-20,0], 49:[-3,8], 55:[14,16], 30:[32,26],  

    // SPLEEN (lustrzane w poziomie)
    48:[-34,-28], 57:[-16,-19], 44:[2,-10], 50:[20,0],
    18:[-34,28], 28:[-16,19], 32:[2,10],    

    // SACRAL
    5:[-20,-33],  14:[0,-33], 29:[20,-33], 
    34:[-33,-12], 27:[-33,8],
    42:[-20,33], 3:[0,33], 9:[20,33],
    59:[33,19],

    // ROOT
    53:[-20,-33], 60:[0,-33], 52:[20,-33],
    19:[33,-19], 39:[33,0], 41:[33,19], 
    54:[-33,-19], 38:[-33,0], 58:[-33,19],  
  };

  // --- 5️⃣ Kanały (bez zmian)
  const CHANNELS = [
    [1,8],[2,14],[3,60],[4,63],[5,15],[6,59],[7,31],[9,52],[10,20],[10,34],
    [10,57],[11,56],[12,22],[13,33],[14,2],[15,5],[16,48],[17,62],[18,58],[19,49],
    [20,34],[20,57],[21,45],[23,43],[24,61],[25,51],[26,44],[27,50],[28,38],[29,46],
    [30,41],[32,54],[35,36],[37,40],[39,55],[42,53],[47,64]
  ].map(([a,b]) => [Math.min(a,b), Math.max(a,b)]);

  // --- 6️⃣ Pomocnicze funkcje
  const canon = (s) => {
    const [a, b] = s.split("-").map((n) => parseInt(n, 10));
    return `${Math.min(a,b)}-${Math.max(a,b)}`;
  };

  const activeChannelSet = new Set(definedChannels.map(canon));
  const activeGateSet = new Set(activeGates || []);

  const gatePos = (g) => {
    const c = GATE_CENTER[g];
    const [cx, cy] = CENTER_POS[c];
    const [dx, dy] = GATE_OFFSETS[g] || [0, 0];
    return [cx + dx, cy + dy];
  };

  const getCurvedPathData = (x1, y1, x2, y2, gateA, gateB) => {
    // Lista kanałów które mają być prostymi liniami
    const straightChannels = [
      [47,64], [24,61], [4,63], [17,62], [11,56], [23,43], [7,31], [1,8], [13,33], [15,5], [2,14], [29,46], [42,53], [3,60], [9,52],
    ];
    
    // Sprawdź czy to kanał prosty na podstawie numerów bramek
    const isStraight = straightChannels.some(([a,b]) => 
      (a === gateA && b === gateB) || (a === gateB && b === gateA)
    );
    
    if (isStraight) {
      // Linia prosta
      return `M ${x1} ${y1} L ${x2} ${y2}`;
    }
    
    // Specjalna krzywizna w dół dla kanałów [30,41], [50,27], [6,59], [25,51]
    const isDownCurve = 
      (gateA === 30 && gateB === 41) || (gateA === 41 && gateB === 30) ||
      (gateA === 50 && gateB === 27) || (gateA === 27 && gateB === 50) ||
      (gateA === 6 && gateB === 59) || (gateA === 59 && gateB === 6) ||
      (gateA === 25 && gateB === 51) || (gateA === 51 && gateB === 25);
    
    // Specjalna krzywizna w górę - wyłączone, bo [36,35] i [12,22] są teraz w isExtraLargeCurve
    const isUpCurve = false;
    
    // Większy promień krzywizny dla kanału [10,34]
    const isLargeCurve = 
      (gateA === 10 && gateB === 34) || (gateA === 34 && gateB === 10);
    
    // Bardzo duży promień krzywizny dla kanałów [48,16], [57,20], [35,36], [12,22]
    const isExtraLargeCurve = 
      (gateA === 48 && gateB === 16) || (gateA === 16 && gateB === 48) ||
      (gateA === 57 && gateB === 20) || (gateA === 20 && gateB === 57) ||
      (gateA === 35 && gateB === 36) || (gateA === 36 && gateB === 35) ||
      (gateA === 12 && gateB === 22) || (gateA === 22 && gateB === 12);
    
    // Super duży promień krzywizny dla kanału [20,34]
    const isSuperLargeCurve = 
      (gateA === 20 && gateB === 34) || (gateA === 34 && gateB === 20);
    
    if (isDownCurve) {
      // Krzywizna w dół
      const dx = x2 - x1;
      const dy = y2 - y1;
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      const len = Math.hypot(dx, dy) || 1;
      const nx = dy / len;  // Odwrócone dla krzywizny w dół
      const ny = -dx / len; // Odwrócone dla krzywizny w dół
      const offset = 28;
      const cx = mx + nx * offset;
      const cy = my + ny * offset;
      return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
    }
    
    if (isUpCurve) {
      // Krzywizna w górę (przeciwieństwo standardowej)
      const dx = x2 - x1;
      const dy = y2 - y1;
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len; // Standardowe dla krzywizny w górę
      const ny = dx / len;  // Standardowe dla krzywizny w górę
      const offset = -28; // Ujemny offset dla krzywizny w górę
      const cx = mx + nx * offset;
      const cy = my + ny * offset;
      return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
    }
    
    if (isSuperLargeCurve) {
      // Super duży promień krzywizny dla kanału [20,34]
      const dx = x2 - x1;
      const dy = y2 - y1;
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len;
      const ny = dx / len;
      const offset = 120; // Super duży offset dla super dużej krzywizny
      const cx = mx + nx * offset;
      const cy = my + ny * offset;
      return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
    }
    
    if (isExtraLargeCurve) {
      // Bardzo duży promień krzywizny
      const dx = x2 - x1;
      const dy = y2 - y1;
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len;
      const ny = dx / len;
      
      // Sprawdź czy to kanały które powinny mieć krzywiznę w górę
      const isUpwardCurve = 
        (gateA === 35 && gateB === 36) || (gateA === 36 && gateB === 35) ||
        (gateA === 12 && gateB === 22) || (gateA === 22 && gateB === 12);
      
      const offset = isUpwardCurve ? -80 : 80; // Ujemny offset dla krzywizny w górę
      const cx = mx + nx * offset;
      const cy = my + ny * offset;
      return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
    }
    
    if (isLargeCurve) {
      // Większy promień krzywizny
      const dx = x2 - x1;
      const dy = y2 - y1;
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len;
      const ny = dx / len;
      const offset = 50; // Większy offset dla większego promienia
      const cx = mx + nx * offset;
      const cy = my + ny * offset;
      return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
    }
    
    // Domyślna krzywa
    const dx = x2 - x1;
    const dy = y2 - y1;
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const offset = 28;
    const cx = mx + nx * offset;
    const cy = my + ny * offset;
    return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
  };

  const curvedPath = (x1, y1, x2, y2, width, color, key, gateA, gateB) => {
    // Lista kanałów które mają być prostymi liniami
    const straightChannels = [
      [47,64], [24,61], [4,63], [17,62], [11,56], [23,43], [7,31], [1,8], [13,33], [15,5], [2,14], [29,46], [42,53], [3,60], [9,52],
    ];
    
    // Sprawdź czy to kanał prosty na podstawie numerów bramek
    const isStraight = straightChannels.some(([a,b]) => 
      (a === gateA && b === gateB) || (a === gateB && b === gateA)
    );
    
    if (isStraight) {
      // Linia prosta
      const d = `M ${x1} ${y1} L ${x2} ${y2}`;
      return <path key={key} d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" />;
    }
    
    // Specjalna krzywizna w dół dla kanałów [30,41], [50,27], [6,59], [25,51]
    const isDownCurve = 
      (gateA === 30 && gateB === 41) || (gateA === 41 && gateB === 30) ||
      (gateA === 50 && gateB === 27) || (gateA === 27 && gateB === 50) ||
      (gateA === 6 && gateB === 59) || (gateA === 59 && gateB === 6) ||
      (gateA === 25 && gateB === 51) || (gateA === 51 && gateB === 25);
    
    // Specjalna krzywizna w górę dla kanałów [36,35], [12,22]
    const isUpCurve = 
      (gateA === 36 && gateB === 35) || (gateA === 35 && gateB === 36) ||
      (gateA === 12 && gateB === 22) || (gateA === 22 && gateB === 12);
    
    // Większy promień krzywizny dla kanałów [10,34], [20,34]
    const isLargeCurve = 
      (gateA === 10 && gateB === 34) || (gateA === 34 && gateB === 10) ||
      (gateA === 20 && gateB === 34) || (gateA === 34 && gateB === 20);
    
    if (isDownCurve) {
      // Krzywizna w dół
      const dx = x2 - x1;
      const dy = y2 - y1;
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      const len = Math.hypot(dx, dy) || 1;
      const nx = dy / len;  // Odwrócone dla krzywizny w dół
      const ny = -dx / len; // Odwrócone dla krzywizny w dół
      const offset = 28;
      const cx = mx + nx * offset;
      const cy = my + ny * offset;
      const d = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
      return <path key={key} d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" />;
    }
    
    if (isUpCurve) {
      // Krzywizna w górę (przeciwieństwo standardowej)
      const dx = x2 - x1;
      const dy = y2 - y1;
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len; // Standardowe dla krzywizny w górę
      const ny = dx / len;  // Standardowe dla krzywizny w górę
      const offset = -28; // Ujemny offset dla krzywizny w górę
      const cx = mx + nx * offset;
      const cy = my + ny * offset;
      const d = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
      return <path key={key} d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" />;
    }
    
    if (isLargeCurve) {
      // Większy promień krzywizny
      const dx = x2 - x1;
      const dy = y2 - y1;
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len;
      const ny = dx / len;
      const offset = 50; // Większy offset dla większego promienia
      const cx = mx + nx * offset;
      const cy = my + ny * offset;
      const d = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
      return <path key={key} d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" />;
    }
    
    // Domyślna krzywa
    const dx = x2 - x1;
    const dy = y2 - y1;
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const offset = 28;
    const cx = mx + nx * offset;
    const cy = my + ny * offset;
    const d = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
    return <path key={key} d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" />;
  };

  // --- 7️⃣ Render
  return (
    <div className="flex justify-center">
      <svg
        width="100%"
        height="auto"
        viewBox="0 -20 600 760"
        className="max-w-[400px] sm:max-w-[500px] md:w-auto md:h-[500px] lg:h-[600px] xl:h-[700px] md:max-w-none bg-white rounded-xl shadow"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Gradienty centrów */}
        <defs>
          {Object.entries(CENTER_STYLE).map(([name,[shape,cfg]]) => (
            <linearGradient key={name} id={`grad-${name}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={cfg.color} stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
            </linearGradient>
          ))}
        </defs>

        {/* Kanały - tło (czerwone wypełnienie z czarnym obramowaniem) */}
        {CHANNELS.map(([a,b], index) => {
          const [x1,y1] = gatePos(a);
          const [x2,y2] = gatePos(b);
          const d = getCurvedPathData(x1,y1,x2,y2, a, b);
          return (
            <g key={`bg-${a}-${b}-${index}`}>
              <path d={d} fill="none" stroke="#000" strokeWidth="8" strokeLinecap="round" />
              <path d={d} fill="none" stroke="#9ca3af" strokeWidth="6" strokeLinecap="round" />
            </g>
          );
        })}
        
        {/* Kanały - aktywne (niebieskie wypełnienie z czarnym obramowaniem) */}
        {CHANNELS.map(([a,b], index) => {
          const key=`${a}-${b}`;
          if (!activeChannelSet.has(key)) return null;
          const [x1,y1]=gatePos(a);
          const [x2,y2]=gatePos(b);
          const d = getCurvedPathData(x1,y1,x2,y2, a, b);
          return (
            <g key={`act-${a}-${b}-${index}`}>
              <path d={d} fill="none" stroke="#000" strokeWidth="8" strokeLinecap="round" />
              <path d={d} fill="none" stroke="#2563eb" strokeWidth="6" strokeLinecap="round" />
            </g>
          );
        })}

        {/* Centra */}
        {Object.entries(CENTER_STYLE).map(([name,[shape,cfg]])=>{
          const [cx,cy]=CENTER_POS[name];
          const filled=definedCenters.includes(name);
          const fill=filled?`url(#grad-${name})`:"#ffffff";
          const stroke=filled?"#166534":"#475569";
          const sw=filled?3:2;
        if(shape==="square"){
          const s=cfg.size;
          return <rect key={name} x={cx-s/2} y={cy-s/2} width={s} height={s} fill={fill} stroke={stroke} strokeWidth={sw} rx="8" ry="8"/>;
        }
          if(shape==="diamond"){
            const s=cfg.size/2;
            return <polygon key={name} points={`${cx},${cy-s} ${cx+s},${cy} ${cx},${cy+s} ${cx-s},${cy}`} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round"/>;
          }
          if(shape==="triangle"){
            const h=cfg.size;
            let pts;
            if(cfg.orientation==="down") pts=`${cx},${cy-h} ${cx-h},${cy+h} ${cx+h},${cy+h}`;
            else if(cfg.orientation==="up") pts=`${cx},${cy+h} ${cx-h},${cy-h} ${cx+h},${cy-h}`;
            else if(cfg.orientation==="right") pts=`${cx-h},${cy-h} ${cx-h},${cy+h} ${cx+h},${cy}`;
            else if(cfg.orientation==="left") pts=`${cx+h},${cy-h} ${cx+h},${cy+h} ${cx-h},${cy}`;
            
            // Specjalna rotacja dla Ego
            if(name === "Ego") {
              return <polygon key={name} points={pts} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" transform={`rotate(45 ${cx} ${cy})`}/>;
            }
            
            return <polygon key={name} points={pts} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round"/>;
          }
        })}

        {/* Bramy */}
        {Object.keys(GATE_CENTER).map((gStr)=>{
          const g=parseInt(gStr,10);
          const [x,y]=gatePos(g);
          const isActive=activeGateSet.has(g);
          const fill=isActive?"#f97316":"#94a3b8";
          return(
            <g key={`gate-${g}`}>
              <circle cx={x} cy={y} r={8} fill={fill} stroke="#334155" strokeWidth="1.5"/>
              <text x={x} y={y+3.5} fontSize="9" textAnchor="middle" fill="#fff" fontWeight="600">
                {g}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}


