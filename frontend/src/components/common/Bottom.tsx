import Link from "next/link";

export default function BottomNav() {
  const items = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/trade", label: "Trade", icon: "⚖️" },
    { href: "/ranking", label: "Ranking", icon: "🏆" },
    { href: "/myPage", label: "Me", icon: "👤" },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t ">
      <ul className="flex justify-between text-xs">
        {items.map((it) => (
          <li key={it.href} className="flex-1 text-center py-2">
            <Link href={it.href} className="flex flex-col items-center">
              <span className="text-lg">{it.icon}</span>
              <span className="mt-1">{it.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
