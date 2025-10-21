"use client";

import { X } from "lucide-react";

export default function ChannelModal({ channelInfo, isOpen, onClose }) {
  if (!isOpen || !channelInfo) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Kanał {channelInfo.channel}</h2>
            <h3 className="text-lg font-semibold text-blue-600 mt-1">
              Bramka {channelInfo.gate1} - Bramka {channelInfo.gate2}
            </h3>
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
              <span className="font-semibold text-gray-700">Centrum 1:</span>
              <span className="ml-2 text-gray-900">{channelInfo.center1}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Centrum 2:</span>
              <span className="ml-2 text-gray-900">{channelInfo.center2}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Opis kanału</h4>
            <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">
              {channelInfo.description || "Ten kanał łączy centra " + channelInfo.center1 + " i " + channelInfo.center2 + ", tworząc stabilne połączenie energetyczne między tymi obszarami."}
            </p>
          </div>

          {/* Gate 1 Info */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Bramka {channelInfo.gate1}</h4>
            <p className="text-gray-700 bg-green-50 p-3 rounded-lg">
              {channelInfo.gate1Info || "Informacje o bramce " + channelInfo.gate1 + " będą dostępne wkrótce."}
            </p>
          </div>

          {/* Gate 2 Info */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Bramka {channelInfo.gate2}</h4>
            <p className="text-gray-700 bg-green-50 p-3 rounded-lg">
              {channelInfo.gate2Info || "Informacje o bramce " + channelInfo.gate2 + " będą dostępne wkrótce."}
            </p>
          </div>

          {/* Channel Meaning */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Znaczenie kanału</h4>
            <p className="text-gray-700 bg-purple-50 p-3 rounded-lg">
              {channelInfo.meaning || "Ten kanał reprezentuje stabilne połączenie między " + channelInfo.center1 + " i " + channelInfo.center2 + ", które jest zawsze aktywne w Twoim wykresie."}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
}
