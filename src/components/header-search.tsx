'use client';

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";

export function HeaderSearch() {
  const router = useRouter();
  const [term, setTerm] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = term.trim();
    router.push(
      query ? `/search?q=${encodeURIComponent(query)}` : "/search",
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="hidden max-w-sm flex-1 items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-1 text-sm text-white backdrop-blur md:flex"
      role="search"
    >
      <input
        type="search"
        value={term}
        onChange={(event) => setTerm(event.target.value)}
        placeholder="Search"
        className="flex-1 bg-transparent text-white placeholder:text-white/60 focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-lg bg-[var(--color-accent)] px-3 py-1 text-xs font-semibold text-white transition hover:opacity-90"
      >
        Go
      </button>
    </form>
  );
}
