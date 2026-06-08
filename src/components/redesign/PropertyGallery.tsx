import React, { useState } from 'react';
import styles from './PropertyGallery.module.css';

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export const PropertyGallery: React.FC<PropertyGalleryProps> = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX;
    if (touchStart - touchEnd > 50) {
      handleNext();
    } else if (touchEnd - touchStart > 50) {
      handlePrev();
    }
  };

  return (
    <div className={styles.gallery}>
      <div
        className={styles.mainContainer}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={images[currentIndex]}
          alt={`${title} - ${currentIndex + 1}`}
          className={styles.mainImage}
        />

        {images.length > 1 && (
          <>
            <button
              className={`${styles.navButton} ${styles.prev}`}
              onClick={handlePrev}
              aria-label="Previous image"
            >
              ←
            </button>
            <button
              className={`${styles.navButton} ${styles.next}`}
              onClick={handleNext}
              aria-label="Next image"
            >
              →
            </button>
          </>
        )}

        <div className={styles.counter}>
          {currentIndex + 1}/{images.length}
        </div>
      </div>

      {images.length > 1 && (
        <div className={styles.thumbnailsContainer}>
          {images.map((img, idx) => (
            <button
              key={idx}
              className={`${styles.thumbnail} ${
                idx === currentIndex ? styles.active : ''
              }`}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`View image ${idx + 1}`}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
