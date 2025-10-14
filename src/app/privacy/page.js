"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PrivacyPage() {
  const router = useRouter();
  const [language, setLanguage] = useState("en"); // 'en' or 'pl'

  return (
    <div className="max-w-4xl mx-auto p-8 text-left">
      {/* Back button and language switcher */}
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-700 hover:text-blue-600"
        >
          ← Back
        </button>
        
        <div className="flex gap-2">
          <button
            onClick={() => setLanguage("en")}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              language === "en"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            🇬🇧 English
          </button>
          <button
            onClick={() => setLanguage("pl")}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              language === "pl"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            🇵🇱 Polski
          </button>
        </div>
      </div>

      {/* English Version */}
      {language === "en" && (
        <div className="prose prose-lg max-w-none">
          <h1 className="text-3xl font-bold mb-4">🇬🇧 Privacy Policy</h1>
          <p className="text-sm text-gray-600 mb-8"><strong>Last updated:</strong> 14 October 2025</p>

          <p className="mb-6">
            This Privacy Policy explains how we collect, use, store, and protect your personal data when you use our web application ("Flow-XR"), which provides AI-assisted coaching sessions focused on personal development, spirituality, leadership, and related fields.
          </p>
          <p className="mb-6">
            We are committed to protecting your privacy and complying with the General Data Protection Regulation (GDPR) and other applicable data protection laws.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">1. Data Controller</h2>
          <p className="mb-4">The controller of your personal data is:</p>
          <p className="mb-2"><strong>Flow System Adam Grono</strong></p>
          <p className="mb-2">Lesoka 2/4, 81-574 Gdynia, Poland</p>
          <p className="mb-4">📧 <a href="mailto:admin@flow-xr.com" className="text-blue-600 underline">admin@flow-xr.com</a></p>
          <p className="mb-6">If you have any questions regarding this Privacy Policy or your personal data, please contact us at the email address above.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">2. Categories of Personal Data We Collect</h2>
          <p className="mb-4">We process the following categories of personal data:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Account information (for logged-in users):</strong> name, email address, User ID.</li>
            <li><strong>Session data:</strong> session timestamps, your responses, notes, and chat transcripts generated during coaching sessions, used solely to provide session history and continuity.</li>
            <li><strong>Feedback and ratings:</strong> any feedback or ratings you provide within the App.</li>
            <li><strong>Technical data (collected by hosting provider DigitalOcean):</strong> IP address, request timestamps, HTTP status codes, request paths, browser type, and operating system. These logs are used for security and operational purposes and are retained for approximately 7 days.</li>
            <li><strong>OAuth data:</strong> when you log in via Google OAuth, we receive limited information (such as your Google account email and name) to authenticate your identity. Authenticated users are identified by their Google Account ID, provided by Google during the OAuth authentication process. We do not create, modify, or control this identifier.</li>
            <li><strong>Guest user data:</strong> guest users receive a temporary identifier generated in their browser, consisting of a timestamp and random string (e.g., guest-1234567890-abc123). This ID is stored in your browser's localStorage and our database.</li>
            <li><strong>Cookies and localStorage data:</strong> we use browser localStorage to store your authentication token and session data. No cookies are set by our application. You can clear this data at any time through your browser settings. See Section 6 for details.</li>
            <li><strong>Payment data (if applicable):</strong> processed via third-party payment processors; we do not store full card details.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">3. Purpose and Legal Basis for Processing</h2>
          <p className="mb-4">The processing purposes and corresponding legal bases are as follows:</p>
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Purpose</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Legal Basis (Article 6 GDPR)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Creating and managing your account</td>
                  <td className="border border-gray-300 px-4 py-2">Performance of a contract (Art. 6(1)(b))</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Providing and improving coaching sessions</td>
                  <td className="border border-gray-300 px-4 py-2">Performance of a contract (Art. 6(1)(b))</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Logging in via Google OAuth</td>
                  <td className="border border-gray-300 px-4 py-2">Performance of a contract (Art. 6(1)(b))</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Operating, securing, and maintaining the App</td>
                  <td className="border border-gray-300 px-4 py-2">Legitimate interest (Art. 6(1)(f))</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Communicating with users and providing support</td>
                  <td className="border border-gray-300 px-4 py-2">Legitimate interest (Art. 6(1)(f))</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Compliance with legal and accounting obligations</td>
                  <td className="border border-gray-300 px-4 py-2">Legal obligation (Art. 6(1)(c))</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mb-6">We do not use your personal data for marketing, advertising, or profiling.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">4. Use of AI Services</h2>
          <p className="mb-4">Flow-XR uses publicly available artificial intelligence models (e.g., OpenAI or similar) to support the coaching process.</p>
          <p className="mb-4">Please note:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Responses are generated dynamically based on your input.</li>
            <li>We do not control or modify how external AI services process that input.</li>
            <li>Therefore, <strong>you should not share sensitive personal data</strong> (e.g., health, religion, political opinions, sexual orientation, or data about third parties such as your clients).</li>
            <li>All AI communications are transmitted via encrypted channels.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">5. Google OAuth Login</h2>
          <p className="mb-4">The App uses <strong>Google OAuth</strong> to allow you to log in securely using your Google account. When you use this option:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>We receive only basic profile information (your name and email) from Google to verify your identity.</li>
            <li>Google may set its own cookies to manage authentication and session status.</li>
            <li>These cookies are subject to Google's privacy policy, which you can review here: 🔗 <a href="https://policies.google.com/privacy" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a></li>
          </ul>
          <p className="mb-6">We do not gain access to your Google password or any unrelated data from your Google account.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">6. Use of Local Storage</h2>
          <p className="mb-4">The App stores a limited set of data locally in your browser using <strong>localStorage</strong>, including:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li><code>auth_token</code> – to keep you logged in,</li>
            <li><code>guest_user_id</code> – to track anonymous session progress.</li>
          </ul>
          <p className="mb-6">These items are stored <strong>only in your browser</strong>, are <strong>not transmitted to our servers</strong>, and you can <strong>delete them at any time</strong> through your browser's settings or developer tools. They exist solely to enhance user experience and session continuity.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">7. Data Sharing and International Transfers</h2>
          <p className="mb-4">We share data only when necessary, and only with:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Service providers that support the operation of the Flow-XR application (e.g., hosting and authentication).</li>
            <li>External AI providers (to generate AI-assisted responses).</li>
          </ul>
          <p className="mb-6">Some partners may be based outside the European Economic Area (EEA). In such cases, we rely on <strong>Standard Contractual Clauses (SCCs)</strong> or other safeguards ensuring adequate protection under GDPR.</p>
          <p className="mb-6">We never sell or rent your personal data to third parties.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">8. Data Retention</h2>
          <p className="mb-4">Your personal data are kept only as long as necessary for the purposes described above:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Account data: retained while your account is active.</li>
            <li>Session data: retained until you delete it or your account is removed.</li>
            <li>OAuth data: stored only for account linking; removed upon account deletion.</li>
            <li>Technical data and logs: retained for up to approximately 7 days.</li>
            <li>Inactive accounts: may be deleted after 12 months of inactivity.</li>
          </ul>
          <p className="mb-6">You may delete your account from your dashboard or request deletion of your account or session data at any time (see Section 10).</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">9. Data Security</h2>
          <p className="mb-4">We apply technical and organizational safeguards to protect your data, including:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Encryption in transit (SSL/TLS),</li>
            <li>Secure password hashing,</li>
            <li>Limited employee access,</li>
            <li>Regular security reviews and monitoring.</li>
          </ul>
          <p className="mb-6">We continuously monitor our systems for vulnerabilities and regularly review our data protection practices to ensure compliance with the latest security standards.</p>
          <p className="mb-6">While we strive to protect your data, no system is entirely invulnerable. Users are encouraged to use strong passwords and log out from shared devices.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">10. Your Rights Under GDPR</h2>
          <p className="mb-4">You have the following rights under the General Data Protection Regulation (GDPR):</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Access:</strong> to obtain a copy of your personal data.</li>
            <li><strong>Rectification:</strong> to correct inaccurate or incomplete data.</li>
            <li><strong>Erasure:</strong> to request deletion ("right to be forgotten").</li>
            <li><strong>Restriction:</strong> to limit certain processing.</li>
            <li><strong>Portability:</strong> to receive your data in a structured, machine-readable format.</li>
            <li><strong>Objection:</strong> to processing based on legitimate interest.</li>
            <li><strong>Complaint:</strong> to lodge a complaint with a supervisory authority (in Poland: <strong>President of the Personal Data Protection Office</strong>, ul. Stawki 2, 00-193 Warsaw, Poland).</li>
          </ul>
          <p className="mb-6">To exercise your rights, please contact us at <a href="mailto:admin@flow-xr.com" className="text-blue-600 underline">admin@flow-xr.com</a>.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">11. Cookies and Tracking Technologies</h2>
          <p className="mb-6">As stated in Sections 2 and 6, we do not use cookies. We rely on browser localStorage to store your authentication token and session data. You can clear this data at any time through your browser settings.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">12. Changes to This Privacy Policy</h2>
          <p className="mb-6">We may update this Privacy Policy periodically. The updated version will be posted on this page with a revised "Last updated" date. If changes are significant, we will notify you by email or within the App before they take effect.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">13. Contact Information</h2>
          <p className="mb-6">If you have any questions, concerns, or requests related to this Privacy Policy, please contact us at: 📧 <a href="mailto:admin@flow-xr.com" className="text-blue-600 underline">admin@flow-xr.com</a></p>

          <h2 className="text-2xl font-bold mt-8 mb-4">14. Summary for Users</h2>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Your data are used only to provide and improve your coaching experience.</li>
            <li>We use Google OAuth for secure login and localStorage to store minimal session data on your device.</li>
            <li>We do not sell, profile, or share your personal information beyond what is necessary to run the App.</li>
            <li>Please avoid entering sensitive data during AI-assisted sessions, as they use public AI models.</li>
          </ul>
          <p className="mb-6">✅ This Privacy Policy is fully compliant with the <strong>General Data Protection Regulation (GDPR, EU 2016/679)</strong> and covers all legally required elements, including the use of third-party authentication (Google OAuth) and browser localStorage.</p>
        </div>
      )}

      {/* Polish Version */}
      {language === "pl" && (
        <div className="prose prose-lg max-w-none">
          <h1 className="text-3xl font-bold mb-4">🇵🇱 Polityka Prywatności</h1>
          <p className="text-sm text-gray-600 mb-8"><strong>Ostatnia aktualizacja:</strong> 14 października 2025 r.</p>

          <p className="mb-6">
            Niniejsza Polityka Prywatności wyjaśnia, w jaki sposób gromadzimy, wykorzystujemy, przechowujemy i chronimy Twoje dane osobowe podczas korzystania z naszej aplikacji internetowej („Flow-XR"), która oferuje sesje coachingowe wspierane przez sztuczną inteligencję, skupione na rozwoju osobistym, duchowości, przywództwie i pokrewnych dziedzinach.
          </p>
          <p className="mb-6">
            Chronimy Twoją prywatność i działamy zgodnie z <strong>Rozporządzeniem o Ochronie Danych Osobowych (RODO / GDPR)</strong> oraz innymi obowiązującymi przepisami o ochronie danych.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">1. Administrator danych</h2>
          <p className="mb-4">Administratorem Twoich danych osobowych jest:</p>
          <p className="mb-2"><strong>Flow System Adam Grono</strong></p>
          <p className="mb-2">Lesoka 2/4, 81-574 Gdynia, Polska</p>
          <p className="mb-4">📧 <a href="mailto:admin@flow-xr.com" className="text-blue-600 underline">admin@flow-xr.com</a></p>
          <p className="mb-6">W sprawach związanych z ochroną danych osobowych możesz się z nami skontaktować pod wskazanym adresem e-mail.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">2. Kategorie przetwarzanych danych osobowych</h2>
          <p className="mb-4">Przetwarzamy następujące kategorie danych:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Dane konta (dla zalogowanych użytkowników):</strong> imię, adres e-mail, identyfikator użytkownika (User ID).</li>
            <li><strong>Dane sesji:</strong> znaczniki czasu, Twoje odpowiedzi, notatki i zapisy rozmów generowane podczas sesji coachingowych — wykorzystywane wyłącznie w celu zapewnienia historii i ciągłości sesji.</li>
            <li><strong>Opinie i oceny:</strong> informacje zwrotne przekazane przez Ciebie w aplikacji.</li>
            <li><strong>Dane techniczne (gromadzone przez dostawcę hostingu DigitalOcean):</strong> adres IP, znaczniki czasu żądań, kody statusów HTTP, ścieżki żądań, typ przeglądarki i system operacyjny. Dane te służą celom bezpieczeństwa i operacyjnym, a logi są przechowywane około 7 dni.</li>
            <li><strong>Dane OAuth:</strong> w przypadku logowania przez Google OAuth otrzymujemy ograniczone informacje (takie jak adres e-mail i imię z konta Google) w celu uwierzytelnienia użytkownika. Uwierzytelnieni użytkownicy są identyfikowani za pomocą identyfikatora konta Google (Google Account ID), który otrzymujemy od Google. Nie tworzymy ani nie modyfikujemy tego identyfikatora.</li>
            <li><strong>Dane użytkowników gościnnych:</strong> użytkownicy niezalogowani otrzymują tymczasowy identyfikator generowany w przeglądarce, np. „guest-1234567890-abc123". Ten identyfikator jest przechowywany w localStorage przeglądarki oraz w naszej bazie danych.</li>
            <li><strong>Dane localStorage:</strong> używamy mechanizmu localStorage przeglądarki do przechowywania tokenu uwierzytelniającego i danych sesji. Aplikacja nie ustawia żadnych plików cookie. Dane te możesz w każdej chwili usunąć w ustawieniach przeglądarki (zob. sekcja 6).</li>
            <li><strong>Dane płatności (jeśli dotyczy):</strong> przetwarzane przez zewnętrznych operatorów płatności; nie przechowujemy pełnych danych kart.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">3. Cele i podstawy prawne przetwarzania danych</h2>
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Cel przetwarzania</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Podstawa prawna (art. 6 RODO)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Utworzenie i zarządzanie kontem</td>
                  <td className="border border-gray-300 px-4 py-2">Niezbędność do wykonania umowy (art. 6 ust. 1 lit. b)</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Świadczenie i doskonalenie sesji coachingowych</td>
                  <td className="border border-gray-300 px-4 py-2">Niezbędność do wykonania umowy (art. 6 ust. 1 lit. b)</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Logowanie przez Google OAuth</td>
                  <td className="border border-gray-300 px-4 py-2">Niezbędność do wykonania umowy (art. 6 ust. 1 lit. b)</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Utrzymanie, bezpieczeństwo i obsługa aplikacji</td>
                  <td className="border border-gray-300 px-4 py-2">Prawnie uzasadniony interes (art. 6 ust. 1 lit. f)</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Komunikacja i wsparcie użytkowników</td>
                  <td className="border border-gray-300 px-4 py-2">Prawnie uzasadniony interes (art. 6 ust. 1 lit. f)</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Wypełnienie obowiązków prawnych i księgowych</td>
                  <td className="border border-gray-300 px-4 py-2">Obowiązek prawny (art. 6 ust. 1 lit. c)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mb-6">Nie wykorzystujemy Twoich danych osobowych do celów marketingowych, reklamowych ani profilowania.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">4. Wykorzystanie usług AI</h2>
          <p className="mb-4">Aplikacja Flow-XR korzysta z publicznie dostępnych modeli sztucznej inteligencji (np. OpenAI lub podobnych) w celu wspierania procesu coachingowego.</p>
          <p className="mb-4">Należy pamiętać:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Odpowiedzi są generowane dynamicznie na podstawie wprowadzonych przez Ciebie treści.</li>
            <li>Nie kontrolujemy ani nie modyfikujemy sposobu, w jaki zewnętrzne modele AI przetwarzają te dane.</li>
            <li><strong>Nie należy udostępniać danych wrażliwych</strong>, takich jak dane o zdrowiu, przekonaniach religijnych, poglądach politycznych, orientacji seksualnej ani danych osób trzecich (np. klientów).</li>
            <li>Wszystkie transmisje danych są szyfrowane (SSL/TLS).</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">5. Logowanie przez Google OAuth</h2>
          <p className="mb-4">Aplikacja korzysta z <strong>Google OAuth</strong>, aby umożliwić bezpieczne logowanie za pomocą konta Google. Podczas logowania:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Otrzymujemy wyłącznie podstawowe informacje profilowe (imię i adres e-mail) w celu weryfikacji tożsamości.</li>
            <li>Google może ustawiać własne pliki cookie w celu zarządzania procesem uwierzytelnienia.</li>
            <li>Pliki cookie Google podlegają <a href="https://policies.google.com/privacy" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Polityce prywatności Google</a>.</li>
          </ul>
          <p className="mb-6">Nie mamy dostępu do Twojego hasła ani innych danych konta Google.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">6. Wykorzystanie localStorage</h2>
          <p className="mb-4">Aplikacja przechowuje ograniczony zestaw danych w przeglądarce użytkownika przy użyciu mechanizmu <strong>localStorage</strong>, w tym:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li><code>auth_token</code> – w celu utrzymania zalogowania,</li>
            <li><code>guest_user_id</code> – w celu śledzenia postępu sesji użytkownika gościnnego.</li>
          </ul>
          <p className="mb-6">Dane te są przechowywane wyłącznie w Twojej przeglądarce, nie są przesyłane na nasze serwery i możesz je usunąć w dowolnym momencie w ustawieniach przeglądarki. Służą jedynie poprawie komfortu korzystania z aplikacji i zachowaniu ciągłości sesji.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">7. Udostępnianie danych i transfery międzynarodowe</h2>
          <p className="mb-4">Udostępniamy dane wyłącznie wtedy, gdy jest to niezbędne, i tylko:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Dostawcom usług wspierających działanie aplikacji Flow-XR (np. hosting, uwierzytelnianie).</li>
            <li>Zewnętrznym dostawcom usług AI (w celu generowania odpowiedzi wspomaganych przez AI).</li>
          </ul>
          <p className="mb-6">Niektórzy partnerzy mogą znajdować się poza Europejskim Obszarem Gospodarczym (EOG). W takich przypadkach stosujemy <strong>Standardowe Klauzule Umowne (SCC)</strong> lub inne zabezpieczenia zgodne z RODO.</p>
          <p className="mb-6">Nigdy nie sprzedajemy ani nie wynajmujemy danych osobowych osobom trzecim.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">8. Okres przechowywania danych</h2>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Dane konta: przechowywane tak długo, jak konto jest aktywne.</li>
            <li>Dane sesji: do momentu usunięcia przez użytkownika lub usunięcia konta.</li>
            <li>Dane OAuth: tylko w celu powiązania konta; usuwane po usunięciu konta.</li>
            <li>Dane techniczne i logi: przechowywane do około 7 dni.</li>
            <li>Nieaktywne konta mogą zostać usunięte po 12 miesiącach nieaktywności.</li>
          </ul>
          <p className="mb-6">Konto oraz dane sesji można usunąć samodzielnie z poziomu panelu użytkownika lub poprzez kontakt na adres <a href="mailto:admin@flow-xr.com" className="text-blue-600 underline">admin@flow-xr.com</a>.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">9. Bezpieczeństwo danych</h2>
          <p className="mb-4">Stosujemy techniczne i organizacyjne środki ochrony danych, w tym:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>szyfrowanie transmisji (SSL/TLS),</li>
            <li>bezpieczne hashowanie haseł,</li>
            <li>ograniczony dostęp do danych,</li>
            <li>regularne audyty bezpieczeństwa.</li>
          </ul>
          <p className="mb-6">Systemy są monitorowane pod kątem podatności i zgodności z aktualnymi standardami bezpieczeństwa.</p>
          <p className="mb-6">Pomimo naszych działań, żaden system nie jest w pełni odporny — zalecamy stosowanie silnych haseł i wylogowywanie się z konta na współdzielonych urządzeniach.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">10. Twoje prawa wynikające z RODO</h2>
          <p className="mb-4">Masz prawo do:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>dostępu do swoich danych,</li>
            <li>ich sprostowania,</li>
            <li>usunięcia („prawo do bycia zapomnianym"),</li>
            <li>ograniczenia przetwarzania,</li>
            <li>przenoszenia danych,</li>
            <li>wniesienia sprzeciwu wobec przetwarzania,</li>
            <li>złożenia skargi do organu nadzorczego – w Polsce: <strong>Prezes Urzędu Ochrony Danych Osobowych</strong>, ul. Stawki 2, 00-193 Warszawa.</li>
          </ul>
          <p className="mb-6">Aby skorzystać ze swoich praw, skontaktuj się z nami pod adresem <a href="mailto:admin@flow-xr.com" className="text-blue-600 underline">admin@flow-xr.com</a>.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">11. Pliki cookie i technologie śledzenia</h2>
          <p className="mb-6">Jak wspomniano w sekcjach 2 i 6, nie używamy plików cookie. Korzystamy z localStorage przeglądarki do przechowywania tokenu uwierzytelniającego i danych sesji. Możesz usunąć te dane w dowolnym momencie w ustawieniach przeglądarki.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">12. Zmiany w Polityce Prywatności</h2>
          <p className="mb-6">Możemy okresowo aktualizować niniejszą Politykę Prywatności. Zaktualizowana wersja zostanie opublikowana na tej stronie wraz ze zmienioną datą „Ostatnia aktualizacja". W przypadku istotnych zmian powiadomimy Cię e-mailem lub w aplikacji przed ich wejściem w życie.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">13. Dane kontaktowe</h2>
          <p className="mb-6">W przypadku pytań, wątpliwości lub wniosków dotyczących niniejszej Polityki Prywatności prosimy o kontakt: 📧 <a href="mailto:admin@flow-xr.com" className="text-blue-600 underline">admin@flow-xr.com</a></p>

          <h2 className="text-2xl font-bold mt-8 mb-4">14. Podsumowanie dla użytkowników</h2>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Twoje dane są wykorzystywane wyłącznie w celu świadczenia i doskonalenia usług coachingowych.</li>
            <li>Używamy Google OAuth do bezpiecznego logowania oraz localStorage do przechowywania minimalnych danych sesji na Twoim urządzeniu.</li>
            <li>Nie sprzedajemy, nie profilujemy ani nie udostępniamy Twoich danych osobowych poza tym, co jest niezbędne do działania aplikacji.</li>
            <li>Prosimy o unikanie wprowadzania danych wrażliwych podczas sesji wspomaganych przez AI, ponieważ korzystają one z publicznych modeli AI.</li>
          </ul>
          <p className="mb-6">✅ Niniejsza Polityka Prywatności jest w pełni zgodna z <strong>Rozporządzeniem o Ochronie Danych Osobowych (RODO, UE 2016/679)</strong> i obejmuje wszystkie wymagane prawnie elementy, w tym korzystanie z uwierzytelniania stron trzecich (Google OAuth) oraz localStorage przeglądarki.</p>
        </div>
      )}
    </div>
  );
}
