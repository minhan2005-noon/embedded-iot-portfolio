const navToggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('#nav-list');

navToggle?.addEventListener('click', () => {
  const open = navList.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});

navList?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navList.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

document.querySelector('#print-cv')?.addEventListener('click', () => window.print());
document.querySelector('#year').textContent = new Date().getFullYear();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const sections = [...document.querySelectorAll('section[id]')];
const navLinks = [...document.querySelectorAll('.nav a')];
const activeObserver = new IntersectionObserver(
  (entries) => {
    const active = entries.find((entry) => entry.isIntersecting);
    if (!active) return;
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${active.target.id}`);
    });
  },
  { rootMargin: '-30% 0px -60% 0px' }
);

sections.forEach((section) => activeObserver.observe(section));
