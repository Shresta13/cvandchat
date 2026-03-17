"use client";

import Marquee from "react-fast-marquee";
import Image from "next/image";

export default function Partners() {
  return (
    <div className="py-8 bg-gray-50">
      <Marquee
        speed={50}
        gradient={false}
        pauseOnHover={true}
      >
        <div className="flex items-center gap-16 mx-8">
          <Image src="/logo1.jpg" alt="logo1" width={120} height={60} />
          <Image src="/logo2.jpg" alt="logo2" width={120} height={60} />
          <Image src="/logo3.jpg" alt="logo3" width={120} height={60} />
          <Image src="/logo1.jpg"  alt="logo4" width={120} height={60} />
          <Image src="/logo3.jpg" alt="logo3" width={120} height={60} />
          <Image src="/logo1.jpg"  alt="logo4" width={120} height={60} />
          <Image src="/logo2.jpg" alt="logo5" width={120} height={60} />
          <Image src="/logo2.jpg" alt="logo5" width={120} height={60} />
        </div>
      </Marquee>
    </div>
  );
}
