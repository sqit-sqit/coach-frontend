import Link from "next/link";

export default function HomePage() {
  return (
    <section className="text-center py-20">
      <h1 className="text-4xl font-bold mb-6">
        Witamy w <span className="text-blue-600">Coach Platform</span>
      </h1>
      <p className="text-lg text-gray-700 mb-8">
        Twoje mini-aplikacje coachingowe w jednym miejscu – AI Coach, warsztaty i narzędzia rozwojowe.
      </p>
      <Link
        href="/dashboard"
        className="bg-blue-600 text-white px-6 py-3 rounded-md shadow hover:bg-blue-700"
      >
        Przejdź do Dashboardu
      </Link>
    </section>
  );
}
    