import Image from "next/image";
import Link from "next/link";
interface LogoProps{
    link:string
    title:string
    className?:string

}

function Logo({ link,title,className }: LogoProps) {
  return (
    <Link href={link} aria-label={title} className={`flex items-center w-80 ${className}`}>
      <Image
        src="/png/favicon.png"
        alt="icon"
        style={{ borderRadius: "50%" }}
        width={34}
        height={34}
      />
    </Link>
  );
}

export default Logo