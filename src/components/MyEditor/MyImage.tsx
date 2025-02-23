"use client";
import Image from "next/image";
import { useState } from "react";

const MyImage = ({ src, alt }: { src?: string; alt?: string }) => {
  const defaultImage = "/image/svg/error.svg";
  const [imgSrc, setImgSrc] = useState(src?.startsWith("/") ? src : `/${src}`);

  return (
    <Image
      src={imgSrc}
      alt={alt || "图片"}
      width={100}
      height={100}
      className="rounded-lg shadow-md"
      onError={() => setImgSrc(defaultImage)}
    />
  );
};

export default MyImage;
