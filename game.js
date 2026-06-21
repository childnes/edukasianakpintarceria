// Database konten
const DATA = {
    hewan: [
        {nama: 'Sapi', gambar: '🐄'},
        {nama: 'Kucing', gambar: '🐱'},
        {nama: 'Ayam', gambar: '🐔'},
        {nama: 'Bebek', gambar: '🦆'},
        {nama: 'Anjing', gambar: '🐶'},
        {nama: 'Kuda', gambar: '🐴'},
        {nama: 'Gajah', gambar: '🐘'},
        {nama: 'Singa', gambar: '🦁'},
        {nama: 'Monyet', gambar: '🐵'},
        {nama: 'Kelinci', gambar: '🐰'}
    ],
    buah: [
        {nama: 'Apel', gambar: '🍎'},
        {nama: 'Pisang', gambar: '🍌'},
        {nama: 'Jeruk', gambar: '🍊'},
        {nama: 'Anggur', gambar: '🍇'},
        {nama: 'Stroberi', gambar: '🍓'},
        {nama: 'Semangka', gambar: '🍉'},
        {nama: 'Nanas', gambar: '🍍'},
        {nama: 'Mangga', gambar: '🥭'}
    ],
    warna: [
        {nama: 'Merah', kode: '#ff4444', emoji: '🔴'},
        {nama: 'Biru', kode: '#4488ff', emoji: '🔵'},
        {nama: 'Kuning', kode: '#ffdd44', emoji: '🟡'},
        {nama: 'Hijau', kode: '#44cc44', emoji: '🟢'},
        {nama: 'Ungu', kode: '#aa44ff', emoji: '🟣'},
        {nama: 'Oranye', kode: '#ff8844', emoji: '🟠'}
    ]
};

// State game
let state = {
    level: 1,
    mulai: 1,
    akhir: 50,
    salah: 0,
    soal: null,
    progress: {},
    pemain: null,
    usiaTerpilih: 0
};

// ============================================
// SISTEM LOGIN
// ============================================

// Cek apakah sudah ada pemain tersimpan
function cekLogin() {
    const saved = localStorage.getItem('pemainAktif');
    if (saved) {
        state.pemain = JSON.parse(saved);
        state.progress = JSON.parse(localStorage.getItem('progress_' + state.pemain.nama) || '{}');
        tampilkanMenu();
        showScreen('menu');
    }
}

function pilihUsia(usia) {
    state.usiaTerpilih = usia;
    
    // Update tampilan tombol usia
    document.querySelectorAll('.btn-usia').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.btn-usia[data-usia="${usia}"]`).classList.add('active');
    
    // Aktifkan tombol masuk jika nama sudah diisi
    cekFormLogin();
}

function cekFormLogin() {
    const nama = document.getElementById('nama').value.trim();
    const btn = document.getElementById('btnMasuk');
    
    if (nama.length > 0 && state.usiaTerpilih > 0) {
        btn.disabled = false;
    } else {
        btn.disabled = true;
    }
}

// Panggil saat input nama berubah
document.addEventListener('DOMContentLoaded', () => {
    const inputNama = document.getElementById('nama');
    if (inputNama) {
        inputNama.addEventListener('input', cekFormLogin);
    }
    cekLogin();
});

function masukGame() {
    const nama = document.getElementById('nama').value.trim();
    const usia = state.usiaTerpilih;
    
    if (!nama || !usia) {
        tampilkanInfo('Isi nama dan pilih usia dulu ya!');
        return;
    }
    
    if (usia < 1 || usia > 7) {
        tampilkanInfo('Usia harus antara 1-7 tahun');
        return;
    }
    
    // Simpan data pemain
    state.pemain = {
        nama: nama,
        usia: usia,
        tanggalDaftar: new Date().toISOString()
    };
    
    localStorage.setItem('pemainAktif', JSON.stringify(state.pemain));
    
    // Load progress atau buat baru
    const savedProgress = localStorage.getItem('progress_' + nama);
    if (savedProgress) {
        state.progress = JSON.parse(savedProgress);
    } else {
        state.progress = {};
        // AUTO-UNLOCK: Tandai level sebelumnya sebagai selesai
        autoUnlockLevel(usia);
    }
    
    tampilkanMenu();
    showScreen('menu');
}

function autoUnlockLevel(usia) {
    // Tentukan level awal berdasarkan usia
    let levelAwal = 1;
    if (usia >= 2) levelAwal = 1;
    if (usia >= 3) levelAwal = 51;
    if (usia >= 4) levelAwal = 151;
    if (usia >= 5) levelAwal = 301;
    if (usia >= 6) levelAwal = 501;
    if (usia >= 7) levelAwal = 751;
    
    // Tandai semua level sebelum levelAwal sebagai selesai (3 bintang)
    for (let i = 1; i < levelAwal; i++) {
        state.progress[i] = 3;
    }
    
    // Simpan
    localStorage.setItem('progress_' + state.pemain.nama, JSON.stringify(state.progress));
    
    tampilkanInfo(`Level 1-${levelAwal - 1} sudah terbuka otomatis! 🎉`);
}

function tampilkanInfo(pesan) {
    const info = document.getElementById('infoLogin');
    info.textContent = pesan;
    info.classList.add('show');
    setTimeout(() => info.classList.remove('show'), 3000);
}

function tampilkanMenu() {
    if (!state.pemain) return;
    
    document.getElementById('namaUser').textContent = state.pemain.nama;
    document.getElementById('usiaUser').textContent = 'Usia ' + state.pemain.usia + ' tahun';
    
    // Avatar berdasarkan usia
    const avatarList = ['👶', '', '🧒', '👦', '👧', '', '👩', ''];
    document.getElementById('avatarUser').textContent = avatarList[state.pemain.usia] || '👶';
    
    // Sapaan
    const jam = new Date().getHours();
    let sapaan = 'Halo';
    if (jam < 12) sapaan = 'Selamat Pagi';
    else if (jam < 15) sapaan = 'Selamat Siang';
    else if (jam < 18) sapaan = 'Selamat Sore';
    else sapaan = 'Selamat Malam';
    document.getElementById('sapaan').textContent = sapaan + ', ' + state.pemain.nama + '! 🌟';
    
    // Update status kategori
    updateStatusKategori();
}

function updateStatusKategori() {
    const usia = state.pemain.usia;
    
    // Tentukan kategori yang sesuai usia
    const kategoriAktif = [];
    if (usia <= 2) kategoriAktif.push(1);
    if (usia >= 2 && usia <= 3) kategoriAktif.push(2);
    if (usia >= 3 && usia <= 4) kategoriAktif.push(3);
    if (usia >= 4 && usia <= 5) kategoriAktif.push(4);
    if (usia >= 5 && usia <= 6) kategoriAktif.push(5);
    if (usia >= 6) kategoriAktif.push(6);
    
    // Tandai kategori yang direkomendasikan
    for (let i = 1; i <= 6; i++) {
        const el = document.getElementById('status' + i);
        if (kategoriAktif.includes(i)) {
            el.textContent = '⭐ Direkomendasikan';
        } else {
            el.textContent = '';
        }
    }
}

function logout() {
    if (confirm('Yakin mau keluar? Progress tetap tersimpan kok!')) {
        localStorage.removeItem('pemainAktif');
        state.pemain = null;
        state.progress = {};
        showScreen('login');
    }
}

// ============================================
// GENERATOR LEVEL
// ============================================
function buatLevel(n) {
    if (n <= 50) return levelSensorik(n);
    if (n <= 150) return levelBalita(n);
    if (n <= 300) return levelTK(n);
    if (n <= 500) return levelSD1(n);
    if (n <= 750) return levelSD2(n);
    return levelSD3(n);
}

function levelSensorik(n) {
    const hewan = DATA.hewan[n % DATA.hewan.length];
    return {
        tipe: 'tekan',
        tanya: 'Tekan ' + hewan.nama + '! 👆',
        display: hewan.gambar,
        opsi: [hewan],
        jawaban: 0
    };
}

function levelBalita(n) {
    const tipe = n % 3;
    
    if (tipe === 0) {
        const idx = n % DATA.hewan.length;
        const benar = DATA.hewan[idx];
        const semuaOpsi = [benar];
        for (let i = 1; i < 4; i++) {
            const r = DATA.hewan[(idx + i * 3) % DATA.hewan.length];
            if (!semuaOpsi.find(o => o.nama === r.nama)) semuaOpsi.push(r);
        }
        const opsiAcak = acak(semuaOpsi);
        return {
            tipe: 'pilih',
            tanya: 'Mana ' + benar.nama + '? ',
            display: benar.gambar,
            opsi: opsiAcak,
            jawaban: opsiAcak.findIndex(o => o.nama === benar.nama)
        };
    } else if (tipe === 1) {
        const idx = n % DATA.buah.length;
        const benar = DATA.buah[idx];
        const semuaOpsi = [benar];
        for (let i = 1; i < 4; i++) {
            const r = DATA.buah[(idx + i * 2) % DATA.buah.length];
            if (!semuaOpsi.find(o => o.nama === r.nama)) semuaOpsi.push(r);
        }
        const opsiAcak = acak(semuaOpsi);
        return {
            tipe: 'pilih',
            tanya: 'Mana ' + benar.nama + '? 🍎',
            display: benar.gambar,
            opsi: opsiAcak,
            jawaban: opsiAcak.findIndex(o => o.nama === benar.nama)
        };
    } else {
        const jumlah = (n % 5) + 1;
        const emoji = DATA.hewan[n % DATA.hewan.length].gambar;
        const tampilan = Array(jumlah).fill(emoji).join(' ');
        const opsi = [];
        for (let i = 1; i <= 4; i++) opsi.push({nama: i.toString(), gambar: i.toString()});
        const opsiAcak = acak(opsi);
        return {
            tipe: 'hitung',
            tanya: 'Ada berapa? 🔢',
            display: tampilan,
            opsi: opsiAcak,
            jawaban: opsiAcak.findIndex(o => parseInt(o.nama) === jumlah)
        };
    }
}

function levelTK(n) {
    const tipe = n % 3;
    
    if (tipe === 0) {
        const idx = n % DATA.warna.length;
        const benar = DATA.warna[idx];
        const semuaOpsi = [benar];
        for (let i = 1; i < 4; i++) {
            const r = DATA.warna[(idx + i * 2) % DATA.warna.length];
            if (!semuaOpsi.find(o => o.nama === r.nama)) semuaOpsi.push(r);
        }
        const opsiAcak = acak(semuaOpsi);
        return {
            tipe: 'warna',
            tanya: 'Mana warna ' + benar.nama + '? 🎨',
            display: '🎨',
            opsi: opsiAcak,
            jawaban: opsiAcak.findIndex(o => o.nama === benar.nama)
        };
    } else if (tipe === 1) {
        const angka = (n % 10) + 1;
        const benar = {nama: angka.toString(), gambar: angka.toString()};
        const semuaOpsi = [benar];
        for (let i = 1; i < 4; i++) {
            const r = ((n + i * 3) % 10) + 1;
            if (!semuaOpsi.find(o => o.nama === r.toString())) {
                semuaOpsi.push({nama: r.toString(), gambar: r.toString()});
            }
        }
        const opsiAcak = acak(semuaOpsi);
        return {
            tipe: 'angka',
            tanya: 'Mana angka ' + angka + '? 🔢',
            display: angka.toString(),
            opsi: opsiAcak,
            jawaban: opsiAcak.findIndex(o => o.nama === benar.nama)
        };
    } else {
        const jumlah = (n % 10) + 1;
        const emoji = DATA.buah[n % DATA.buah.length].gambar;
        const tampilan = Array(jumlah).fill(emoji).join(' ');
        const opsi = [];
        const angkaOpsi = [jumlah];
        for (let i = 1; i < 4; i++) {
            const r = ((n + i * 2) % 10) + 1;
            if (!angkaOpsi.includes(r)) angkaOpsi.push(r);
        }
        angkaOpsi.forEach(a => opsi.push({nama: a.toString(), gambar: a.toString()}));
        const opsiAcak = acak(opsi);
        return {
            tipe: 'hitung',
            tanya: 'Ada berapa? 🔢',
            display: tampilan,
            opsi: opsiAcak,
            jawaban: opsiAcak.findIndex(o => parseInt(o.nama) === jumlah)
        };
    }
}

function levelSD1(n) {
    const a = (n % 5) + 1;
    const b = ((n * 3) % 5) + 1;
    const hasil = a + b;
    const semuaOpsi = [{nama: hasil.toString(), gambar: hasil.toString()}];
    for (let i = 1; i < 4; i++) {
        const r = Math.max(1, hasil + (i % 2 === 0 ? i : -i));
        if (!semuaOpsi.find(o => o.nama === r.toString())) {
            semuaOpsi.push({nama: r.toString(), gambar: r.toString()});
        }
    }
    const opsiAcak = acak(semuaOpsi);
    return {
        tipe: 'matematika',
        tanya: a + ' + ' + b + ' = ? ➕',
        display: '🧮',
        opsi: opsiAcak,
        jawaban: opsiAcak.findIndex(o => parseInt(o.nama) === hasil)
    };
}

function levelSD2(n) {
    const a = (n % 10) + 1;
    const b = ((n * 2) % 10) + 1;
    const hasil = a + b;
    const semuaOpsi = [{nama: hasil.toString(), gambar: hasil.toString()}];
    for (let i = 1; i < 4; i++) {
        const r = Math.max(1, hasil + (i % 2 === 0 ? i * 2 : -i * 2));
        if (!semuaOpsi.find(o => o.nama === r.toString())) {
            semuaOpsi.push({nama: r.toString(), gambar: r.toString()});
        }
    }
    const opsiAcak = acak(semuaOpsi);
    return {
        tipe: 'matematika',
        tanya: a + ' + ' + b + ' = ? ➕',
        display: '🧮',
        opsi: opsiAcak,
        jawaban: opsiAcak.findIndex(o => parseInt(o.nama) === hasil)
    };
}

function levelSD3(n) {
    const a = (n % 20) + 5;
    const b = ((n * 3) % 15) + 5;
    const hasil = a + b;
    const semuaOpsi = [{nama: hasil.toString(), gambar: hasil.toString()}];
    for (let i = 1; i < 4; i++) {
        const r = Math.max(1, hasil + (i % 2 === 0 ? i * 3 : -i * 3));
        if (!semuaOpsi.find(o => o.nama === r.toString())) {
            semuaOpsi.push({nama: r.toString(), gambar: r.toString()});
        }
    }
    const opsiAcak = acak(semuaOpsi);
    return {
        tipe: 'matematika',
        tanya: a + ' + ' + b + ' = ? ➕',
        display: '🧮',
        opsi: opsiAcak,
        jawaban: opsiAcak.findIndex(o => parseInt(o.nama) === hasil)
    };
}

function acak(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// ============================================
// NAVIGASI
// ============================================
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function showMenu() {
    tampilkanMenu();
    showScreen('menu');
}

function showLevels() {
    renderLevels();
    showScreen('levels');
}

function startGame(mulai, akhir) {
    state.mulai = mulai;
    state.akhir = akhir;
    showLevels();
}

function renderLevels() {
    document.getElementById('levelTitle').textContent = 'Level ' + state.mulai + '-' + state.akhir;
    const grid = document.getElementById('levelGrid');
    grid.innerHTML = '';
    
    const totalLevel = state.akhir - state.mulai + 1;
    const selesaiCount = Object.keys(state.progress).filter(k => {
        const num = parseInt(k);
        return num >= state.mulai && num <= state.akhir && state.progress[k];
    }).length;
    
    const progressPercent = (selesaiCount / totalLevel) * 100;
    document.getElementById('progressFill').style.width = progressPercent + '%';
    
    for (let i = state.mulai; i <= state.akhir; i++) {
        const btn = document.createElement('button');
        btn.className = 'level-btn';
        
        const selesai = state.progress[i];
        if (selesai) {
            btn.classList.add('completed');
            btn.textContent = i + ' ';
        } else if (i === 1 || state.progress[i - 1]) {
            btn.textContent = i;
        } else {
            btn.classList.add('locked');
            btn.textContent = i;
        }
        
        if (i === 1 || state.progress[i - 1]) {
            btn.onclick = () => mainLevel(i);
        }
        
        grid.appendChild(btn);
    }
}

function mainLevel(n) {
    state.level = n;
    state.salah = 0;
    state.soal = buatLevel(n);
    
    document.getElementById('currentLevel').textContent = n;
    document.getElementById('questionText').textContent = state.soal.tanya;
    document.getElementById('questionDisplay').textContent = state.soal.display;
    document.getElementById('feedback').textContent = '';
    
    const opsiDiv = document.getElementById('options');
    opsiDiv.innerHTML = '';
    
    state.soal.opsi.forEach((opsi, idx) => {
        const btn = document.createElement('div');
        btn.className = 'option';
        
        if (state.soal.tipe === 'warna') {
            btn.style.background = opsi.kode;
            btn.style.height = '80px';
            btn.style.borderRadius = '50%';
        } else {
            btn.textContent = opsi.gambar;
        }
        
        btn.onclick = () => jawab(idx, btn);
        opsiDiv.appendChild(btn);
    });
    
    showScreen('game');
}

function jawab(idx, elemen) {
    const soal = state.soal;
    const benar = idx === soal.jawaban;
    
    if (benar) {
        elemen.classList.add('correct');
        document.getElementById('feedback').textContent = '🎉 Benar!';
        buatKonfeti();
        setTimeout(selesaiLevel, 1200);
    } else {
        elemen.classList.add('wrong');
        state.salah++;
        document.getElementById('feedback').textContent = '😅 Coba lagi!';
        setTimeout(() => {
            elemen.classList.remove('wrong');
            document.getElementById('feedback').textContent = '';
        }, 800);
    }
}

function selesaiLevel() {
    const bintang = state.salah === 0 ? 3 : state.salah === 1 ? 2 : 1;
    const sekarang = state.progress[state.level] || 0;
    if (bintang > sekarang) {
        state.progress[state.level] = bintang;
        localStorage.setItem('progress_' + state.pemain.nama, JSON.stringify(state.progress));
    }
    
    document.getElementById('stars').textContent = '⭐'.repeat(bintang) + '☆'.repeat(3 - bintang);
    
    const pesan = bintang === 3 ? 'Sempurna! Kamu Hebat! 🌟' : 
                  bintang === 2 ? 'Bagus Sekali! 👍' : 'Kerja Bagus! 💪';
    document.getElementById('doneText').textContent = pesan;
    
    buatKonfetiBanyak();
    showScreen('done');
}

function nextLevel() {
    if (state.level < 1000) {
        mainLevel(state.level + 1);
    } else {
        showLevels();
    }
}

function buatKonfeti() {
    const container = document.getElementById('confetti');
    const warna = ['#ff6b6b', '#ffd93d', '#6bcf7f', '#4d96ff', '#ff88cc'];
    
    for (let i = 0; i < 20; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.background = warna[Math.floor(Math.random() * warna.length)];
        piece.style.animationDelay = Math.random() * 0.5 + 's';
        container.appendChild(piece);
        setTimeout(() => piece.remove(), 3000);
    }
}

function buatKonfetiBanyak() {
    const container = document.getElementById('confetti');
    const warna = ['#ff6b6b', '#ffd93d', '#6bcf7f', '#4d96ff', '#ff88cc', '#aa44ff'];
    
    for (let i = 0; i < 50; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.background = warna[Math.floor(Math.random() * warna.length)];
        piece.style.animationDelay = Math.random() * 1 + 's';
        piece.style.animationDuration = (Math.random() * 2 + 2) + 's';
        container.appendChild(piece);
        setTimeout(() => piece.remove(), 4000);
    }
}

console.log(' Game dengan sistem login siap!');
