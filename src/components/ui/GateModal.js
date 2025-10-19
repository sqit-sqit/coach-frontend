"use client";

import { X } from "lucide-react";

export default function GateModal({ gateInfo, isOpen, onClose }) {
  if (!isOpen || !gateInfo) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Bramka {gateInfo.gateNumber}</h2>
            <h3 className="text-lg font-semibold text-purple-600 mt-1">{gateInfo.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <span className="font-semibold text-gray-700">Centrum:</span>
              <span className="ml-2 text-gray-900">{gateInfo.center}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Typ energii:</span>
              <span className="ml-2 text-gray-900">{gateInfo.energy_type}</span>
            </div>
          </div>

          {/* Theme */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Temat</h4>
            <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">{gateInfo.theme}</p>
          </div>

          {/* Shadow */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Cień</h4>
            <p className="text-gray-700 bg-red-50 p-3 rounded-lg">{gateInfo.shadow}</p>
          </div>

          {/* Gift */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Dar</h4>
            <p className="text-gray-700 bg-green-50 p-3 rounded-lg">{gateInfo.gift}</p>
          </div>

          {/* Siddhi */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Siddhi</h4>
            <p className="text-gray-700 bg-purple-50 p-3 rounded-lg">{gateInfo.siddhi}</p>
          </div>

          {/* Coaching Note */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Notatka coachingowa</h4>
            <p className="text-gray-700 bg-yellow-50 p-3 rounded-lg italic">{gateInfo.coaching_note}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
}
