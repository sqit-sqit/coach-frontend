import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-center py-6 border-t mt-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-3">
          <Link 
            href="/privacy" 
            className="text-sm text-gray-600 hover:text-blue-600 transition underline"
          >
            Privacy Policy
          </Link>
          <span className="hidden sm:inline text-gray-400">•</span>
          <Link 
            href="/terms" 
            className="text-sm text-gray-600 hover:text-blue-600 transition underline"
          >
            Terms of Use
          </Link>
          <span className="hidden sm:inline text-gray-400">•</span>
          <a 
            href="mailto:admin@flow-xr.com" 
            className="text-sm text-gray-600 hover:text-blue-600 transition underline"
          >
            Contact
          </a>
        </div>
        <p className="text-sm text-gray-600">© 2025 Flow-XR. All rights reserved.</p>
      </div>
    </footer>
  );
}
