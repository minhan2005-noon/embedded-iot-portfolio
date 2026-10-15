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

const faceDemo = document.querySelector('#face-demo');
const faceDemoOpen = document.querySelector('[data-face-demo-open]');
const faceDemoClose = document.querySelector('[data-face-demo-close]');
const demoRun = document.querySelector('#demo-run');
const demoSteps = [...document.querySelectorAll('#demo-steps article')];
const demoResult = document.querySelector('#demo-result');
const faceTarget = document.querySelector('#face-target');
const cameraStatus = document.querySelector('#camera-status');
const demoTime = document.querySelector('#demo-time');
let demoTimers = [];

function clearDemoTimers() {
  demoTimers.forEach((timer) => window.clearTimeout(timer));
  demoTimers = [];
}

function resetFaceDemo() {
  clearDemoTimers();
  demoSteps.forEach((step) => {
    step.classList.remove('active', 'complete');
    step.querySelector('b').textContent = 'WAIT';
  });
  faceTarget?.classList.remove('scanning');
  cameraStatus?.classList.remove('processing', 'success');
  if (cameraStatus) cameraStatus.innerHTML = '<span></span> Camera sẵn sàng';
  demoResult?.classList.remove('granted');
  if (demoResult) demoResult.innerHTML = '<span>ACCESS STATUS</span><strong>READY</strong><small>Nhấn “Chạy nhận diện” để bắt đầu mô phỏng.</small>';
  if (demoRun) {
    demoRun.disabled = false;
    demoRun.textContent = 'Chạy nhận diện';
  }
}

function queueDemoStep(index, delay) {
  demoTimers.push(window.setTimeout(() => {
    if (index > 0) {
      demoSteps[index - 1].classList.remove('active');
      demoSteps[index - 1].classList.add('complete');
      demoSteps[index - 1].querySelector('b').textContent = 'DONE';
    }
    const step = demoSteps[index];
    step.classList.add('active');
    step.querySelector('b').textContent = 'RUN';
  }, delay));
}

faceDemoOpen?.addEventListener('click', () => {
  resetFaceDemo();
  demoTime.textContent = new Date().toLocaleTimeString('vi-VN', { hour12: false });
  faceDemo.showModal();
});

faceDemoClose?.addEventListener('click', () => faceDemo.close());
faceDemo?.addEventListener('click', (event) => {
  if (event.target === faceDemo) faceDemo.close();
});
faceDemo?.addEventListener('close', clearDemoTimers);

demoRun?.addEventListener('click', () => {
  resetFaceDemo();
  demoRun.disabled = true;
  demoRun.textContent = 'Đang xử lý...';
  faceTarget.classList.add('scanning');
  cameraStatus.classList.add('processing');
  cameraStatus.innerHTML = '<span></span> Đang phân tích khung hình';
  demoResult.innerHTML = '<span>ACCESS STATUS</span><strong>VERIFYING</strong><small>Đang xử lý dữ liệu mô phỏng...</small>';

  queueDemoStep(0, 120);
  queueDemoStep(1, 760);
  queueDemoStep(2, 1400);
  queueDemoStep(3, 2040);

  demoTimers.push(window.setTimeout(() => {
    const finalStep = demoSteps[demoSteps.length - 1];
    finalStep.classList.remove('active');
    finalStep.classList.add('complete');
    finalStep.querySelector('b').textContent = 'DONE';
    faceTarget.classList.remove('scanning');
    cameraStatus.classList.remove('processing');
    cameraStatus.classList.add('success');
    cameraStatus.innerHTML = '<span></span> Xác thực thành công · cửa đã mở';
    demoResult.classList.add('granted');
    demoResult.innerHTML = '<span>ACCESS STATUS</span><strong>ACCESS GRANTED</strong><small>Sự kiện mở cửa đã được ghi vào access log mô phỏng.</small>';
    demoRun.disabled = false;
    demoRun.textContent = 'Chạy lại';
  }, 2750));
});
