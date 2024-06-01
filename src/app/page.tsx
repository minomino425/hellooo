import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <p>
        <Link href="/">
          <Image src="/logo.svg" alt="logo" width={153} height={33} />
        </Link>
      </p>
    </main>
  );
}
