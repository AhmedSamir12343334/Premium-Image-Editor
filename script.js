const uploadInput = document.getElementById('upload');
const downloadBtn = document.getElementById('download');
const resetBtn = document.getElementById('reset');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const sourceImage = document.getElementById('source-image');
const placeholder = document.getElementById('placeholder');

const filters = {
    saturate: { el: document.getElementById('saturate'), valText: document.getElementById('saturate-val'), unit: '%', default: 100 },
    contrast: { el: document.getElementById('contrast'), valText: document.getElementById('contrast-val'), unit: '%', default: 100 },
    brightness: { el: document.getElementById('brightness'), valText: document.getElementById('brightness-val'), unit: '%', default: 100 },
    sepia: { el: document.getElementById('sepia'), valText: document.getElementById('sepia-val'), unit: '%', default: 0 },
    grayscale: { el: document.getElementById('grayscale'), valText: document.getElementById('grayscale-val'), unit: '', default: 0 },
    blur: { el: document.getElementById('blur'), valText: document.getElementById('blur-val'), unit: 'px', default: 0 },
    'hue-rotate': { el: document.getElementById('hue-rotate'), valText: document.getElementById('hue-rotate-val'), unit: 'deg', default: 0 }
};

let isImageLoaded = false;

function init() {
    setupEventListeners();
}

function setupEventListeners() {
    uploadInput.addEventListener('change', handleUpload);
    resetBtn.addEventListener('click', resetFilters);
    downloadBtn.addEventListener('click', handleDownload);

    for (const key in filters) {
        filters[key].el.addEventListener('input', () => {
            updateFilterValueDisplay(key);
            if (isImageLoaded) {
                applyFilters();
            }
        });
    }
}

function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (event) {
        sourceImage.src = event.target.result;
    }

    sourceImage.onload = function () {
        canvas.width = sourceImage.width;
        canvas.height = sourceImage.height;

        isImageLoaded = true;
        resetFilters();

        placeholder.style.display = 'none';
        canvas.classList.add('active');
        downloadBtn.disabled = false;
        resetBtn.disabled = false;
    }
}

function applyFilters() {
    if (!isImageLoaded) return;

    const filterString = `
        saturate(${filters.saturate.el.value}%)
        contrast(${filters.contrast.el.value}%)
        brightness(${filters.brightness.el.value}%)
        sepia(${filters.sepia.el.value}%)
        grayscale(${filters.grayscale.el.value})
        blur(${filters.blur.el.value}px)
        hue-rotate(${filters['hue-rotate'].el.value}deg)
    `;

    ctx.filter = filterString;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(sourceImage, 0, 0, canvas.width, canvas.height);
}

function resetFilters() {
    for (const key in filters) {
        filters[key].el.value = filters[key].default;
        updateFilterValueDisplay(key);
    }
    applyFilters();
}

function updateFilterValueDisplay(key) {
    const filter = filters[key];
    filter.valText.textContent = `${filter.el.value}${filter.unit}`;
}

function handleDownload() {
    if (!isImageLoaded) return;

    const image = canvas.toDataURL('image/jpeg', 1.0);
    const link = document.createElement('a');
    link.download = 'Lumina_Edited_Image.jpg';
    link.href = image;
    link.click();
}

init();
