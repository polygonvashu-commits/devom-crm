export function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    observer.observe(el);
  });
}

export function animateCounter(element, target, duration = 1500) {
  if (!element) return;
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const currentValue = Math.floor(progress * target);
    
    // Formatting for rupee or percentage
    if (element.dataset.format === 'currency') {
      element.innerHTML = `₹${(currentValue / 10).toFixed(1)} Cr`;
    } else if (element.dataset.format === 'percent') {
      element.innerHTML = `${(progress * target).toFixed(1)}%`;
    } else {
      element.innerHTML = currentValue.toLocaleString();
    }

    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

export function initParallax() {
  const hero = document.querySelector('.parallax-bg');
  if (!hero) return;
  window.addEventListener('scroll', () => {
    const depth = 0.3;
    const scroll = window.scrollY;
    hero.style.transform = `translateY(${scroll * depth}px)`;
  });
}

export function staggerChildren(parentSelector, childSelector, baseDelay = 100) {
  const parent = document.querySelector(parentSelector);
  if (!parent) return;
  const children = parent.querySelectorAll(childSelector);
  children.forEach((child, index) => {
    child.style.animationDelay = `${index * baseDelay}ms`;
  });
}
