import {useKeenSlider} from 'keen-slider/react.es';
import {useState} from 'react';
import {Image} from '@shopify/hydrogen';
import 'keen-slider/keen-slider.min.css';

/**
 * @param {{
 *   images: ProductFragment['images']['nodes'];
 * }}
 */
export function ProductImage({images}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    mode: 'snap',
    slides: {
      perView: 1,
      spacing: 10,
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  // Validación por si no hay imágenes
  if (!images || images.length === 0) {
    return <div className="bg-gray-100 aspect-square rounded-lg" />;
  }

  return (
    <div ref={sliderRef} className="keen-slider overflow-hidden rounded-lg pb-10">
      {images.map((img) => (
        <div key={img.id} className="keen-slider__slide">
          <Image
            alt={img.altText || 'Product Image'}
            aspectRatio="1/1"
            data={img}
            sizes="(min-width: 45em) 50vw, 100vw"
            className="object-cover w-full h-full"
          />
        </div>
      ))}

      {/* Flechas */}
      <button
        onClick={() => instanceRef.current?.prev()}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/70 p-2 rounded-full shadow-md cursor-pointer"
      >
        ◀
      </button>
      <button
        onClick={() => instanceRef.current?.next()}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/70 p-2 rounded-full shadow-md cursor-pointer"
      >
        ▶
      </button>

       {/* Dots */}
       <div className="flex justify-center mt-4 gap-2 absolute bottom-0 pb-3 text-center w-full">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => instanceRef.current?.moveToIdx(idx)}
            className={`h-2 w-2 rounded-full ${
              currentSlide === idx ? 'bg-black' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/** @typedef {import('storefrontapi.generated').ProductFragment} ProductFragment */