"use client";

import { useRouter } from "next/navigation";

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <div className="max-w-3xl mx-auto p-8 text-left">
      {/* Back button */}
      <button
        onClick={() => router.push("/values/init?step=3")}
        className="mb-6 flex items-center text-gray-700 hover:text-blue-600"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-6">Privacy Statement</h1>

      <p className="mb-4">
        We respect your privacy and are committed to protecting your personal
        data. This Privacy Statement explains how we collect, use, and safeguard
        your information when you use our Values Workshop.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Data Collection</h2>
      <p className="mb-4">
        We only collect the information you voluntarily provide during your
        reflection process. Your answers are never sold, shared, or used for
        advertising purposes.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Use of Data</h2>
      <p className="mb-4">
        The data you enter is used solely to guide your personal reflection
        journey. It helps us tailor the experience and provide you with a
        personalized summary. We do not use this information for marketing or
        profiling.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Control of Your Data</h2>
      <p className="mb-4">
        You remain in full control of your data at every step. You may skip
        questions, choose not to provide information, or delete your data at any
        time.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Data Retention</h2>
      <p className="mb-4">
        Your data is stored only for the duration of your session unless you
        choose to save it. If saved, you may request deletion at any time.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Contact</h2>
      <p className="mb-4">
        If you have any questions about this Privacy Statement or how your data
        is handled, please contact us at{" "}
        <a
          href="mailto:privacy@example.com"
          className="text-blue-600 underline"
        >
          privacy@example.com
        </a>
        .
      </p>

      <p className="mt-8 text-gray-600 text-sm">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </div>
  );
}
