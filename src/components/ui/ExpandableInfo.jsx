import { useState } from 'react';

/**
 * ExpandableInfo - Reusable expandable information component
 * 
 * @param {string} title - The title text to display
 * @param {string} icon - The icon to display ('i' for info, '?' for question, or custom text)
 * @param {React.ReactNode} children - The content to display when expanded
 * @param {string} className - Additional CSS classes for the container
 */
export default function ExpandableInfo({ title, icon = 'i', children, className = '' }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-gray-100 hover:bg-gray-200 rounded-full px-6 py-3 flex items-center justify-between transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full bg-white border border-black flex items-center justify-center">
            <span className="text-gray-600 text-xs font-bold">{icon}</span>
          </div>
          <span 
            className="text-gray-800 font-medium text-[14px] leading-[120%]" 
            style={{ fontFamily: 'Montserrat', fontWeight: 500 }}
          >
            {title}
          </span>
        </div>
        <div className={`w-5 h-5 flex items-center justify-center transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
          <span className="text-gray-600">›</span>
        </div>
      </button>
      
      {isExpanded && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg text-left">
          <div className="space-y-3 text-sm text-gray-700">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

