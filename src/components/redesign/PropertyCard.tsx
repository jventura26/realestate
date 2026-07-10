import React, { useState } from 'react';
import Link from 'next/link';
import styles from './PropertyCard.module.css';

interface PropertyCardProps {
  id: string;
  title: string;
  price: number;
  location: string;
  mainImage: string;
  totalImages: number;
  beds: number;
  baths: number;
  sqft: number;
  status: 'new' | 'exclusive' | 'coming-soon';
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  title,
  price,
  location,
  mainImage,
  totalImages,
  beds,
  baths,
  sqft,
  status,
}) => {
  const [isSaved, setIsSaved] = useState(false);

  const statusLabels = {
    new: 'NUEVA',
    exclusive: 'EXCLUSIVA',
    'coming-soon': 'PRÓXIMAMENTE',
  };

  return (
    <Link href={`/propiedad/${id}`}>
      <div className={styles.card}>
        <div className={styles.imageContainer}>
          <img src={mainImage} alt={title} className={styles.image} loading="lazy" />
          <div className={styles.badge}>{statusLabels[status]}</div>
          <button
            className={`${styles.saveButton} ${isSaved ? styles.saved : ''}`}
            onClick={(e) => {
              e.preventDefault();
              setIsSaved(!isSaved);
            }}
          >
            ❤️
          </button>
          <div className={styles.counter}>1/{totalImages}</div>
        </div>

        <div className={styles.info}>
          <div className={styles.price}>${price.toLocaleString('es-GT')}</div>
          <div className={styles.location}>{location}</div>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span>🛏️</span>
              <span>{beds} Beds</span>
            </div>
            <div className={styles.stat}>
              <span>🚿</span>
              <span>{baths} Baths</span>
            </div>
            <div className={styles.stat}>
              <span>📐</span>
              <span>{sqft}m²</span>
            </div>
          </div>

          <button className={styles.ctaButton}>VER DETALLES →</button>
        </div>
      </div>
    </Link>
  );
};
