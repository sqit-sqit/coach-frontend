"use client";

import { X } from "lucide-react";

export default function HDResultModal({ resultInfo, isOpen, onClose }) {
  if (!isOpen || !resultInfo) return null;

  const getResultContent = (type, value) => {
    const content = {
      type: {
        "Projektor": {
          title: "Projektor",
          description: "Projektor to typ energetyczny, który ma zdolność do rozpoznawania i kierowania energią innych ludzi.",
          characteristics: [
            "Masz naturalną zdolność do rozpoznawania potencjału w innych",
            "Jesteś zaprojektowany do czekania na zaproszenie",
            "Twoja strategia to 'Czekać na zaproszenie'",
            "Masz zdolność do głębokiego zrozumienia innych"
          ],
          strategy: "Czekaj na zaproszenie przed działaniem. Nie inicjuj - reaguj na zaproszenia.",
          authority: "Używaj swojego autorytetu do podejmowania decyzji o zaproszeniach."
        },
        "Generator": {
          title: "Generator",
          description: "Generator to typ energetyczny z dostępem do stałej energii sakralnej.",
          characteristics: [
            "Masz stały dostęp do energii sakralnej",
            "Jesteś zaprojektowany do reagowania na życie",
            "Twoja strategia to 'Reagować'",
            "Masz naturalną energię do pracy i tworzenia"
          ],
          strategy: "Reaguj na to, co życie Ci przynosi. Nie inicjuj - reaguj.",
          authority: "Używaj swojego autorytetu do podejmowania decyzji o reakcjach."
        },
        "Manifestujący Generator": {
          title: "Manifestujący Generator",
          description: "Manifestujący Generator to Generator z dodatkową zdolnością do manifestowania.",
          characteristics: [
            "Masz stały dostęp do energii sakralnej",
            "Możesz manifestować jak Manifestor",
            "Twoja strategia to 'Reagować'",
            "Masz energię do pracy i manifestowania"
          ],
          strategy: "Reaguj na życie, ale możesz też manifestować gdy jesteś pewien.",
          authority: "Używaj swojego autorytetu do podejmowania decyzji."
        },
        "Manifestor": {
          title: "Manifestor",
          description: "Manifestor to typ energetyczny zaprojektowany do inicjowania i manifestowania.",
          characteristics: [
            "Jesteś zaprojektowany do inicjowania",
            "Masz zdolność do manifestowania",
            "Twoja strategia to 'Informować'",
            "Możesz wpływać na innych"
          ],
          strategy: "Informuj innych o swoich zamiarach przed działaniem.",
          authority: "Używaj swojego autorytetu do podejmowania decyzji o inicjatywach."
        },
        "Reflektor": {
          title: "Reflektor",
          description: "Reflektor to unikalny typ energetyczny bez stałych centrów.",
          characteristics: [
            "Nie masz stałych centrów",
            "Jesteś zaprojektowany do odzwierciedlania innych",
            "Twoja strategia to 'Czekać na cykl księżycowy'",
            "Masz zdolność do głębokiej obserwacji"
          ],
          strategy: "Czekaj na cykl księżycowy (28 dni) przed podejmowaniem ważnych decyzji.",
          authority: "Używaj swojego autorytetu do podejmowania decyzji."
        }
      },
      strategy: {
        "Czekać na zaproszenie": {
          title: "Czekać na zaproszenie",
          description: "To strategia dla Projektorów - czekaj na zaproszenie przed działaniem.",
          how_to_apply: [
            "Nie inicjuj projektów samodzielnie",
            "Czekaj na zaproszenia od innych",
            "Używaj swojego autorytetu do oceny zaproszeń",
            "Informuj innych o swoich umiejętnościach"
          ],
          benefits: [
            "Unikasz frustracji i oporu",
            "Działasz w zgodzie ze swoją naturą",
            "Budujesz autentyczne relacje",
            "Maksymalizujesz swój potencjał"
          ]
        },
        "Reagować": {
          title: "Reagować",
          description: "To strategia dla Generatorów - reaguj na to, co życie Ci przynosi.",
          how_to_apply: [
            "Nie inicjuj - reaguj na możliwości",
            "Używaj swojego autorytetu do oceny reakcji",
            "Pozwól energii sakralnej Cię prowadzić",
            "Zadawaj pytania tak/nie"
          ],
          benefits: [
            "Działasz z naturalną energią",
            "Unikasz frustracji",
            "Znajdujesz satysfakcję w pracy",
            "Budujesz autentyczne relacje"
          ]
        },
        "Informować": {
          title: "Informować",
          description: "To strategia dla Manifestorów - informuj innych o swoich zamiarach.",
          how_to_apply: [
            "Informuj innych o swoich planach",
            "Daj ludziom czas na przygotowanie się",
            "Używaj swojego autorytetu do podejmowania decyzji",
            "Bądź szczery w komunikacji"
          ],
          benefits: [
            "Unikasz oporu od innych",
            "Budujesz współpracę",
            "Manifestujesz skutecznie",
            "Tworzysz harmonię w relacjach"
          ]
        },
        "Czekać na cykl księżycowy": {
          title: "Czekać na cykl księżycowy",
          description: "To strategia dla Reflektorów - czekaj na cykl księżycowy przed ważnymi decyzjami.",
          how_to_apply: [
            "Czekaj 28 dni przed ważnymi decyzjami",
            "Obserwuj wzorce w swoim życiu",
            "Używaj swojego autorytetu do oceny",
            "Pozwól sobie na głęboką obserwację"
          ],
          benefits: [
            "Podejmujesz mądre decyzje",
            "Unikasz pochopnych wyborów",
            "Rozwijasz głęboką mądrość",
            "Budujesz autentyczne relacje"
          ]
        }
      },
      authority: {
        "Sakralny": {
          title: "Autorytet Sakralny",
          description: "Autorytet sakralny to wewnętrzna mądrość ciała, która wie, co jest dla Ciebie dobre.",
          how_to_use: [
            "Słuchaj swojego ciała",
            "Zwracaj uwagę na reakcje sakralne",
            "Używaj dźwięków 'uh-huh' i 'uh-uh'",
            "Pozwól energii sakralnej Cię prowadzić"
          ],
          signs: [
            "Fizyczne reakcje w okolicy pępka",
            "Poczucie ekscytacji lub oporu",
            "Naturalne 'tak' lub 'nie' w ciele",
            "Energia do działania lub jej brak"
          ]
        },
        "Splot słoneczny": {
          title: "Autorytet Splotu Słonecznego",
          description: "Autorytet splotu słonecznego to emocjonalna mądrość, która potrzebuje czasu na przetworzenie.",
          how_to_use: [
            "Czekaj na emocjonalną jasność",
            "Nie podejmuj decyzji pod wpływem emocji",
            "Pozwól emocjom się uspokoić",
            "Używaj swojego autorytetu po emocjonalnej jasności"
          ],
          signs: [
            "Emocjonalne wzloty i upadki",
            "Poczucie emocjonalnej jasności",
            "Naturalne 'tak' lub 'nie' w emocjach",
            "Spokój emocjonalny"
          ]
        },
        "Śledziona": {
          title: "Autorytet Śledziony",
          description: "Autorytet śledziony to instynktowna mądrość, która wie, co jest dla Ciebie bezpieczne.",
          how_to_use: [
            "Słuchaj swojego instynktu",
            "Zwracaj uwagę na poczucie bezpieczeństwa",
            "Używaj swojego autorytetu natychmiast",
            "Pozwól instynktowi Cię prowadzić"
          ],
          signs: [
            "Poczucie bezpieczeństwa lub niepokoju",
            "Instynktowna reakcja",
            "Naturalne 'tak' lub 'nie' w ciele",
            "Poczucie komfortu lub dyskomfortu"
          ]
        },
        "Mentalny": {
          title: "Autorytet Mentalny",
          description: "Autorytet mentalny to mądrość umysłu, która potrzebuje czasu na przetworzenie informacji.",
          how_to_use: [
            "Czekaj na mentalną jasność",
            "Nie podejmuj decyzji pod wpływem presji",
            "Pozwól umysłowi się uspokoić",
            "Używaj swojego autorytetu po mentalnej jasności"
          ],
          signs: [
            "Mentalna jasność",
            "Poczucie pewności",
            "Naturalne 'tak' lub 'nie' w umyśle",
            "Spokój mentalny"
          ]
        }
      },
      profile: {
        "1/3": {
          title: "Profil 1/3",
          description: "Profil 1/3 to Profil Badacza/Męczennika - naturalna potrzeba zbadania wszystkiego przed działaniem.",
          characteristics: [
            "Masz naturalną potrzebę zbadania wszystkiego",
            "Jesteś zaprojektowany do uczenia się przez doświadczenie",
            "Masz zdolność do głębokiego zrozumienia",
            "Jesteś naturalnym nauczycielem"
          ],
          life_theme: [
            "Uczysz się przez doświadczenie",
            "Masz naturalną potrzebę zbadania",
            "Jesteś zaprojektowany do uczenia innych",
            "Masz zdolność do głębokiej mądrości"
          ]
        }
      }
    };

    return content[type]?.[value] || {
      title: value,
      description: "Brak szczegółowych informacji dla tego elementu.",
      characteristics: [],
      strategy: "",
      authority: "",
      how_to_apply: [],
      benefits: [],
      how_to_use: [],
      signs: [],
      life_theme: []
    };
  };

  const content = getResultContent(resultInfo.type, resultInfo.value);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{content.title}</h2>
            <h3 className="text-lg font-semibold text-purple-600 mt-1">{resultInfo.label}</h3>
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
          {/* Description */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Opis</h4>
            <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">{content.description}</p>
          </div>

          {/* Characteristics */}
          {content.characteristics && content.characteristics.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Charakterystyka</h4>
              <ul className="text-gray-700 bg-green-50 p-3 rounded-lg space-y-1">
                {content.characteristics.map((char, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>{char}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Strategy */}
          {content.strategy && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Strategia</h4>
              <p className="text-gray-700 bg-yellow-50 p-3 rounded-lg">{content.strategy}</p>
            </div>
          )}

          {/* How to Apply */}
          {content.how_to_apply && content.how_to_apply.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Jak zastosować</h4>
              <ul className="text-gray-700 bg-purple-50 p-3 rounded-lg space-y-1">
                {content.how_to_apply.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {content.benefits && content.benefits.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Korzyści</h4>
              <ul className="text-gray-700 bg-green-50 p-3 rounded-lg space-y-1">
                {content.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* How to Use */}
          {content.how_to_use && content.how_to_use.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Jak używać</h4>
              <ul className="text-gray-700 bg-blue-50 p-3 rounded-lg space-y-1">
                {content.how_to_use.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Signs */}
          {content.signs && content.signs.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Oznaki</h4>
              <ul className="text-gray-700 bg-orange-50 p-3 rounded-lg space-y-1">
                {content.signs.map((sign, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-orange-600 mr-2">•</span>
                    <span>{sign}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Life Theme */}
          {content.life_theme && content.life_theme.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Temat życia</h4>
              <ul className="text-gray-700 bg-pink-50 p-3 rounded-lg space-y-1">
                {content.life_theme.map((theme, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-pink-600 mr-2">•</span>
                    <span>{theme}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
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
