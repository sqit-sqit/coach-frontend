"use client";

import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

export default function DeleteAccountModal({ isOpen, onClose, onConfirm, isDeleting }) {
  const [confirmText, setConfirmText] = useState("");
  const isConfirmValid = confirmText.toLowerCase() === "delete my account";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isDeleting}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 rounded-full p-3">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Delete Account
        </h2>

        {/* Warning text */}
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-red-800 font-medium mb-2">
            ⚠️ This action is irreversible!
          </p>
          <p className="text-sm text-red-700">
            All your data will be permanently deleted:
          </p>
          <ul className="text-sm text-red-700 mt-2 space-y-1 list-disc list-inside">
            <li>All workshop sessions</li>
            <li>Chat history and summaries</li>
            <li>Feedback and progress</li>
            <li>Account information</li>
          </ul>
        </div>

        {/* Confirmation input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type <span className="font-bold">"delete my account"</span> to confirm:
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            disabled={isDeleting}
            placeholder="delete my account"
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none disabled:bg-gray-100"
          />
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!isConfirmValid || isDeleting}
            className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? "Deleting..." : "Delete Forever"}
          </button>
        </div>
      </div>
    </div>
  );
}

