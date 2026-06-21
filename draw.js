// ============================================
// DATABASE GAMBAR (CONNECT THE DOTS)
// ============================================
const GAMBAR_DB = [
    {
        nama: 'Kucing',
        emoji: '🐱',
        level: 'Mudah',
        titik: [
            {x: 50, y: 30}, {x: 70, y: 20}, {x: 80, y: 40},
            {x: 85, y: 60}, {x: 75, y: 75}, {x: 60, y: 80},
            {x: 40, y: 80}, {x: 25, y: 75}, {x: 15, y: 60},
            {x: 20, y: 40}, {x: 30, y: 20}
        ],
        warnaDefault: '#FFA500'
    },
    {
        nama: 'Ikan',
        emoji: '🐟',
        level: 'Mudah',
        titik: [
            {x: 20, y: 50}, {x: 40, y: 30}, {x: 70, y: 30},
            {x: 85, y: 50}, {x: 70, y: 70}, {x: 40, y: 70},
            {x: 20, y: 50}
        ],
        warnaDefault: '#4488ff'
    },
    {
        nama: 'Bintang',
        emoji: '⭐',
        level: 'Sedang',
        titik: [
            {x: 50, y: 10}, {x: 60, y: 40}, {x: 90, y: 40},
            {x: 70, y: 60}, {x: 80, y: 90}, {x: 50, y: 75},
            {x: 20, y: 90}, {x: 30, y: 60}, {x: 10, y: 40},
            {x: 40, y: 40}
        ],
        warnaDefault: '#FFD700'
    },
    {
        nama: 'Rumah',
        emoji: '🏠',
        level: 'Sedang',
        titik: [
            {x: 20, y: 60}, {x: 50, y: 20}, {x: 80, y: 60},
            {x: 80, y: 90}, {x: 20, y: 90}
        ],
        warnaDefault: '#ff4444'
    },
    {
        nama: 'Bunga',
        emoji: '',
        level: 'Sulit',
        titik: [
            {x: 50, y: 50}, {x: 50, y: 30}, {x: 65, y: 35},
            {x: 70, y: 50}, {x: 65, y: 65}, {x: 50, y: 70},
            {x: 35, y: 65}, {x: 30, y: 50}, {x: 35, y: 35},
            {x: 50, y: 30}
        ],
        warnaDefault: '#ff88cc'
    },
    {
        nama: 'Kupu-kupu',
        emoji: '🦋',
        level: 'Sulit',
        titik: [
            {x: 50, y: 40}, {x: 30, y: 20}, {x: 15, y: 35},
            {x: 20, y: 55}, {x: 35, y: 60}, {x: 50, y: 50},
            {x: 65, y: 60}, {x: 80, y: 55}, {x: 85, y: 35},
            {x: 70, y: 20}, {x: 50, y: 40}
        ],
        warnaDefault: '#aa44ff'
    },
    {
        nama: 'Hati',
        emoji: '❤️',
        level: 'Mudah',
        titik: [
            {x: 50, y: 80}, {x: 20, y: 50}, {x: 20, y: 30},
            {x: 35, y: 20}, {x: 50, y: 35}, {x: 65, y: 20},
            {x: 80, y: 30}, {x: 80, y: 50}
        ],
        warnaDefault: '#ff4444'
    },
    {
        nama: 'Pohon',
        emoji: '🌳',
        level: 'Sedang',
        titik: [
            {x: 45, y: 90}, {x: 55, y: 90}, {x: 55, y: 60},
            {x: 75, y: 50}, {x: 80, y: 30}, {x: 65, y: 15},
            {x: 50, y: 20}, {x: 35, y: 15}, {x: 20, y: 30},
            {x: 25, y: 50}, {x: 45, y: 60}
        ],
        warnaDefault: '#44cc44'
    },
    {
        nama: 'Matahari',
        emoji: '☀️',
        level: 'Mudah',
        titik: [
            {x: 50, y: 30}, {x: 70, y: 30}, {x: 80, y: 50},
            {x: 70, y: 70}, {x: 50, y: 70}, {x: 30, y: 70},
            {x: 20, y: 50}, {x: 30, y: 30}
        ],
        warnaDefault: '#FFD700'
    },
    {
        nama: 'Roket',
        emoji: '🚀',
        level: 'Sulit',
        titik: [
            {x: 50, y: 10}, {x: 60, y: 30}, {x: 65, y: 60},
            {x: 75, y: 80}, {x: 60, y: 75}, {x: 55, y: 90},
            {x: 45, y: 90}, {x: 40, y: 75}, {x: 25, y: 80},
            {x: 35, y: 60}, {x: 40, y: 30}
        ],
        warnaDefault: '#ff8844'
    }
];

// ============================================
// STATE MENGGAMBAR
// ============================================
let drawState = {
    gambarAktif: null,
    canvas: null,
    ctx: null,
    mode: 'hubung', // hubung, bebas, hapus
    warnaAktif: '#000000',
    ukuranKuas: 5,
    sedangMenggambar: false,
    titikSekarang: 0,
    titikTerhubung: [],
    lastX: 0,
    lastY: 0
};

// ============================================
// INIT GAME MENGGAMBAR
// ============================================
function initGameMenggambar() {
    const grid = document.getElementById('pilihGambarGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    GAMBAR_DB.forEach((gambar, idx) => {
        const kartu = document.createElement('div');
        kartu.className = 'kartu-gambar';
        kartu.innerHTML = `
            <div class="emoji-besar">${gambar.emoji}</div>
            <div class="nama-gambar">${gambar.nama}</div>
            <div class="level-gambar">${gambar.level}</div>
        `;
        kartu.onclick = () => mulaiMenggambar(idx);
        grid.appendChild(kartu);
    });
}

function showMenuGambar() {
    showScreen('menu-gambar');
}

function mulaiMenggambar(idx) {
    drawState.gambarAktif = GAMBAR_DB[idx];
    drawState.titikSekarang = 0;
    drawState.titikTerhubung = [];
    drawState.mode = 'hubung';
    
    document.getElementById('judulGambar').textContent = drawState.gambarAktif.nama;
    showScreen('layar-menggambar');
    
    setTimeout(() => {
        setupCanvas();
        renderTitik();
        updateInfoLangkah();
    }, 100);
}

function setupCanvas() {
    const canvas = document.getElementById('canvasGambar');
    const container = canvas.parentElement;
    
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    
    drawState.canvas = canvas;
    drawState.ctx = canvas.getContext('2d');
    drawState.ctx.lineCap = 'round';
    drawState.ctx.lineJoin = 'round';
    drawState.ctx.strokeStyle = drawState.warnaAktif;
    drawState.ctx.lineWidth = drawState.ukuranKuas;
    
    // Clear canvas
    drawState.ctx.fillStyle = 'white';
    drawState.ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Setup event listeners
    canvas.onmousedown = mulaiGambar;
    canvas.onmousemove = sedangGambar;
    canvas.onmouseup = selesaiGambar;
    canvas.onmouseout = selesaiGambar;
    
    canvas.ontouchstart = (e) => { e.preventDefault(); mulaiGambar(e.touches[0]); };
    canvas.ontouchmove = (e) => { e.preventDefault(); sedangGambar(e.touches[0]); };
    canvas.ontouchend = (e) => { e.preventDefault(); selesaiGambar(); };
}

function getPos(e) {
    const canvas = drawState.canvas;
    const rect = canvas.getBoundingClientRect();
    return {
        x: (e.clientX - rect.left) * (canvas.width / rect.width),
        y: (e.clientY - rect.top) * (canvas.height / rect.height)
    };
}

function mulaiGambar(e) {
    drawState.sedangMenggambar = true;
    const pos = getPos(e);
    drawState.lastX = pos.x;
    drawState.lastY = pos.y;
    
    if (drawState.mode === 'hubung') {
        cekKlikTitik(pos);
    }
}

function sedangGambar(e) {
    if (!drawState.sedangMenggambar) return;
    const pos = getPos(e);
    
    const ctx = drawState.ctx;
    ctx.beginPath();
    ctx.moveTo(drawState.lastX, drawState.lastY);
    ctx.lineTo(pos.x, pos.y);
    
    if (drawState.mode === 'hapus') {
        ctx.strokeStyle = 'white';
        ctx.lineWidth = drawState.ukuranKuas * 3;
    } else {
        ctx.strokeStyle = drawState.warnaAktif;
        ctx.lineWidth = drawState.ukuranKuas;
    }
    
    ctx.stroke();
    drawState.lastX = pos.x;
    drawState.lastY = pos.y;
}

function selesaiGambar() {
    drawState.sedangMenggambar = false;
}

function cekKlikTitik(pos) {
    const titik = drawState.gambarAktif.titik;
    const canvas = drawState.canvas;
    const radius = 30;
    
    // Cek apakah klik dekat dengan titik yang harus dihubungkan
    const idxTarget = drawState.titikSekarang;
    if (idxTarget >= titik.length) return;
    
    const t = titik[idxTarget];
    const pixelX = (t.x / 100) * canvas.width;
    const pixelY = (t.y / 100) * canvas.height;
    
    const jarak = Math.sqrt(Math.pow(pos.x - pixelX, 2) + Math.pow(pos.y - pixelY, 2));
    
    if (jarak < radius) {
        hubungkanTitik(idxTarget);
    }
}

function hubungkanTitik(idx) {
    const titik = drawState.gambarAktif.titik;
    const canvas = drawState.canvas;
    const ctx = drawState.ctx;
    
    const t = titik[idx];
    const pixelX = (t.x / 100) * canvas.width;
    const pixelY = (t.y / 100) * canvas.height;
    
    // Tandai titik sebagai selesai
    const titikEl = document.getElementById('titik-' + idx);
    if (titikEl) {
        titikEl.classList.add('selesai');
        titikEl.classList.remove('aktif');
    }
    
    // Gambar garis dari titik sebelumnya
    if (drawState.titikTerhubung.length > 0) {
        const prevIdx = drawState.titikTerhubung[drawState.titikTerhubung.length - 1];
        const prevT = titik[prevIdx];
        const prevX = (prevT.x / 100) * canvas.width;
        const prevY = (prevT.y / 100) * canvas.height;
        
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(pixelX, pixelY);
        ctx.strokeStyle = drawState.warnaAktif;
        ctx.lineWidth = 4;
        ctx.stroke();
    }
    
    drawState.titikTerhubung.push(idx);
    drawState.titikSekarang = idx + 1;
    
    // Aktifkan titik berikutnya
    if (drawState.titikSekarang < titik.length) {
        const nextEl = document.getElementById('titik-' + drawState.titikSekarang);
        if (nextEl) nextEl.classList.add('aktif');
    }
    
    updateInfoLangkah();
    
    // Cek apakah semua titik sudah terhubung
    if (drawState.titikTerhubung.length === titik.length) {
        // Hubungkan titik terakhir ke pertama (jika bukan garis terbuka)
        const pertama = titik[0];
        const terakhir = titik[titik.length - 1];
        const px1 = (pertama.x / 100) * canvas.width;
        const py1 = (pertama.y / 100) * canvas.height;
        const px2 = (terakhir.x / 100) * canvas.width;
        const py2 = (terakhir.y / 100) * canvas.height;
        
        ctx.beginPath();
        ctx.moveTo(px2, py2);
        ctx.lineTo(px1, py1);
        ctx.strokeStyle = drawState.warnaAktif;
        ctx.lineWidth = 4;
        ctx.stroke();
        
        setTimeout(() => {
            document.getElementById('selesaiGambar').classList.remove('hidden');
            buatKonfetiBanyak();
        }, 500);
    }
}

function renderTitik() {
    const container = document.getElementById('titikContainer');
    container.innerHTML = '';
    
    const titik = drawState.gambarAktif.titik;
    titik.forEach((t, idx) => {
        const el = document.createElement('div');
        el.className = 'titik';
        el.id = 'titik-' + idx;
        el.style.left = t.x + '%';
        el.style.top = t.y + '%';
        el.textContent = idx + 1;
        container.appendChild(el);
    });
    
    // Aktifkan titik pertama
    const first = document.getElementById('titik-0');
    if (first) first.classList.add('aktif');
}

function updateInfoLangkah() {
    const total = drawState.gambarAktif.titik.length;
    const sekarang = drawState.titikSekarang;
    
    document.getElementById('progressTitik').textContent = sekarang + '/' + total;
    
    if (seorang < total) {
        const next = drawState.gambarAktif.titik[seorang];
        document.getElementById('langkahTeks').textContent = 
            'Hubungkan ke titik ' + (seorang + 1);
    } else {
        document.getElementById('langkahTeks').textContent = 'Selesai! 🎉';
    }
}

function setMode(mode) {
    drawState.mode = mode;
    document.querySelectorAll('.btn-mode').forEach(b => b.classList.remove('active'));
    
    if (mode === 'hubung') document.getElementById('btnHubung').classList.add('active');
    if (mode === 'bebas') document.getElementById('btnBebas').classList.add('active');
    if (mode === 'hapus') document.getElementById('btnHapus').classList.add('active');
    
    drawState.canvas.style.cursor = mode === 'hapus' ? 'cell' : 'crosshair';
}

function resetGambar() {
    if (confirm('Yakin mau reset gambar?')) {
        drawState.titikSekarang = 0;
        drawState.titikTerhubung = [];
        drawState.ctx.fillStyle = 'white';
        drawState.ctx.fillRect(0, 0, drawState.canvas.width, drawState.canvas.height);
        renderTitik();
        updateInfoLangkah();
    }
}

function simpanGambar() {
    const canvas = drawState.canvas;
    const link = document.createElement('a');
    link.download = 'gambar-' + drawState.gambarAktif.nama + '.png';
    link.href = canvas.toDataURL();
    link.click();
}

function tutupSelesaiGambar() {
    document.getElementById('selesaiGambar').classList.add('hidden');
    // Switch ke mode bebas untuk mewarnai
    setMode('bebas');
    // Sembunyikan titik
    document.getElementById('titikContainer').style.display = 'none';
}

// Setup warna picker
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.warna-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.warna-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            drawState.warnaAktif = btn.dataset.warna;
        };
    });
    
    const slider = document.getElementById('ukuranKuas');
    if (slider) {
        slider.oninput = () => {
            drawState.ukuranKuas = parseInt(slider.value);
            document.getElementById('ukuranTeks').textContent = slider.value + 'px';
        };
    }
});

// Init saat halaman load
window.addEventListener('load', () => {
    initGameMenggambar();
});
