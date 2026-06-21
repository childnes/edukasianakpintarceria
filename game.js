// ============================================
// DATABASE KONTEN (SEMUA PAKAI EMOJI - RINGAN!)
// ============================================
const DB = {
    hewan: [
        { e: '🐄', n: 'Sapi', s: 'Mooo' },
        { e: '🐱', n: 'Kucing', s: 'Meong' },
        { e: '🐔', n: 'Ayam', s: 'Petok' },
        { e: '🦆', n: 'Bebek', s: 'Kwek' },
        { e: '🐶', n: 'Anjing', s: 'Guk guk' },
        { e: '🐑', n: 'Domba', s: 'Mbeee' },
        { e: '🐴', n: 'Kuda', s: 'Hihiiiin' },
        { e: '🐷', n: 'Babi', s: 'Oink' },
        { e: '🐭', n: 'Tikus', s: 'Cit cit' },
        { e: '🐘', n: 'Gajah', s: 'Pruuut' },
        { e: '🦁', n: 'Singa', s: 'Aum' },
        { e: '🐵', n: 'Monyet', s: 'Uuk uuk' },
        { e: '🐰', n: 'Kelinci', s: '...' },
        { e: '🐸', n: 'Katak', s: 'Koak koak' },
        { e: '🐢', n: 'Kura-kura', s: '...' },
        { e: '🦋', n: 'Kupu-kupu', s: '...' },
        { e: '🐝', n: 'Lebah', s: 'Bzzzz' },
        { e: '🐟', n: 'Ikan', s: 'Blub blub' },
        { e: '🦆', n: 'Bebek', s: 'Kwek' },
        { e: '🦉', n: 'Burung Hantu', s: 'Hoot hoot' }
    ],
    buah: [
        { e: '🍎', n: 'Apel' }, { e: '🍌', n: 'Pisang' },
        { e: '🍊', n: 'Jeruk' }, { e: '🍋', n: 'Lemon' },
        { e: '🍇', n: 'Anggur' }, { e: '🍓', n: 'Stroberi' },
        { e: '🍉', n: 'Semangka' }, { e: '🍑', n: 'Persik' },
        { e: '🍒', n: 'Ceri' }, { e: '🥭', n: 'Mangga' },
        { e: '🍍', n: 'Nanas' }, { e: '🥝', n: 'Kiwi' }
    ],
    warna: [
        { n: 'Merah', c: '#ff4444' }, { n: 'Biru', c: '#4488ff' },
        { n: 'Kuning', c: '#ffdd44' }, { n: 'Hijau', c: '#44cc44' },
        { n: 'Ungu', c: '#aa44ff' }, { n: 'Oranye', c: '#ff8844' },
        { n: 'Pink', c: '#ff88cc' }, { n: 'Coklat', c: '#884422' },
        { n: 'Hitam', c: '#222222' }, { n: 'Putih', c: '#ffffff' }
    ],
    bentuk: [
        { n: 'Lingkaran', e: '⚫' }, { n: 'Kotak', e: '🟦' },
        { n: 'Segitiga', e: '🔺' }, { n: 'Bintang', e: '⭐' },
        { n: 'Hati', e: '❤️' }, { n: 'Berlian', e: '🔷' }
    ],
    tubuh: [
        { e: '👁️', n: 'Mata' }, { e: '👃', n: 'Hidung' },
        { e: '👄', n: 'Mulut' }, { e: '👂', n: 'Telinga' },
        { e: '✋', n: 'Tangan' }, { e: '🦶', n: 'Kaki' }
    ],
    kendaraan: [
        { e: '🚗', n: 'Mobil' }, { e: '🚌', n: 'Bus' },
        { e: '🚲', n: 'Sepeda' }, { e: '✈️', n: 'Pesawat' },
        { e: '🚢', n: 'Kapal' }, { e: '🚂', n: 'Kereta' },
        { e: '🚁', n: 'Helikopter' }, { e: '🚒', n: 'Pemadam' }
    ]
};

// ============================================
// STATE GAME
// ============================================
let state = {
    levelAktif: 1,
    mulaiKategori: 1,
    akhirKategori: 50,
    progress: JSON.parse(localStorage.getItem('progress') || '{}'),
    salahCount: 0,
    soalAktif: null
};

// ============================================
// GENERATOR 1000 LEVEL OTOMATIS
// ============================================
function generateLevel(nomor) {
    // Seed random berdasarkan nomor level (supaya konsisten)
    const seed = nomor * 9301 + 49297;
    const rand = (max) => ((seed * 233280) % max);
    
    if (nomor <= 50) return genSensorik(nomor);
    if (nomor <= 150) return genToddler(nomor);
    if (nomor <= 300) return genPreschoolA(nomor);
    if (nomor <= 500) return genPreschoolB(nomor);
    if (nomor <= 750) return genSchoolA(nomor);
    return genSchoolB(nomor);
}

// USIA 1-2 TAHUN: Tap & Listen, Find Item
function genSensorik(n) {
    const tipe = n % 3;
    if (tipe === 0) {
        // Tap hewan untuk dengar suara
        const h = DB.hewan[n % DB.hewan.length];
        return {
            tipe: 'tap_sound',
            instruksi: `Tekan ${h.n}`,
            emoji: '👆',
            opsi: [h],
            jawaban: 0,
            suara: `Tekan gambar ${h.n}`
        };
    } else if (tipe === 1) {
        // Pilih hewan dari 3
        const idx = n % DB.hewan.length;
        const benar = DB.hewan[idx];
        const opsi = [benar];
        while (opsi.length < 3) {
            const r = DB.hewan[(idx + opsi.length * 3) % DB.hewan.length];
            if (!opsi.find(o => o.n === r.n)) opsi.push(r);
        }
        return {
            tipe: 'find_item',
            instruksi: `Mana ${benar.n}?`,
            emoji: benar.e,
            opsi: shuffle(opsi),
            jawaban: 0,
            suara: `Mana gambar ${benar.n}?`
        };
    } else {
        // Pilih buah dari 3
        const idx = n % DB.buah.length;
        const benar = DB.buah[idx];
        const opsi = [benar];
        while (opsi.length < 3) {
            const r = DB.buah[(idx + opsi.length * 2) % DB.buah.length];
            if (!opsi.find(o => o.n === r.n)) opsi.push(r);
        }
        return {
            tipe: 'find_item',
            instruksi: `Mana ${benar.n}?`,
            emoji: benar.e,
            opsi: shuffle(opsi),
            jawaban: 0,
            suara: `Mana gambar ${benar.n}?`
        };
    }
}

// USIA 2-3 TAHUN: Warna, Bentuk, Kendaraan, Hitung 1-3
function genToddler(n) {
    const tipe = n % 5;
    if (tipe === 0) {
        // Pilih warna
        const idx = n % DB.warna.length;
        const benar = DB.warna[idx];
        const opsi = [benar];
        while (opsi.length < 3) {
            const r = DB.warna[(idx + opsi.length * 2) % DB.warna.length];
            if (!opsi.find(o => o.n === r.n)) opsi.push(r);
        }
        return {
            tipe: 'find_color',
            instruksi: `Mana warna ${benar.n}?`,
            emoji: '🎨',
            opsi: shuffle(opsi),
            jawaban: 0,
            suara: `Mana warna ${benar.n}?`
        };
    } else if (tipe === 1) {
        // Pilih bentuk
        const idx = n % DB.bentuk.length;
        const benar = DB.bentuk[idx];
        const opsi = [benar];
        while (opsi.length < 3) {
            const r = DB.bentuk[(idx + opsi.length) % DB.bentuk.length];
            if (!opsi.find(o => o.n === r.n)) opsi.push(r);
        }
        return {
            tipe: 'find_shape',
            instruksi: `Mana bentuk ${benar.n}?`,
            emoji: benar.e,
            opsi: shuffle(opsi),
            jawaban: 0,
            suara: `Mana bentuk ${benar.n}?`
        };
    } else if (tipe === 2) {
        // Hitung 1-3
        const jumlah = (n % 3) + 1;
        const emoji = DB.hewan[n % DB.hewan.length].e;
        const tampilan = Array(jumlah).fill(emoji).join(' ');
        const opsi = [1, 2, 3].map(a => ({ n: a.toString(), e: a.toString() }));
        return {
            tipe: 'count',
            instruksi: `Ada berapa?`,
            emoji: '🔢',
            tampilan: tampilan,
            opsi: shuffle(opsi),
            jawaban: 0,
            jawabanNilai: jumlah,
            suara: `Hitung jumlahnya`
        };
    } else if (tipe === 3) {
        // Kendaraan
        const idx = n % DB.kendaraan.length;
        const benar = DB.kendaraan[idx];
        const opsi = [benar];
        while (opsi.length < 3) {
            const r = DB.kendaraan[(idx + opsi.length) % DB.kendaraan.length];
            if (!opsi.find(o => o.n === r.n)) opsi.push(r);
        }
        return {
            tipe: 'find_item',
            instruksi: `Mana ${benar.n}?`,
            emoji: benar.e,
            opsi: shuffle(opsi),
            jawaban: 0,
            suara: `Mana gambar ${benar.n}?`
        };
    } else {
        // Besar vs Kecil
        const besar = (n % 2) === 0;
        const h = DB.hewan[n % DB.hewan.length];
        return {
            tipe: 'big_small',
            instruksi: `Mana yang ${besar ? 'BESAR' : 'KECIL'}?`,
            emoji: besar ? '🐘' : '🐭',
            opsi: [
                { e: besar ? '🐘' : '🐜', n: besar ? 'Besar' : 'Kecil', size: besar ? 3 : 1.5 },
                { e: besar ? '🐜' : '🐘', n: besar ? 'Kecil' : 'Besar', size: besar ? 1.5 : 3 }
            ],
            jawaban: 0,
            suara: `Mana yang ${besar ? 'besar' : 'kecil'}?`
        };
    }
}

// USIA 3-4 TAHUN: Huruf, Angka 1-10, Hitung 1-10
function genPreschoolA(n) {
    const tipe = n % 4;
    if (tipe === 0) {
        // Pilih huruf A-Z
        const huruf = String.fromCharCode(65 + (n % 26));
        const opsi = [];
        opsi.push({ n: huruf, e: huruf });
        while (opsi.length < 4) {
            const r = String.fromCharCode(65 + ((n + opsi.length * 3) % 26));
            if (!opsi.find(o => o.n === r)) opsi.push({ n: r, e: r });
        }
        return {
            tipe: 'find_letter',
            instruksi: `Mana huruf ${huruf}?`,
            emoji: '🔤',
            opsi: shuffle(opsi),
            jawaban: 0,
            suara: `Mana huruf ${huruf}?`
        };
    } else if (tipe === 1) {
        // Pilih angka 1-10
        const angka = (n % 10) + 1;
        const opsi = [];
        opsi.push({ n: angka.toString(), e: angka.toString() });
        while (opsi.length < 4) {
            const r = ((n + opsi.length * 2) % 10) + 1;
            if (!opsi.find(o => o.n === r.toString())) opsi.push({ n: r.toString(), e: r.toString() });
        }
        return {
            tipe: 'find_number',
            instruksi: `Mana angka ${angka}?`,
            emoji: '🔢',
            opsi: shuffle(opsi),
            jawaban: 0,
            suara: `Mana angka ${angka}?`
        };
    } else if (tipe === 2) {
        // Hitung 1-10
        const jumlah = (n % 10) + 1;
        const emoji = DB.buah[n % DB.buah.length].e;
        const tampilan = Array(jumlah).fill(emoji).join(' ');
        const opsi = [];
        opsi.push({ n: jumlah.toString(), e: jumlah.toString() });
        while (opsi.length < 4) {
            const r = ((n + opsi.length) % 10) + 1;
            if (!opsi.find(o => o.n === r.toString())) opsi.push({ n: r.toString(), e: r.toString() });
        }
        return {
            tipe: 'count',
            instruksi: `Ada berapa?`,
            emoji: '🔢',
            tampilan: tampilan,
            opsi: shuffle(opsi),
            jawaban: 0,
            jawabanNilai: jumlah,
            suara: `Hitung jumlahnya`
        };
    } else {
        // Anggota tubuh
        const idx = n % DB.tubuh.length;
        const benar = DB.tubuh[idx];
        const opsi = [benar];
        while (opsi.length < 4) {
            const r = DB.tubuh[(idx + opsi.length) % DB.tubuh.length];
            if (!opsi.find(o => o.n === r.n)) opsi.push(r);
        }
        return {
            tipe: 'find_item',
            instruksi: `Mana ${benar.n}?`,
            emoji: benar.e,
            opsi: shuffle(opsi),
            jawaban: 0,
            suara: `Mana ${benar.n}?`
        };
    }
}

// USIA 4-5 TAHUN: Penjumlahan sederhana, Mencocokkan, Pola
function genPreschoolB(n) {
    const tipe = n % 4;
    if (tipe === 0 || tipe === 1) {
        // Penjumlahan 1-10
        const a = (n % 5) + 1;
        const b = ((n * 3) % 5) + 1;
        const hasil = a + b;
        const opsi = [];
        opsi.push({ n: hasil.toString(), e: hasil.toString() });
        while (opsi.length < 4) {
            const r = hasil + (opsi.length % 2 === 0 ? opsi.length : -opsi.length);
            const nilai = Math.max(1, r);
            if (!opsi.find(o => o.n === nilai.toString())) opsi.push({ n: nilai.toString(), e: nilai.toString() });
        }
        return {
            tipe: 'math',
            instruksi: `${a} + ${b} = ?`,
            emoji: '➕',
            opsi: shuffle(opsi),
            jawaban: 0,
            suara: `${a} tambah ${b} sama dengan berapa?`
        };
    } else if (tipe === 2) {
        // Bandingkan: mana yang lebih banyak?
        const a = (n % 5) + 1;
        const b = ((n * 2) % 5) + 1;
        const emoji = DB.buah[n % DB.buah.length].e;
        const benar = a > b ? 0 : 1;
        return {
            tipe: 'compare',
            instruksi: `Mana yang LEBIH BANYAK?`,
            emoji: '⚖️',
            opsi: [
                { e: Array(a).fill(emoji).join(' '), n: a },
                { e: Array(b).fill(emoji).join(' '), n: b }
            ],
            jawaban: benar,
            suara: `Mana yang lebih banyak?`
        };
    } else {
        // Pilih hewan berdasarkan kategori
        const kategori = n % 2 === 0 ? 'hewan' : 'buah';
        const list = DB[kategori];
        const idx = n % list.length;
        const benar = list[idx];
        const opsi = [benar];
        while (opsi.length < 4) {
            const r = list[(idx + opsi.length * 2) % list.length];
            if (!opsi.find(o => o.n === r.n)) opsi.push(r);
        }
        return {
            tipe: 'find_item',
            instruksi: `Mana ${benar.n}?`,
            emoji: benar.e,
            opsi: shuffle(opsi),
            jawaban: 0,
            suara: `Mana ${benar.n}?`
        };
    }
}

// USIA 5-6 TAHUN: Penjumlahan 1-20, Membaca kata, Pengurangan
function genSchoolA(n) {
    const tipe = n % 4;
    if (tipe === 0) {
        // Penjumlahan 1-20
        const a = (n % 10) + 1;
        const b = ((n * 2) % 10) + 1;
        const hasil = a + b;
        const opsi = [];
        opsi.push({ n: hasil.toString(), e: hasil.toString() });
        for (let i = 1; i < 4; i++) {
            const r = hasil + (i % 2 === 0 ? i : -i);
            const nilai = Math.max(1, r);
            if (!opsi.find(o => o.n === nilai.toString())) opsi.push({ n: nilai.toString(), e: nilai.toString() });
        }
        return {
            tipe: 'math',
            instruksi: `${a} + ${b} = ?`,
            emoji: '➕',
            opsi: shuffle(opsi),
            jawaban: 0,
            suara: `${a} tambah ${b} sama dengan berapa?`
        };
    } else if (tipe === 1) {
        // Pengurangan sederhana
        const a = (n % 10) + 5;
        const b = (n % 4) + 1;
        const hasil = a - b;
        const opsi = [];
        opsi.push({ n: hasil.toString(), e: hasil.toString() });
        for (let i = 1; i < 4; i++) {
            const r = hasil + (i % 2 === 0 ? i : -i);
            const nilai = Math.max(0, r);
            if (!opsi.find(o => o.n === nilai.toString())) opsi.push({ n: nilai.toString(), e: nilai.toString() });
        }
        return {
            tipe: 'math',
            instruksi: `${a} - ${b} = ?`,
            emoji: '➖',
            opsi: shuffle(opsi),
            jawaban: 0,
            suara: `${a} kurang ${b} sama dengan berapa?`
        };
    } else if (tipe === 2) {
        // Baca kata - cocokkan dengan gambar
        const kata = DB.hewan[n % DB.hewan.length];
        const opsi = [kata];
        while (opsi.length < 4) {
            const r = DB.hewan[(n + opsi.length * 3) % DB.hewan.length];
            if (!opsi.find(o => o.n === r.n)) opsi.push(r);
        }
        return {
            tipe: 'read_word',
            instruksi: `Baca: ${kata.n}`,
            emoji: '📖',
            opsi: shuffle(opsi),
            jawaban: 0,
            suara: `Baca kata ${kata.n}, lalu tekan gambarnya`
        };
    } else {
        // Hitung 1-15
        const jumlah = (n % 15) + 1;
        const emoji = DB.buah[n % DB.buah.length].e;
        const tampilan = Array(jumlah).fill(emoji).join(' ');
        const opsi = [];
        opsi.push({ n: jumlah.toString(), e: jumlah.toString() });
        for (let i = 1; i < 4; i++) {
            const r = jumlah + (i % 2 === 0 ? i : -i);
            const nilai = Math.max(1, r);
            if (!opsi.find(o => o.n === nilai.toString())) opsi.push({ n: nilai.toString(), e: nilai.toString() });
        }
        return {
            tipe: 'count',
            instruksi: `Ada berapa?`,
            emoji: '🔢',
            tampilan: tampilan,
            opsi: shuffle(opsi),
            jawaban: 0,
            jawabanNilai: jumlah,
            suara: `Hitung jumlahnya`
        };
    }
}

// USIA 6-7 TAHUN: Penjumlahan/Pengurangan 1-50, Kalimat, Logika
function genSchoolB(n) {
    const tipe = n % 4;
    if (tipe === 0) {
        // Penjumlahan 1-50
        const a = (n % 25) + 5;
        const b = ((n * 3) % 20) + 5;
        const hasil = a + b;
        const opsi = [];
        opsi.push({ n: hasil.toString(), e: hasil.toString() });
        for (let i = 1; i < 4; i++) {
            const r = hasil + (i % 2 === 0 ? i * 2 : -i * 2);
            const nilai = Math.max(1, r);
            if (!opsi.find(o => o.n === nilai.toString())) opsi.push({ n: nilai.toString(), e: nilai.toString() });
        }
        return {
            tipe: 'math',
            instruksi: `${a} + ${b} = ?`,
            emoji: '➕',
            opsi: shuffle(opsi),
            jawaban: 0,
            suara: `${a} tambah ${b} sama dengan berapa?`
        };
    } else if (tipe === 1) {
        // Pengurangan 1-50
        const a = (n % 30) + 20;
        const b = (n % 15) + 5;
        const hasil = a - b;
        const opsi = [];
        opsi.push({ n: hasil.toString(), e: hasil.toString() });
        for (let i = 1; i < 4; i++) {
            const r = hasil + (i % 2 === 0 ? i * 2 : -i * 2);
            const nilai = Math.max(0, r);
            if (!opsi.find(o => o.n === nilai.toString())) opsi.push({ n: nilai.toString(), e: nilai.toString() });
        }
        return {
            tipe: 'math',
            instruksi: `${a} - ${b} = ?`,
            emoji: '➖',
            opsi: shuffle(opsi),
            jawaban: 0,
            suara: `${a} kurang ${b} sama dengan berapa?`
        };
    } else if (tipe === 2) {
        // Baca kata buah
        const kata = DB.buah[n % DB.buah.length];
        const opsi = [kata];
        while (opsi.length < 4) {
            const r = DB.buah[(n + opsi.length * 2) % DB.buah.length];
            if (!opsi.find(o => o.n === r.n)) opsi.push(r);
        }
        return {
            tipe: 'read_word',
            instruksi: `Baca: ${kata.n}`,
            emoji: '📖',
            opsi: shuffle(opsi),
            jawaban: 0,
            suara: `Baca kata ${kata.n}, lalu tekan gambarnya`
        };
    } else {
        // Mana yang lebih besar?
        const a = (n % 50) + 10;
        const b = ((n * 7) % 50) + 10;
        const benar = a > b ? 0 : 1;
        return {
            tipe: 'compare_number',
            instruksi: `Mana yang LEBIH BESAR?`,
            emoji: '📊',
            opsi: [
                { n: a.toString(), e: a.toString() },
                { n: b.toString(), e: b.toString() }
            ],
            jawaban: benar,
            suara: `Mana angka yang lebih besar?`
        };
    }
}

// ============================================
// HELPER FUNCTIONS
// ============================================
function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function ucapkan(teks) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(teks);
        utter.lang = 'id-ID';
        utter.rate = 0.9;
        utter.pitch = 1.2;
        window.speechSynthesis.speak(utter);
    }
}

function simpanProgress(level, bintang) {
    const current = state.progress[level] || 0;
    if (bintang > current) {
        state.progress[level] = bintang;
        localStorage.setItem('progress', JSON.stringify(state.progress));
    }
}

function dapatBintang() {
    if (state.salahCount === 0) return 3;
    if (state.salahCount === 1) return 2;
    return 1;
}

function levelTerbuka(n) {
    if (n === 1) return true;
    return state.progress[n - 1] && state.progress[n - 1] > 0;
}

// ============================================
// NAVIGASI LAYAR
// ============================================
function pindahLayar(id) {
    document.querySelectorAll('.layar').forEach(l => l.classList.remove('aktif'));
    document.getElementById(id).classList.add('aktif');
}

function keMenu() {
    pindahLayar('layar-menu');
}

function keLevel() {
    tampilkanGridLevel();
    pindahLayar('layar-level');
}

// ============================================
// MENU KATEGORI
// ============================================
document.querySelectorAll('.btn-kat').forEach(btn => {
    btn.addEventListener('click', () => {
        state.mulaiKategori = parseInt(btn.dataset.mulai);
        state.akhirKategori = parseInt(btn.dataset.akhir);
        tampilkanGridLevel();
        pindahLayar('layar-level');
    });
});

function tampilkanGridLevel() {
    document.getElementById('judul-level').textContent = 
        `Level ${state.mulaiKategori}-${state.akhirKategori}`;
    const grid = document.getElementById('grid-level');
    grid.innerHTML = '';
    
    for (let i = state.mulaiKategori; i <= state.akhirKategori; i++) {
        const btn = document.createElement('button');
        btn.className = 'btn-level';
        const terbuka = levelTerbuka(i);
        if (!terbuka) btn.classList.add('terkunci');
        
        const bintang = state.progress[i] || 0;
        const bintangStr = '⭐'.repeat(bintang) + '☆'.repeat(3 - bintang);
        
        btn.innerHTML = `
            <div>${i}</div>
            <div class="bintang-level">${bintangStr}</div>
        `;
        
        if (terbuka) {
            btn.addEventListener('click', () => mulaiLevel(i));
        }
        
        grid.appendChild(btn);
    }
}

// ============================================
// MAIN GAME
// ============================================
function mulaiLevel(nomor) {
    state.levelAktif = nomor;
    state.salahCount = 0;
    state.soalAktif = generateLevel(nomor);
    
    document.getElementById('no-level').textContent = nomor;
    renderSoal();
    pindahLayar('layar-main');
    
    setTimeout(() => ulangInstruksi(), 500);
}

function renderSoal() {
    const soal = state.soalAktif;
    document.getElementById('instruksi-emoji').textContent = soal.emoji;
    document.getElementById('instruksi-teks').textContent = soal.instruksi;
    
    const area = document.getElementById('area-soal');
    area.innerHTML = '';
    
    // Tampilan khusus untuk hitung
    if (soal.tampilan) {
        const divTampilan = document.createElement('div');
        divTampilan.style.cssText = 'grid-column: 1/-1; background: white; padding: 20px; border-radius: 20px; font-size: 2em; text-align: center; box-shadow: 0 4px 10px rgba(0,0,0,0.1); margin-bottom: 10px;';
        divTampilan.textContent = soal.tampilan;
        area.appendChild(divTampilan);
    }
    
    // Tentukan grid class
    const jmlOpsi = soal.opsi.length;
    area.className = 'area-soal';
    if (jmlOpsi === 2) area.classList.add('grid-2');
    else if (jmlOpsi === 3) area.classList.add('grid-3');
    else if (jmlOpsi === 4) area.classList.add('grid-4');
    
    // Cari jawaban yang benar setelah di-shuffle
    const jawabanBenar = soal.opsi.findIndex(o => {
        if (soal.jawabanNilai !== undefined) {
            return parseInt(o.n) === soal.jawabanNilai;
        }
        return o.n === soal.opsi.find((x, i) => {
            const idxAsli = state.soalAktif.opsi.indexOf(x);
            return idxAsli === -1;
        })?.n;
    });
    
    // Render opsi
    soal.opsi.forEach((opsi, idx) => {
        const div = document.createElement('button');
        div.className = 'opsi';
        
        if (soal.tipe === 'find_color') {
            const warna = document.createElement('div');
            warna.className = 'opsi-warna';
            warna.style.background = opsi.c;
            div.appendChild(warna);
        } else if (soal.tipe === 'compare') {
            div.innerHTML = `<div style="font-size: 0.7em; line-height: 1.2;">${opsi.e}</div>`;
        } else {
            div.innerHTML = `<div class="opsi-teks">${opsi.e}</div>`;
        }
        
        div.addEventListener('click', () => jawab(idx, div));
        area.appendChild(div);
    });
}

function ulangInstruksi() {
    ucapkan(state.soalAktif.suara);
}

function jawab(idx, elemen) {
    const soal = state.soalAktif;
    
    // Cek jawaban benar
    let benar = false;
    if (soal.jawabanNilai !== undefined) {
        benar = parseInt(soal.opsi[idx].n) === soal.jawabanNilai;
    } else {
        // Cari opsi yang sama dengan jawaban asli
        const opsiDipilih = soal.opsi[idx];
        const jawabanAsliIdx = state.soalAktif.opsi.findIndex(o => {
            // Bandingkan berdasarkan properti unik
            return o.n === opsiDipilih.n && o.e === opsiDipilih.e;
        });
        // Jawaban benar adalah opsi pertama yang di-generate (sebelum shuffle)
        // Kita cek dengan nama
        const namaJawabanBenar = generateLevel(state.levelAktif).opsi[generateLevel(state.levelAktif).jawaban].n;
        benar = opsiDipilih.n === namaJawabanBenar;
    }
    
    const feedback = document.getElementById('feedback');
    
    if (benar) {
        elemen.classList.add('benar');
        feedback.textContent = '✅';
        feedback.classList.add('tampil');
        ucapkan('Hebat! Benar!');
        
        setTimeout(() => {
            feedback.classList.remove('tampil');
            selesaiLevel();
        }, 1200);
    } else {
        elemen.classList.add('salah');
        state.salahCount++;
        feedback.textContent = '❌';
        feedback.classList.add('tampil');
        ucapkan('Coba lagi ya!');
        
        setTimeout(() => {
            feedback.classList.remove('tampil');
            elemen.classList.remove('salah');
        }, 800);
    }
}

function selesaiLevel() {
    const bintang = dapatBintang();
    simpanProgress(state.levelAktif, bintang);
    
    document.getElementById('hasil-bintang').textContent = '⭐'.repeat(bintang) + '☆'.repeat(3 - bintang);
    
    const pesan = bintang === 3 ? 'Sempurna! Luar biasa!' : 
                  bintang === 2 ? 'Bagus sekali!' : 'Kerja bagus!';
    document.getElementById('hasil-teks').textContent = pesan;
    
    tampilkanKonfeti();
    pindahLayar('layar-selesai');
}

function ulangiLevel() {
    mulaiLevel(state.levelAktif);
}

function lanjutLevel() {
    if (state.levelAktif < 1000) {
        mulaiLevel(state.levelAktif + 1);
    } else {
        keLevel();
    }
}

function tampilkanKonfeti() {
    const container = document.getElementById('konfeti');
    container.innerHTML = '';
    const warna = ['#ff6b6b', '#ffd93d', '#6bcf7f', '#4d96ff', '#ff88cc'];
    
    for (let i = 0; i < 50; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.background = warna[Math.floor(Math.random() * warna.length)];
        piece.style.animationDelay = Math.random() * 0.5 + 's';
        piece.style.animationDuration = (Math.random() * 2 + 2) + 's';
        container.appendChild(piece);
    }
    
    setTimeout(() => container.innerHTML = '', 4000);
}

// ============================================
// INIT
// ============================================
console.log('🎮 Pintar Ceria loaded! 1000 level siap dimainkan.');
console.log('Contoh Level 1:', generateLevel(1));
console.log('Contoh Level 500:', generateLevel(500));
console.log('Contoh Level 1000:', generateLevel(1000));