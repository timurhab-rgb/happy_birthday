// 1. ПАРАЛЛАКС: фон начинается с нижней части, при скролле поднимается вверх
const parallaxBg = document.getElementById('parallaxBg');
let ticking = false;

function updateParallax() {
    const scrollY = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    let percent = maxScroll > 0 ? scrollY / maxScroll : 0;
    percent = Math.min(1, Math.max(0, percent));
    const verticalPosition = Math.min(1, percent * 0.5) * 100;
    parallaxBg.style.backgroundPosition = `center ${verticalPosition}%`;
    ticking = false;
}

function onScroll() {
    if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
    }
}

window.addEventListener('scroll', onScroll);
window.addEventListener('resize', () => updateParallax());
updateParallax();

// 2. ГАЛЕРЕЯ
const originalMessages = [
    "Моя дорогая малышка, поздравляю тебя с Днём Рождения 💖",
    "Мне очень жаль, что в такой день меня нет рядом, но этой открыткой я постараюсь передать все свои чувства и тёплые пожелания.",
    "Желаю тебе идти дальше к вершинам, покорять новые рубежи в карьере. Ты способна на всё!",
    "Пусть учёба в универе не напрягает, а дарит только полезные знания и интересные открытия для тебя.",
    "Конечно, желаю здоровья тебе, твоей семье и всем близким людям. Это самое главное.",
    "Помни, что ты у меня самая лучшая. Всегда восхищался твоей целеустремлённостью, настойчивостью, умением доводить дело до конца.",
    "Спасибо, что ты у меня есть, люблю тебя ❤️"
];

const imageUrls = [
    "IMG_0279.jpeg", "IMG_0305.jpeg", "IMG_0351.png",
    "IMG_0509.jpeg", "IMG_0720.jpeg", "IMG_0853.jpeg", "IMG_0899.jpeg"
];

const galleryContainer = document.getElementById('galleryContainer');

function buildGallery() {
    if (!galleryContainer) return;
    galleryContainer.innerHTML = '';
    for (let i = 0; i < originalMessages.length; i++) {
        const row = document.createElement('div');
        row.className = 'photo-row';

        const photoDiv = document.createElement('div');
        photoDiv.className = 'photo-box';
        const img = document.createElement('img');
        img.className = 'photo-img';
        img.src = imageUrls[i];
        img.alt = `Дорогой момент ${i+1}`;
        img.loading = 'lazy';
        img.onerror = () => {
            img.src = "https://picsum.photos/id/104/800/600?grayscale&seed=birthday";
            img.style.opacity = "0.9";
        };
        photoDiv.appendChild(img);

        const captionDiv = document.createElement('div');
        captionDiv.className = 'caption-box';
        const captionText = document.createElement('div');
        captionText.className = 'caption-text';
        captionText.textContent = originalMessages[i];
        captionDiv.appendChild(captionText);

        row.appendChild(photoDiv);
        row.appendChild(captionDiv);
        galleryContainer.appendChild(row);
    }
}

// 3. АНИМАЦИЯ ПОЯВЛЕНИЯ
function initScrollReveal() {
    const boxes = document.querySelectorAll('.photo-box');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    boxes.forEach(box => observer.observe(box));
}

// 4. ВЫЛЕТ ФРАЗ — ОБНОВЛЁННЫЙ (крупные и далеко)
function createFloatingText(centerX, centerY) {
    const text = document.createElement('div');
    text.className = 'floating-text';
    text.textContent = '✨ Happy birthday ✨';
    const angle = Math.random() * Math.PI * 2;
    const distance = 200 + Math.random() * 350;  // увеличен разлёт
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;
    text.style.setProperty('--dx', `${dx}px`);
    text.style.setProperty('--dy', `${dy}px`);
    text.style.left = `${centerX}px`;
    text.style.top = `${centerY}px`;
    text.style.transform = 'translate(-50%, -50%)';
    document.body.appendChild(text);
    setTimeout(() => {
        if (text.parentNode) text.parentNode.removeChild(text);
    }, 1600);
}

const heart = document.getElementById('heartBtn');
if (heart) {
    heart.addEventListener('click', () => {
        const rect = heart.getBoundingClientRect();
        const centerX = rect.left + rect.width / 10;
        const centerY = rect.top + rect.height / 5;

        const phrasesCount = 30 + Math.floor(Math.random() * 20); // больше фраз
        for (let i = 0; i < phrasesCount; i++) {
            setTimeout(() => {
                createFloatingText(centerX, centerY);
            }, i * 12);
        }

        heart.style.transform = 'scale(1.3) rotate(-45deg)';
        setTimeout(() => {
            if (heart) heart.style.transform = '';
        }, 220);

        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.backgroundColor = 'rgba(255, 200, 200, 0.2)';
        flash.style.pointerEvents = 'none';
        flash.style.zIndex = '999';
        flash.style.transition = 'opacity 0.3s ease';
        flash.style.opacity = '0';
        document.body.appendChild(flash);
        setTimeout(() => flash.style.opacity = '1', 10);
        setTimeout(() => {
            flash.style.opacity = '0';
            setTimeout(() => flash.remove(), 300);
        }, 150);
    });
}

// 5. СТРЕЛКА ПРОКРУТКИ
const scrollHint = document.getElementById('scrollHint');
if (scrollHint) {
    scrollHint.addEventListener('click', () => {
        document.querySelector('.gallery-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}

// 6. ЗАПУСК
document.addEventListener('DOMContentLoaded', () => {
    buildGallery();
    setTimeout(() => {
        initScrollReveal();
        document.querySelectorAll('.photo-box').forEach(box => {
            const rect = box.getBoundingClientRect();
            if (rect.top < window.innerHeight - 80) box.classList.add('visible');
        });
    }, 100);
});

window.addEventListener('load', () => {
    updateParallax();
});

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        updateParallax();
        document.querySelectorAll('.photo-box:not(.visible)').forEach(box => {
            const rect = box.getBoundingClientRect();
            if (rect.top < window.innerHeight - 50) box.classList.add('visible');
        });
    }, 100);
});