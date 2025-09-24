"use client";

import { useUser } from "@/context/AuthUserProvider";
import Link from "next/link";

function Account() {
  const { user } = useUser();
  const profileMenu = [
    { name: "Profile", href: "#" },
    { name: "Login", href: "/login" },
    { name: "Settings", href: "#" },
    { name: "Sign out", href: "#" },
  ];
  return (
    <div className="items-center justify-center p-5">
      <ol>
        {profileMenu.map((el, i) => (
          <li
            key={i}
            className="flex flex-col gap-1 items-center justify-center"
          >
            <Link href={el.href}>
              <span>{el.name}</span>
              <span>{el.href}</span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default Account;
