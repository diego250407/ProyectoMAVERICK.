 class ScrollManager {
  constructor() {
    this.sections = document.querySelectorAll('.section');
    this.nav = document.getElementById('mainNav');
    this.scrollToTop = document.getElementById('scrollToTop');
    this.navLinks = document.querySelectorAll('.nav-links a');
    this.emailButton = document.getElementById('emailButton');
    this.emailList = document.getElementById('emailList');
    this.closeEmails = document.getElementById('closeEmails');
    
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    this.init();
  }

  init() {
    // Asegurar que el body sea scrollable
    document.body.style.overflowX = 'hidden';
    document.body.style.overflowY = 'auto';
    document.body.style.height = 'auto';
    
    this.handleLoading();
    this.handleNavigation();
    this.setupScrollAnimations();
    this.setupScrollToTop();
    this.setupSmoothScrolling();
    this.setupEmailList();
    
    // Forzar un reflow para asegurar que todo se renderice correctamente
    setTimeout(() => {
      document.body.style.display = 'none';
      document.body.offsetHeight;
      document.body.style.display = 'block';
    }, 100);
  }

  handleLoading() {
    const intro = document.getElementById('intro');
    
    // Mostrar el contenido principal inmediatamente
    document.querySelector('.main-content').style.visibility = 'visible';
    
    setTimeout(() => {
      if (intro) {
        intro.classList.add('hidden');
        // Habilitar scroll completamente
        document.body.style.overflowY = 'auto';
        document.documentElement.style.overflowY = 'auto';
      }
      
      // Mostrar nav después de loading
      setTimeout(() => {
        if (this.nav) {
          this.nav.classList.add('visible');
        }
      }, 500);
    }, 3000);
  }

  handleNavigation() {
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      
      // Mostrar/ocultar nav basado en dirección del scroll
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        this.nav.classList.remove('scrolled');
      } else {
        this.nav.classList.add('scrolled');
      }
      
      lastScrollY = currentScrollY;
      
      // Actualizar enlaces activos
      this.updateActiveNavLink();
    }, { passive: true });
  }

  updateActiveNavLink() {
    const scrollPosition = window.scrollY + 100;
    
    this.navLinks.forEach(link => {
      const section = document.querySelector(link.hash);
      if (section) {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  }

  setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          entry.target.classList.remove('hidden');
        }
      });
    }, this.observerOptions);

    // Observar secciones principales
    this.sections.forEach(section => {
      section.classList.add('hidden');
      observer.observe(section);
    });

    // Observar elementos específicos
    const animatableElements = [
      '.description-card',
      '.features-list',
      '.timeline-item', 
      '.media-item',
      '.blooper-item',
      '.blooper-video'
    ];

    animatableElements.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element, index) => {
        element.classList.add('hidden');
        observer.observe(element);
      });
    });
  }

  setupScrollToTop() {
    if (!this.scrollToTop) return;
    
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        this.scrollToTop.classList.add('visible');
      } else {
        this.scrollToTop.classList.remove('visible');
      }
    }, { passive: true });

    this.scrollToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  setupSmoothScrolling() {
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.hash);
        if (target) {
          const targetPosition = target.offsetTop - 80;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Cerrar lista de emails si está abierta
          if (this.emailList) {
            this.emailList.classList.remove('active');
          }
        }
      });
    });
  }

  setupEmailList() {
    if (!this.emailButton || !this.emailList) return;
    
    this.emailButton.addEventListener('click', (e) => {
      e.stopPropagation();
      this.emailList.classList.toggle('active');
    });

    if (this.closeEmails) {
      this.closeEmails.addEventListener('click', (e) => {
        e.stopPropagation();
        this.emailList.classList.remove('active');
      });
    }

    document.addEventListener('click', (e) => {
      if (!this.emailList.contains(e.target) && !this.emailButton.contains(e.target)) {
        this.emailList.classList.remove('active');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.emailList.classList.remove('active');
      }
    });
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  new ScrollManager();
});

// Añadir estilos para enlaces activos
const style = document.createElement('style');
style.textContent = `
  .nav-links a.active {
    color: var(--accent, #fdbb2d) !important;
  }
  .nav-links a.active::after {
    width: 100% !important;
  }
  
  /* Asegurar que el scroll funcione */
  html { 
    scroll-behavior: smooth;
    overflow-x: hidden;
  }
  
  body {
    overflow-y: auto !important;
    overflow-x: hidden !important;
  }
`;
document.head.appendChild(style);