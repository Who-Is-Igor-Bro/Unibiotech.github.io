// Menu Hambúrguer
const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');
menuToggle.addEventListener('click', () => {
  menu.classList.toggle('menu-hidden');
  menu.classList.toggle('menu-visible');
});

// Animação da linha do tempo ao rolar
const timelineItems = document.querySelectorAll('.timeline-item');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.3 });

timelineItems.forEach(item => observer.observe(item));
