// FASE 1: Video Hero + Testimonios + Animaciones + Trust Badges

const FASE1_ADDITIONS = {
  
  // 1. VIDEO HERO SECTION (reemplaza el hero actual)
  videoHeroSection: `
    <section style="position:relative;display:flex;align-items:center;overflow:hidden;padding:0 6%;background:var(--ink);min-height:70vh;height:70vh">
      <!-- Video Background -->
      <video style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;opacity:.6" 
             autoplay muted loop playsinline>
        <source src="https://cdn.pixabay.com/vimeo/761577124/luxury-home-5033-original.mp4" type="video/mp4">
      </video>
      
      <!-- Gradient Overlays -->
      <div style="position:absolute;inset:0;background:linear-gradient(105deg,rgba(13,27,62,.97) 0%,rgba(13,27,62,.68) 55%,rgba(20,34,64,.9) 100%)"></div>
      <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(13,27,62,.85) 0%,transparent 40%)"></div>
      
      <!-- Hero Content -->
      <div style="position:relative;z-index:2;max-width:760px;padding:20px 0 20px;animation:fadeInUp 1s ease-out">
        <div class="ey" style="animation:fadeInUp 1.2s ease-out">Guatemala · Patrimonio Inmobiliario</div>
        <h1 style="font-family:'Cormorant Garamond',serif;font-size:clamp(3rem,6.5vw,5.4rem);font-weight:300;line-height:1.06;margin-bottom:22px;animation:fadeInUp 1.4s ease-out">
          En Guatemala, la diferencia entre una casa y una <em style="color:var(--or);font-style:italic">residencia exclusiva</em> está en cada detalle.
        </h1>
        <p style="font-size:.85rem;font-weight:300;color:var(--sv);line-height:1.9;max-width:480px;margin-bottom:44px;animation:fadeInUp 1.6s ease-out">
          31 propiedades verificadas, oportunidades de inversión y un equipo que entiende que cada propiedad cuenta una historia. Asesoría privada para quienes saben qué buscan.
        </p>
        <div style="display:flex;gap:14px;flex-wrap:wrap;animation:fadeInUp 1.8s ease-out">
          <a href="/propiedades.html" class="btn-or" style="transition:all .3s">Ver Propiedades</a>
          <a href="https://wa.me/50245542088?text=Hola%2C%20quiero%20una%20asesor%C3%ADa%20privada%20de%20Zona%20INNmueble." target="_blank" rel="noopener" class="btn-ol" style="transition:all .3s">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Asesoría por WhatsApp
          </a>
        </div>
      </div>
      
      <!-- Stats Bar con Counter Animation -->
      <div style="position:absolute;bottom:0;left:0;right:0;background:rgba(20,34,64,.8);backdrop-filter:blur(16px);border-top:1px solid var(--gl);display:flex;justify-content:center;flex-wrap:wrap">
        <div style="padding:20px 44px;text-align:center;border-right:1px solid var(--bd);flex:1;max-width:220px;min-width:140px">
          <div class="counter" data-target="27" style="font-family:'Cormorant Garamond',serif;font-size:2.1rem;font-weight:500;color:var(--or);line-height:1;margin-bottom:5px">0</div>
          <div style="font-size:.58rem;font-weight:500;letter-spacing:.19em;text-transform:uppercase;color:var(--mt)">Propiedades</div>
        </div>
        <div style="padding:20px 44px;text-align:center;border-right:1px solid var(--bd);flex:1;max-width:220px;min-width:140px">
          <div class="counter" data-target="10" style="font-family:'Cormorant Garamond',serif;font-size:2.1rem;font-weight:500;color:var(--or);line-height:1;margin-bottom:5px">0</div>
          <div style="font-size:.58rem;font-weight:500;letter-spacing:.19em;text-transform:uppercase;color:var(--mt)">Años en el Mercado</div>
        </div>
        <div style="padding:20px 44px;text-align:center;flex:1;max-width:220px;min-width:140px">
          <div class="counter" data-target="5" style="font-family:'Cormorant Garamond',serif;font-size:2.1rem;font-weight:500;color:var(--or);line-height:1;margin-bottom:5px">0</div>
          <div style="font-size:.58rem;font-weight:500;letter-spacing:.19em;text-transform:uppercase;color:var(--mt)">Zonas Premium</div>
        </div>
      </div>
    </section>
  `,
  
  // 2. TESTIMONIOS SECTION
  testimonialsSection: `
    <section style="padding:80px 6%;background:var(--ink2);border-top:1px solid var(--gl)">
      <div style="max-width:1200px;margin:0 auto">
        <div class="ey" style="justify-content:center;margin-bottom:12px">TESTIMONIOS VERIFICADOS</div>
        <h2 style="font-family:'Cormorant Garamond',serif;font-size:clamp(2rem,4vw,3.2rem);font-weight:300;text-align:center;margin-bottom:60px;color:var(--wh)">
          Lo que dicen nuestros clientes
        </h2>
        
        <!-- Testimonials Grid -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:28px">
          
          <!-- Testimonial 1 -->
          <div class="testimonial-card" style="background:var(--ink3);padding:32px;border:1px solid var(--gl);border-radius:8px;transition:all .4s;transform:translateY(40px);opacity:0">
            <div style="display:flex;gap:8px;margin-bottom:16px">
              <span style="color:var(--or)">★★★★★</span>
            </div>
            <p style="font-style:italic;color:var(--sv);margin-bottom:24px;line-height:1.8">
              "Zona INNmueble me ayudó a encontrar la propiedad perfecta en Zona 10. El equipo fue muy profesional y comprensivo con mis necesidades. Altamente recomendado."
            </p>
            <div style="display:flex;align-items:center;gap:12px;padding-top:16px;border-top:1px solid var(--gl)">
              <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--or),var(--or2));display:flex;align-items:center;justify-content:center;color:var(--ink);font-weight:600;font-size:.9rem">MC</div>
              <div>
                <div style="font-weight:600;color:var(--wh);font-size:.9rem">María Castillo</div>
                <div style="color:var(--mt);font-size:.8rem">Empresaria</div>
              </div>
            </div>
          </div>
          
          <!-- Testimonial 2 -->
          <div class="testimonial-card" style="background:var(--ink3);padding:32px;border:1px solid var(--gl);border-radius:8px;transition:all .4s;transform:translateY(40px);opacity:0">
            <div style="display:flex;gap:8px;margin-bottom:16px">
              <span style="color:var(--or)">★★★★★</span>
            </div>
            <p style="font-style:italic;color:var(--sv);margin-bottom:24px;line-height:1.8">
              "Excelente asesoría para mi inversión inmobiliaria. Entendieron mi visión y me ofrecieron opciones que superaron mis expectativas."
            </p>
            <div style="display:flex;align-items:center;gap:12px;padding-top:16px;border-top:1px solid var(--gl)">
              <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--or),var(--or2));display:flex;align-items:center;justify-content:center;color:var(--ink);font-weight:600;font-size:.9rem">CG</div>
              <div>
                <div style="font-weight:600;color:var(--wh);font-size:.9rem">Carlos García</div>
                <div style="color:var(--mt);font-size:.8rem">Inversionista</div>
              </div>
            </div>
          </div>
          
          <!-- Testimonial 3 -->
          <div class="testimonial-card" style="background:var(--ink3);padding:32px;border:1px solid var(--gl);border-radius:8px;transition:all .4s;transform:translateY(40px);opacity:0">
            <div style="display:flex;gap:8px;margin-bottom:16px">
              <span style="color:var(--or)">★★★★★</span>
            </div>
            <p style="font-style:italic;color:var(--sv);margin-bottom:24px;line-height:1.8">
              "El servicio es impecable. Desde la búsqueda hasta la finalización, todo fue smooth y profesional. Definitivamente mi opción número uno."
            </p>
            <div style="display:flex;align-items:center;gap:12px;padding-top:16px;border-top:1px solid var(--gl)">
              <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--or),var(--or2));display:flex;align-items:center;justify-content:center;color:var(--ink);font-weight:600;font-size:.9rem">SL</div>
              <div>
                <div style="font-weight:600;color:var(--wh);font-size:.9rem">Sandra López</div>
                <div style="color:var(--mt);font-size:.8rem">Ejecutiva</div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  `,
  
  // 3. TRUST BADGES (para agregar en footer)
  trustBadgesHTML: `
    <div style="display:flex;gap:24px;justify-content:center;flex-wrap:wrap;padding:24px 0;border-top:1px solid var(--gl)">
      <div style="text-align:center;flex:1;min-width:120px">
        <div style="font-size:2.4rem;margin-bottom:4px">✓</div>
        <div style="font-size:.7rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--or)">31 Propiedades</div>
      </div>
      <div style="text-align:center;flex:1;min-width:120px">
        <div style="font-size:2.4rem;margin-bottom:4px">✓</div>
        <div style="font-size:.7rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--or)">100% Verificadas</div>
      </div>
      <div style="text-align:center;flex:1;min-width:120px">
        <div style="font-size:2.4rem;margin-bottom:4px">✓</div>
        <div style="font-size:.7rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--or)">10+ Años</div>
      </div>
      <div style="text-align:center;flex:1;min-width:120px">
        <div style="font-size:2.4rem;margin-bottom:4px">✓</div>
        <div style="font-size:.7rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--or)">Soporte 24/7</div>
      </div>
    </div>
  `,
  
  // 4. CSS ANIMATIONS
  animationsCSS: `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes countUp {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    .testimonial-card:hover {
      transform: translateY(-8px) !important;
      border-color: var(--or) !important;
      background: linear-gradient(135deg, rgba(245,130,13,.05), transparent) !important;
    }
    
    .btn-or:hover, .btn-ol:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(245,130,13,.2);
    }
    
    /* Counter Animation */
    .counter {
      display: inline-block;
    }
  `,
  
  // 5. JAVASCRIPT PARA ANIMACIONES Y COUNTERS
  animationsJS: `
    <script>
    // Counter Animation
    function animateCounters() {
      const counters = document.querySelectorAll('.counter');
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        let current = 0;
        const increment = target / 30;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            counter.textContent = target;
            clearInterval(timer);
          } else {
            counter.textContent = Math.floor(current);
          }
        }, 50);
      });
    }
    
    // Testimonials Fade In
    function animateTestimonials() {
      const testimonials = document.querySelectorAll('.testimonial-card');
      testimonials.forEach((el, index) => {
        setTimeout(() => {
          el.style.transform = 'translateY(0)';
          el.style.opacity = '1';
        }, 100 + index * 150);
      });
    }
    
    // Button Hover Effects
    document.querySelectorAll('.btn-or, .btn-ol').forEach(btn => {
      btn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
      });
      btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
      });
    });
    
    // Intersection Observer para lazy loading
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('counter')) {
            animateCounters();
          }
          if (entry.target.classList.contains('testimonials-container')) {
            animateTestimonials();
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    // Observe elements
    document.querySelectorAll('.counter').forEach(el => observer.observe(el.parentElement));
    const testimonialsContainer = document.querySelector('[style*="testimonial-card"]')?.parentElement;
    if (testimonialsContainer) observer.observe(testimonialsContainer);
    
    // Initialize on load
    window.addEventListener('load', () => {
      animateCounters();
      animateTestimonials();
    });
    </script>
  `
};

module.exports = FASE1_ADDITIONS;
