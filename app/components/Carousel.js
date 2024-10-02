import Image from "next/image";
import { useEffect, useRef } from 'react';

const Carousel = ({ images }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const scrollWidth = scrollRef.current.scrollWidth;
    const animationDuration = scrollWidth / 50; 

    scrollRef.current.style.setProperty('--scroll-width', `${scrollWidth}px`);
    scrollRef.current.style.setProperty('--animation-duration', `${animationDuration}s`);
  }, [images]);

  return (
    <div className="w-full overflow-hidden py-8 mt-8">
      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-8 items-center justify-start animate-scroll"
      >
        {images.concat(images).map((src, index) => (
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
        .animate-scroll {
          animation: scroll var(--animation-duration) linear infinite;
          transform: translateX(calc(-1 * var(--scroll-width) / 2));
        }
        @keyframes scroll {
          0% {
            transform: translateX(calc(-1 * var(--scroll-width) / 2));
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Carousel;