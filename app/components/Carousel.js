"use client";

import Image from "next/image";

const Carousel = ({ images }) => {
  return (
    <div className="w-full overflow-hidden py-8 mt-8">
      <div className="flex gap-4 sm:gap-8 w-full items-center justify-start animate-scroll whitespace-nowrap">
        {images.map((src, index) => (
          <Image
            key={index}
            src={src}
            alt={`Image ${index + 1}`}
            width={48}
            height={48}
            className="object-cover rounded-lg"
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-scroll {
          animation: scroll 15s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Carousel;
