function heroSection() {
  return `
    <style>
      :root {
        --color-primary: #1a2a4e;
        --color-primary-light: #2d4069;
        --color-accent: #ffa500;
        --radius-lg: 12px;
        --radius-md: 8px;
        --shadow-xl: 0 20px 50px rgba(0, 0, 0, 0.15);
        --transition: 300ms ease-in-out;
      }

      .hero {
        position: relative;
        min-height: 600px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 60px 20px;
        overflow: hidden;
      }

      .hero-background {
        position: absolute;
        inset: 0;
        z-index: 0;
      }

      .hero-background-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .hero-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, rgba(26, 42, 78, 0.7) 0%, rgba(15, 31, 60, 0.5) 50%, rgba(245, 247, 250, 0.85) 100%);
      }

      .hero-content {
        position: relative;
        z-index: 1;
        max-width: 700px;
        width: 100%;
        text-align: center;
      }

      .hero-title {
        font-size: 56px;
        font-weight: 700;
        color: #ffffff;
        margin-bottom: 16px;
        line-height: 1.2;
        letter-spacing: -0.5px;
      }

      .hero-subtitle {
        font-size: 18px;
        color: rgba(255, 255, 255, 0.95);
        margin-bottom: 40px;
        font-weight: 400;
      }

      .search-box {
        background: white;
        border-radius: var(--radius-lg);
        padding: 24px;
        box-shadow: var(--shadow-xl);
      }

      .search-tabs {
        display: flex;
        gap: 16px;
        margin-bottom: 20px;
        border-bottom: 2px solid #e5e7eb;
        padding-bottom: 12px;
      }

      .search-tab {
        background: none;
        border: none;
        padding: 8px 16px;
        font-size: 14px;
        font-weight: 600;
        color: #6b7280;
        cursor: pointer;
        border-bottom: 3px solid transparent;
        margin-bottom: -14px;
        transition: all var(--transition);
      }

      .search-tab:hover {
        color: var(--color-primary);
      }

      .search-tab.active {
        color: var(--color-primary);
        border-bottom-color: var(--color-accent);
      }

      .search-input-group {
        display: flex;
        gap: 12px;
        align-items: center;
      }

      .search-input {
        flex: 1;
        padding: 14px 16px;
        border: 2px solid #e5e7eb;
        border-radius: var(--radius-md);
        font-size: 14px;
        transition: all var(--transition);
        font-family: inherit;
      }

      .search-input:focus {
        outline: none;
        border-color: var(--color-accent);
        box-shadow: 0 0 0 3px rgba(255, 165, 0, 0.1);
      }

      .search-button {
        padding: 14px 32px;
        background: var(--color-primary);
        color: white;
        border: none;
        border-radius: var(--radius-md);
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all var(--transition);
        white-space: nowrap;
      }

      .search-button:hover {
        background: var(--color-primary-light);
        transform: translateY(-2px);
        box-shadow: 0 8px 16px rgba(26, 42, 78, 0.2);
      }

      @media (max-width: 768px) {
        .hero {
          min-height: 500px;
          padding: 40px 20px;
        }

        .hero-title {
          font-size: 36px;
        }

        .hero-subtitle {
          font-size: 16px;
        }

        .search-box {
          padding: 16px;
        }

        .search-tabs {
          gap: 8px;
        }

        .search-tab {
          padding: 6px 12px;
          font-size: 12px;
        }

        .search-input-group {
          flex-direction: column;
        }

        .search-input {
          width: 100%;
        }

        .search-button {
          width: 100%;
        }
      }
    </style>

    <section class="hero">
      <div class="hero-background">
        <img src="/images/hero/property-hero.jpg" alt="Hero background" class="hero-background-image" loading="lazy" />
        <div class="hero-overlay"></div>
      </div>

      <div class="hero-content">
        <h1 class="hero-title">
          Las mejores propiedades<br />premium en Guatemala
        </h1>
        <p class="hero-subtitle">
          Donde las oportunidades inmobiliarias se conectan
        </p>

        <form class="search-box" onsubmit="handleHeroSearch(event)">
          <div class="search-tabs">
            <button type="button" class="search-tab active" data-type="buy">🏠 Comprar</button>
            <button type="button" class="search-tab" data-type="rent">🔑 Alquilar</button>
            <button type="button" class="search-tab" data-type="sell">💰 Vender</button>
          </div>

          <div class="search-input-group">
            <input type="text" id="hero-search-input" placeholder="Ubicación, zona, dirección..." class="search-input" />
            <button type="submit" class="search-button">Buscar</button>
          </div>
        </form>
      </div>
    </section>

    <script>
      let heroSearchType = 'buy';
      
      document.querySelectorAll('.search-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
          e.preventDefault();
          document.querySelectorAll('.search-tab').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          heroSearchType = tab.dataset.type;
        });
      });

      function handleHeroSearch(e) {
        e.preventDefault();
        const searchInput = document.getElementById('hero-search-input').value;
        const params = new URLSearchParams({
          type: heroSearchType,
          q: searchInput,
        });
        window.location.href = '/buscar?' + params.toString();
      }
    </script>
  `;
}

module.exports = { heroSection };
