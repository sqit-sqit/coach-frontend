// import "../styles/globals.css";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";


const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans", // 👈 tu definiujemy zmienną CSS
});


export const metadata = {
  title: "Coach Platform",
  description: "Mini-aplikacje coachingowe napędzane AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl" className={`${montserrat.variable}`}> 
      <body className="flex flex-col min-h-screen font-sans">
        <Header />
        <main className="flex-grow container mx-auto px-6 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
