import Image from "next/image";
import Link from "next/link";
import "@/styles/_base.scss";
import "@/styles/_main.scss";

export default function Home() {
  return (
    <main>
      <div className="main__wrapper">
        <p className="main__logo">
          <Link href="/">
            <Image src="/logo.svg" alt="logo" width={153} height={33} />
          </Link>
        </p>
        <p className="main__copy">
          <span className="main__copy-01">
            {Array.from({ length: 7 }, (_, i) => (
              <img key={i} src={`/copy/${i + 1}.svg`} alt="copy" />
            ))}
          </span>
          <span className="main__copy-02">
            {Array.from({ length: 8 }, (_, i) => (
              <img key={i} src={`/copy/${i + 8}.svg`} alt="copy" />
            ))}
          </span>
          <span className="main__copy-03">
            {Array.from({ length: 8 }, (_, i) => (
              <img key={i} src={`/copy/${i + 16}.svg`} alt="copy" />
            ))}
          </span>
        </p>
      </div>
    </main>
  );
}
