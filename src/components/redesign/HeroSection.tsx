import React, { useState } from 'react';
import styles from './HeroSection.module.css';

export const HeroSection: React.FC = () => {
  const [searchType, setSearchType] = useState<'buy' | 'rent' | 'sell'>('buy');
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      type: searchType,
      q: searchInput,
    });
    window.location.href = `/buscar?${params.toString()}`;
  };

  return (
    <section className={styles.hero}>
      <div className={styles.background}>
        <img src="/images/hero/property-hero.jpg" alt="Hero background" className={styles.backgroundImage} loading="lazy" />
        <div className={styles.overlay}></div>
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>
          Las mejores propiedades<br />premium en Guatemala
        </h1>
        <p className={styles.subtitle}>
          Donde las oportunidades inmobiliarias se conectan
        </p>

        <form onSubmit={handleSearch} className={styles.searchBox}>
          <div className={styles.typeTabs}>
            <button
              type="button"
              className={`${styles.typeTab} ${searchType === 'buy' ? styles.active : ''}`}
              onClick={() => setSearchType('buy')}
            >
              🏠 Comprar
            </button>
            <button
              type="button"
              className={`${styles.typeTab} ${searchType === 'rent' ? styles.active : ''}`}
              onClick={() => setSearchType('rent')}
            >
              🔑 Alquilar
            </button>
            <button
              type="button"
              className={`${styles.typeTab} ${searchType === 'sell' ? styles.active : ''}`}
              onClick={() => setSearchType('sell')}
            >
              💰 Vender
            </button>
          </div>

          <div className={styles.searchInput}>
            <input
              type="text"
              placeholder="Ubicación, zona, dirección..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className={styles.input}
            />
            <button type="submit" className={styles.searchButton}>
              Buscar
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
