import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-primary)]/40 bg-[var(--color-primary)] py-10 text-sm text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 text-white lg:px-0 lg:flex-row lg:items-center lg:justify-between">
        <Image
          src="/logo-graphite.png?v=2"
          alt="Graphite Co."
          width={140}
          height={35}
          className="h-8 w-auto"
          priority
        />
        <p>Inspired by bold, minimalist merchandising.</p>
        <p className="text-xs uppercase tracking-[0.35em]">
          Next.js • GraphQL • MongoDB
        </p>
      </div>
    </footer>
  );
}
