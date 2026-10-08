/**
 * SiHadir - Sistem Absensi & Presensi Murid Sekolah Modern
 * Complete Client-Side Application Core Logic
 */

// ==========================================
// 1. STATE & STORAGE MANAGEMENT
// ==========================================
const STORAGE_KEY = 'sihadir_db_v2';

let db = {
  settings: {
    schoolName: 'SMA Negeri 1 Harapan Bangsa',
    npsn: '20109988',
    academicYear: '2026/2027',
    semester: 'Ganjil',
    address: 'Jl. Pendidikan No. 45, Jakarta',
    kepsek: 'Dra. Hj. Nurul Hidayah, M.Pd',
    nipKepsek: '19740512 199803 2 004',
    timeIn: '07:00',
    timeLate: '07:15',
    city: 'Jakarta'
  },
  classes: [
    { id: 'c1', name: 'X MIPA 1', wali: 'Budi Santoso, S.Pd', nipWali: '19850214 201001 1 012' },
    { id: 'c2', name: 'X MIPA 2', wali: 'Siti Rahmawati, M.Pd', nipWali: '19890622 201402 2 008' },
    { id: 'c3', name: 'XI IPS 1', wali: 'Agus Setiawan, S.Pd', nipWali: '19821105 200801 1 015' }
  ],
  students: [],
  // Attendance records format: key = `${date}_${nisn}` => { date, nisn, status: 'H'|'S'|'I'|'A', note: '', time: '06:55', mode: 'manual'|'qr' }
  attendance: {}
};

// Initial Seed Data Generator
function generateInitialDemoData() {
  const students = [
    // X MIPA 1
    { id: 's1', nisn: '0081010001', name: 'Ahmad Fauzi Rahman', class: 'X MIPA 1', gender: 'L', phone: '081234567801' },
    { id: 's2', nisn: '0081010002', name: 'Aisyah Putri Maharani', class: 'X MIPA 1', gender: 'P', phone: '081234567802' },
    { id: 's3', nisn: '0081010003', name: 'Bima Satria Wicaksono', class: 'X MIPA 1', gender: 'L', phone: '081234567803' },
    { id: 's4', nisn: '0081010004', name: 'Cantika Dewi Lestari', class: 'X MIPA 1', gender: 'P', phone: '081234567804' },
    { id: 's5', nisn: '0081010005', name: 'Daffa Rizky Pratama', class: 'X MIPA 1', gender: 'L', phone: '081234567805' },
    { id: 's6', nisn: '0081010006', name: 'Elsa Nabila Sari', class: 'X MIPA 1', gender: 'P', phone: '081234567806' },
    { id: 's7', nisn: '0081010007', name: 'Farhan Aditya Nugraha', class: 'X MIPA 1', gender: 'L', phone: '081234567807' },
    { id: 's8', nisn: '0081010008', name: 'Gita Clarissa Paramita', class: 'X MIPA 1', gender: 'P', phone: '081234567808' },
    { id: 's9', nisn: '0081010009', name: 'Hafiz Maulana Syarif', class: 'X MIPA 1', gender: 'L', phone: '081234567809' },
    { id: 's10', nisn: '0081010010', name: 'Intan Permata Hati', class: 'X MIPA 1', gender: 'P', phone: '081234567810' },

    // X MIPA 2
    { id: 's11', nisn: '0081020011', name: 'Kevin Jonathan Arifin', class: 'X MIPA 2', gender: 'L', phone: '081234567811' },
    { id: 's12', nisn: '0081020012', name: 'Laila Zahra Nuraini', class: 'X MIPA 2', gender: 'P', phone: '081234567812' },
    { id: 's13', nisn: '0081020013', name: 'Muhammad Alif Syahputra', class: 'X MIPA 2', gender: 'L', phone: '081234567813' },
    { id: 's14', nisn: '0081020014', name: 'Nadya Amanda Rahmadi', class: 'X MIPA 2', gender: 'P', phone: '081234567814' },
    { id: 's15', nisn: '0081020015', name: 'Oki Kurniawan Saputra', class: 'X MIPA 2', gender: 'L', phone: '081234567815' },
    { id: 's16', nisn: '0081020016', name: 'Putri Ayu Wandira', class: 'X MIPA 2', gender: 'P', phone: '081234567816' },
    { id: 's17', nisn: '0081020017', name: 'Raditya Arya Mahendra', class: 'X MIPA 2', gender: 'L', phone: '081234567817' },
    { id: 's18', nisn: '0081020018', name: 'Salma Salsabila Ramadhani', class: 'X MIPA 2', gender: 'P', phone: '081234567818' },

    // XI IPS 1
    { id: 's19', nisn: '0071030019', name: 'Taufik Hidayat Siregar', class: 'XI IPS 1', gender: 'L', phone: '081234567819' },
    { id: 's20', nisn: '0071030020', name: 'Ulfah Safitri Anggraini', class: 'XI IPS 1', gender: 'P', phone: '081234567820' },
    { id: 's21', nisn: '0071030021', name: 'Vito Alexander Tanuwidjaja', class: 'XI IPS 1', gender: 'L', phone: '081234567821' },
    { id: 's22', nisn: '0071030022', name: 'Winda Octavia', class: 'XI IPS 1', gender: 'P', phone: '081234567822' },
    { id: 's23', nisn: '0071030023', name: 'Yoga Prasetya Utama', class: 'XI IPS 1', gender: 'L', phone: '081234567823' },
    { id: 's24', nisn: '0071030024', name: 'Zahra Amelia Firdaus', class: 'XI IPS 1', gender: 'P', phone: '081234567824' }
  ];

  const attendance = {};
  const todayStr = getTodayDateString();
  const pastDays = [
    getOffsetDateString(-3),
    getOffsetDateString(-2),
    getOffsetDateString(-1),
    todayStr
  ];

  // Populate sample attendance
  pastDays.forEach(date => {
    students.forEach((s, idx) => {
      let status = 'H';
      let note = '';
      let time = '06:' + String(45 + (idx % 15)).padStart(2, '0');

      if (date === todayStr) {
        // Today has realistic variation
        if (idx === 2) { status = 'S'; note = 'Demam flu'; time = '07:10'; }
        else if (idx === 5) { status = 'I'; note = 'Urusan keluarga'; time = '07:05'; }
        else if (idx === 8) { status = 'A'; note = 'Tanpa keterangan'; time = '-'; }
        else if (idx === 14) { status = 'S'; note = 'Sakit gigi'; time = '07:20'; }
        else if (idx === 20) { status = 'I'; note = 'Lomba catur'; time = '06:50'; }
      } else {
        // Past days mostly Hadir
        if ((idx + date.length) % 11 === 0) { status = 'S'; note = 'Sakit'; }
        else if ((idx + date.length) % 17 === 0) { status = 'I'; note = 'Izin'; }
        else { status = 'H'; }
      }

      const key = `${date}_${s.nisn}`;
      attendance[key] = {
        date,
        nisn: s.nisn,
        status,
        note,
        time,
        mode: idx % 2 === 0 ? 'qr' : 'manual'
      };
    });
  });

  return { students, attendance };
}

function loadDatabase() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.students && parsed.classes) {
        db = parsed;
        return;
      }
    }
  } catch (err) {
    console.warn('Gagal memuat database dari localStorage:', err);
  }

  // Fallback initialize seed data
  const seed = generateInitialDemoData();
  db.students = seed.students;
  db.attendance = seed.attendance;
  saveDatabase();
}

function saveDatabase() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (err) {
    console.error('Gagal menyimpan ke localStorage:', err);
    showToast('Penyimpanan lokal penuh atau tidak diizinkan!', 'danger');
  }
}

// ==========================================
// 2. HELPER UTILITIES
// ==========================================
function getTodayDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getOffsetDateString(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatIndoDate(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const day = parseInt(parts[2], 10);
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const month = months[parseInt(parts[1], 10) - 1] || '';
  const year = parts[0];
  return `${day} ${month} ${year}`;
}

function getDayNameIndo(dateStr) {
  const d = new Date(dateStr);
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  return days[d.getDay()] || '';
}

function getCurrentTimeString() {
  const d = new Date();
  return [
    String(d.getHours()).padStart(2, '0'),
    String(d.getMinutes()).padStart(2, '0'),
    String(d.getSeconds()).padStart(2, '0')
  ].join(':');
}

// Web Audio API Beep Synthesizer
let audioCtx = null;
function playAudioBeep(type = 'success') {
  const toggle = document.getElementById('scanner-sound-toggle');
  if (toggle && !toggle.checked) return;

  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'success') {
      // Pleasant high double chime
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.15);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'warning') {
      // Notice chime
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else {
      // Error low buzz
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    }
  } catch (e) {
    console.log('Audio feedback not available', e);
  }
}

// Toast Notifications
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const colors = {
    success: 'bg-emerald-600 text-white border-emerald-500',
    warning: 'bg-amber-600 text-white border-amber-500',
    danger: 'bg-rose-600 text-white border-rose-500',
    info: 'bg-indigo-600 text-white border-indigo-500'
  };
  const icons = {
    success: '✅',
    warning: '⚠️',
    danger: '❌',
    info: 'ℹ️'
  };

  toast.className = `flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg border ${colors[type] || colors.info} transform transition-all duration-300 translate-y-2 opacity-0 pointer-events-auto`;
  toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span> <span>${message}</span>`;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('translate-y-2', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ==========================================
// 3. NAVIGATION & APP LIFECYCLE
// ==========================================
let currentTab = 'dashboard';

const TAB_TITLES = {
  dashboard: { title: 'Dashboard Presensi', icon: '📊' },
  absensi: { title: 'Absensi Harian Kelas', icon: '📝' },
  scanner: { title: 'Scan QR Code Murid', icon: '📷' },
  kartu: { title: 'Cetak Kartu Pelajar Siswa', icon: '🪪' },
  murid: { title: 'Data Murid & Kelas', icon: '👥' },
  laporan: { title: 'Rekapitulasi & Laporan Presensi', icon: '📈' },
  pengaturan: { title: 'Pengaturan Sekolah & Database', icon: '⚙️' }
};

function switchTab(tabName) {
  currentTab = tabName;

  // Update Tab Buttons di Sidebar
  document.querySelectorAll('.tab-btn').forEach(btn => {
    const isTarget = btn.getAttribute('data-tab') === tabName;
    if (isTarget) {
      btn.className = 'tab-btn flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 shadow-md shadow-indigo-600/30 transition-all text-left';
    } else {
      btn.className = 'tab-btn flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all text-left';
    }
  });

  // Update Topbar Header Title & Icon
  const meta = TAB_TITLES[tabName] || { title: 'Presensi Murid', icon: '🎓' };
  const titleEl = document.getElementById('topbar-page-title');
  const iconEl = document.getElementById('topbar-page-icon');
  if (titleEl) titleEl.textContent = meta.title;
  if (iconEl) iconEl.textContent = meta.icon;

  // Tutup sidebar di HP saat tab diklik
  closeMobileSidebar();

  // Update Tab Contents
  document.querySelectorAll('.tab-content').forEach(section => {
    section.classList.add('hidden');
  });

  const activeSection = document.getElementById(`tab-${tabName}`);
  if (activeSection) {
    activeSection.classList.remove('hidden');
  }

  // Stop camera if navigating away from scanner
  if (tabName !== 'scanner') {
    stopScannerCamera();
  }

  // Refresh tab views
  if (tabName === 'dashboard') renderDashboard();
  if (tabName === 'absensi') loadClassAttendance();
  if (tabName === 'kartu') renderStudentCards();
  if (tabName === 'murid') renderStudentTable();
  if (tabName === 'laporan') renderMonthlyReport();
  if (tabName === 'pengaturan') loadSettingsForm();
}

function openMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  if (sidebar) sidebar.classList.remove('-translate-x-full');
  if (backdrop) backdrop.classList.remove('hidden');
}

function closeMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  if (sidebar) sidebar.classList.add('-translate-x-full');
  if (backdrop) backdrop.classList.add('hidden');
}

function updateLiveClock() {
  const timeEl = document.getElementById('live-time');
  const dateEl = document.getElementById('live-date');
  if (timeEl) {
    timeEl.textContent = getCurrentTimeString() + ' WIB';
  }
  if (dateEl) {
    const todayStr = getTodayDateString();
    dateEl.textContent = `${getDayNameIndo(todayStr)}, ${formatIndoDate(todayStr)}`;
  }
}

// ==========================================
// 4. TAB: DASHBOARD
// ==========================================
function populateDashboardFilters() {
  const classFilter = document.getElementById('dash-class-filter');
  if (!classFilter) return;

  const currentVal = classFilter.value || 'ALL';
  classFilter.innerHTML = '<option value="ALL">Semua Kelas</option>';
  db.classes.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.name;
    opt.textContent = c.name;
    classFilter.appendChild(opt);
  });
  classFilter.value = currentVal;

  const datePicker = document.getElementById('dash-date-picker');
  if (datePicker && !datePicker.value) {
    datePicker.value = getTodayDateString();
  }
}

function renderDashboard() {
  const datePicker = document.getElementById('dash-date-picker');
  const classFilter = document.getElementById('dash-class-filter');
  const selectedDate = (datePicker && datePicker.value) || getTodayDateString();
  const selectedClass = (classFilter && classFilter.value) || 'ALL';

  // Filter students
  const filteredStudents = selectedClass === 'ALL'
    ? db.students
    : db.students.filter(s => s.class === selectedClass);

  let total = filteredStudents.length;
  let hadir = 0, sakit = 0, izin = 0, alpha = 0, belum = 0;
  const recentLogs = [];

  filteredStudents.forEach(s => {
    const key = `${selectedDate}_${s.nisn}`;
    const record = db.attendance[key];
    if (record) {
      if (record.status === 'H') hadir++;
      else if (record.status === 'S') sakit++;
      else if (record.status === 'I') izin++;
      else if (record.status === 'A') alpha++;

      recentLogs.push({
        student: s,
        status: record.status,
        time: record.time || '07:00',
        note: record.note,
        mode: record.mode || 'manual'
      });
    } else {
      belum++;
    }
  });

  // Sort recent logs by time descending
  recentLogs.sort((a, b) => (b.time || '').localeCompare(a.time || ''));

  // Update KPI counters
  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-hadir').textContent = hadir;
  document.getElementById('stat-sakit').textContent = sakit;
  document.getElementById('stat-izin').textContent = izin;
  document.getElementById('stat-alpha').textContent = alpha;
  document.getElementById('stat-belum').textContent = belum;

  const pct = (val) => total > 0 ? Math.round((val / total) * 100) : 0;
  document.getElementById('stat-hadir-pct').textContent = `${pct(hadir)}% dari siswa`;
  document.getElementById('stat-sakit-pct').textContent = `${pct(sakit)}% dari siswa`;
  document.getElementById('stat-izin-pct').textContent = `${pct(izin)}% dari siswa`;
  document.getElementById('stat-alpha-pct').textContent = `${pct(alpha)}% dari siswa`;
  document.getElementById('stat-belum-pct').textContent = `${pct(belum)}% belum absen`;

  // Update Summary Progress Bar
  const hadirPct = pct(hadir);
  document.getElementById('bar-hadir').style.width = `${hadirPct}%`;
  document.getElementById('bar-sakit').style.width = `${pct(sakit)}%`;
  document.getElementById('bar-izin').style.width = `${pct(izin)}%`;
  document.getElementById('bar-alpha').style.width = `${pct(alpha)}%`;
  document.getElementById('stat-summary-badge').textContent = `${hadirPct}% Hadir`;

  // Render Class Breakdown Bars
  const breakdownContainer = document.getElementById('dash-class-breakdown');
  if (breakdownContainer) {
    breakdownContainer.innerHTML = '';
    db.classes.forEach(c => {
      const classStudents = db.students.filter(s => s.class === c.name);
      const cTotal = classStudents.length;
      let cHadir = 0;
      classStudents.forEach(s => {
        const key = `${selectedDate}_${s.nisn}`;
        if (db.attendance[key] && db.attendance[key].status === 'H') cHadir++;
      });
      const cPct = cTotal > 0 ? Math.round((cHadir / cTotal) * 100) : 0;

      const item = document.createElement('div');
      item.className = 'text-xs';
      item.innerHTML = `
        <div class="flex justify-between font-semibold text-slate-700 mb-1">
          <span>${c.name}</span>
          <span class="text-indigo-600">${cHadir}/${cTotal} (${cPct}%)</span>
        </div>
        <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div class="h-full bg-indigo-600 rounded-full transition-all duration-300" style="width: ${cPct}%"></div>
        </div>
      `;
      breakdownContainer.appendChild(item);
    });
  }

  // Render Recent Activity Stream
  const recentTable = document.getElementById('dash-recent-table');
  if (recentTable) {
    recentTable.innerHTML = '';
    if (recentLogs.length === 0) {
      recentTable.innerHTML = `<tr><td colspan="5" class="py-4 text-center text-slate-400">Belum ada aktivitas presensi pada tanggal ini.</td></tr>`;
    } else {
      recentLogs.slice(0, 10).forEach(log => {
        const tr = document.createElement('tr');
        const badgeClass = {
          H: 'badge-hadir',
          S: 'badge-sakit',
          I: 'badge-izin',
          A: 'badge-alpha'
        }[log.status] || 'badge-belum';

        const label = {
          H: 'Hadir',
          S: 'Sakit',
          I: 'Izin',
          A: 'Alpha'
        }[log.status] || 'Belum';

        tr.innerHTML = `
          <td class="py-2.5 px-3 font-mono text-slate-500">${log.time || '-'}</td>
          <td class="py-2.5 px-3 font-semibold text-slate-800">${log.student.name}</td>
          <td class="py-2.5 px-3 text-slate-600">${log.student.class}</td>
          <td class="py-2.5 px-3"><span class="badge-status ${badgeClass}">${label}</span></td>
          <td class="py-2.5 px-3 text-slate-500">${log.mode === 'qr' ? '📷 Scan QR' : '✍️ Manual'}</td>
        `;
        recentTable.appendChild(tr);
      });
    }
  }
}

// ==========================================
// 5. TAB: ABSENSI HARIAN (CHECKLIST)
// ==========================================
function populateAttendanceFilters() {
  const classSelect = document.getElementById('abs-class-select');
  if (!classSelect) return;

  const currentVal = classSelect.value || (db.classes[0] && db.classes[0].name);
  classSelect.innerHTML = '';
  db.classes.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.name;
    opt.textContent = c.name;
    classSelect.appendChild(opt);
  });
  if (currentVal) classSelect.value = currentVal;

  const datePicker = document.getElementById('abs-date-picker');
  if (datePicker && !datePicker.value) {
    datePicker.value = getTodayDateString();
  }
}

function loadClassAttendance() {
  populateAttendanceFilters();

  const classSelect = document.getElementById('abs-class-select');
  const datePicker = document.getElementById('abs-date-picker');
  if (!classSelect || !datePicker) return;

  const selectedClass = classSelect.value;
  const selectedDate = datePicker.value || getTodayDateString();

  // Update Class Title & Wali
  const classObj = db.classes.find(c => c.name === selectedClass);
  document.getElementById('abs-class-title').textContent = `Kelas: ${selectedClass}`;
  document.getElementById('abs-wali-kelas').textContent = classObj ? `(Wali Kelas: ${classObj.wali})` : '';

  const students = db.students.filter(s => s.class === selectedClass);
  const tbody = document.getElementById('attendance-table-body');
  tbody.innerHTML = '';

  let countH = 0, countS = 0, countI = 0, countA = 0;

  if (students.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="py-6 text-center text-slate-400">Belum ada murid di kelas ini. Buka tab "Data Murid & Kelas" untuk menambah murid.</td></tr>`;
  } else {
    students.forEach((s, idx) => {
      const key = `${selectedDate}_${s.nisn}`;
      const record = db.attendance[key] || {
        status: '',
        note: '',
        time: getCurrentTimeString()
      };

      if (record.status === 'H') countH++;
      else if (record.status === 'S') countS++;
      else if (record.status === 'I') countI++;
      else if (record.status === 'A') countA++;

      const tr = document.createElement('tr');
      tr.className = 'hover:bg-slate-50/70 transition student-row';
      tr.setAttribute('data-search', `${s.name.toLowerCase()} ${s.nisn.toLowerCase()}`);

      tr.innerHTML = `
        <td class="py-3 px-3 text-center text-slate-400 font-mono">${idx + 1}</td>
        <td class="py-3 px-3 font-mono font-medium text-slate-600">${s.nisn}</td>
        <td class="py-3 px-4 font-bold text-slate-800">
          <div class="flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold">
              ${s.name.charAt(0)}
            </span>
            <span>${s.name}</span>
          </div>
        </td>
        <td class="py-3 px-2 text-center font-semibold ${s.gender === 'L' ? 'text-blue-600' : 'text-pink-600'}">${s.gender}</td>
        <td class="py-3 px-4 text-center">
          <div class="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1 gap-1">
            <button type="button" onclick="setStudentStatus('${s.nisn}', 'H', this)" class="status-btn px-2.5 py-1 text-xs font-bold rounded-md transition ${record.status === 'H' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-white'}">H</button>
            <button type="button" onclick="setStudentStatus('${s.nisn}', 'S', this)" class="status-btn px-2.5 py-1 text-xs font-bold rounded-md transition ${record.status === 'S' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:bg-white'}">S</button>
            <button type="button" onclick="setStudentStatus('${s.nisn}', 'I', this)" class="status-btn px-2.5 py-1 text-xs font-bold rounded-md transition ${record.status === 'I' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-white'}">I</button>
            <button type="button" onclick="setStudentStatus('${s.nisn}', 'A', this)" class="status-btn px-2.5 py-1 text-xs font-bold rounded-md transition ${record.status === 'A' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:bg-white'}">A</button>
          </div>
        </td>
        <td class="py-3 px-3">
          <input type="text" value="${record.note || ''}" placeholder="Keterangan..." onchange="updateStudentNote('${s.nisn}', this.value)" class="w-full text-xs border border-slate-200 rounded px-2 py-1 focus:ring-1 focus:ring-indigo-500 focus:outline-none">
        </td>
        <td class="py-3 px-3 text-center">
          <input type="text" value="${record.time || ''}" placeholder="--:--" onchange="updateStudentTime('${s.nisn}', this.value)" class="w-16 text-center text-xs font-mono border border-slate-200 rounded px-1 py-1 focus:ring-1 focus:ring-indigo-500 focus:outline-none">
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Update counts
  document.getElementById('abs-count-h').textContent = countH;
  document.getElementById('abs-count-s').textContent = countS;
  document.getElementById('abs-count-i').textContent = countI;
  document.getElementById('abs-count-a').textContent = countA;
}

function setStudentStatus(nisn, status, clickedBtn) {
  const datePicker = document.getElementById('abs-date-picker');
  const selectedDate = datePicker.value || getTodayDateString();
  const key = `${selectedDate}_${nisn}`;

  if (!db.attendance[key]) {
    db.attendance[key] = {
      date: selectedDate,
      nisn,
      status: '',
      note: '',
      time: getCurrentTimeString(),
      mode: 'manual'
    };
  }

  db.attendance[key].status = status;
  if (!db.attendance[key].time || db.attendance[key].time === '-') {
    db.attendance[key].time = getCurrentTimeString();
  }

  saveDatabase();
  loadClassAttendance();
  playAudioBeep('warning');
}

function updateStudentNote(nisn, note) {
  const datePicker = document.getElementById('abs-date-picker');
  const selectedDate = datePicker.value || getTodayDateString();
  const key = `${selectedDate}_${nisn}`;

  if (!db.attendance[key]) {
    db.attendance[key] = {
      date: selectedDate,
      nisn,
      status: 'H',
      note: '',
      time: getCurrentTimeString(),
      mode: 'manual'
    };
  }
  db.attendance[key].note = note;
  saveDatabase();
}

function updateStudentTime(nisn, time) {
  const datePicker = document.getElementById('abs-date-picker');
  const selectedDate = datePicker.value || getTodayDateString();
  const key = `${selectedDate}_${nisn}`;

  if (!db.attendance[key]) {
    db.attendance[key] = {
      date: selectedDate,
      nisn,
      status: 'H',
      note: '',
      time,
      mode: 'manual'
    };
  } else {
    db.attendance[key].time = time;
  }
  saveDatabase();
}

function setAllPresent() {
  const classSelect = document.getElementById('abs-class-select');
  const datePicker = document.getElementById('abs-date-picker');
  const selectedClass = classSelect.value;
  const selectedDate = datePicker.value || getTodayDateString();

  const students = db.students.filter(s => s.class === selectedClass);
  students.forEach(s => {
    const key = `${selectedDate}_${s.nisn}`;
    if (!db.attendance[key] || !db.attendance[key].status) {
      db.attendance[key] = {
        date: selectedDate,
        nisn: s.nisn,
        status: 'H',
        note: '',
        time: getCurrentTimeString(),
        mode: 'manual'
      };
    } else {
      db.attendance[key].status = 'H';
      if (!db.attendance[key].time || db.attendance[key].time === '-') {
        db.attendance[key].time = getCurrentTimeString();
      }
    }
  });

  saveDatabase();
  loadClassAttendance();
  playAudioBeep('success');
  showToast(`Semua siswa di ${selectedClass} berhasil diset Hadir!`, 'success');
}

function filterAttendanceTable() {
  const q = document.getElementById('abs-search-input').value.toLowerCase().trim();
  document.querySelectorAll('#attendance-table-body .student-row').forEach(row => {
    const searchData = row.getAttribute('data-search') || '';
    if (searchData.includes(q)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

function saveAttendanceManualNotification() {
  saveDatabase();
  playAudioBeep('success');
  showToast('Presensi kelas berhasil disimpan dengan aman!', 'success');
}

// ==========================================
// 6. TAB: SCAN QR CODE
// ==========================================
let html5QrScanner = null;
let isScannerRunning = false;
let sessionScanHistory = [];
let lastScannedPayload = null;
let lastScannedTimestamp = 0;

function initCameraDeviceList() {
  const select = document.getElementById('camera-device-select');
  if (!select || !window.Html5Qrcode) return;

  Html5Qrcode.getCameras().then(devices => {
    select.innerHTML = '';
    if (devices && devices.length) {
      devices.forEach((cam, idx) => {
        const opt = document.createElement('option');
        opt.value = cam.id;
        opt.textContent = cam.label || `Kamera ${idx + 1}`;
        select.appendChild(opt);
      });
    } else {
      select.innerHTML = '<option value="">Tidak ada kamera terdeteksi</option>';
    }
  }).catch(err => {
    select.innerHTML = '<option value="">Izin kamera diperlukan</option>';
  });
}

function startScannerCamera() {
  if (isScannerRunning) return;
  const select = document.getElementById('camera-device-select');
  const cameraId = select && select.value;

  if (!window.Html5Qrcode) {
    showToast('Library pemindai QR belum termuat sempurna.', 'danger');
    return;
  }

  html5QrScanner = new Html5Qrcode('qr-reader');
  const config = {
    fps: 10,
    qrbox: { width: 250, height: 250 },
    aspectRatio: 1.0
  };

  const cameraConstraint = cameraId ? { deviceId: { exact: cameraId } } : { facingMode: 'environment' };

  html5QrScanner.start(
    cameraConstraint,
    config,
    (decodedText) => onScanSuccess(decodedText),
    (errorMessage) => {
      // scanning error ignored for smooth performance
    }
  ).then(() => {
    isScannerRunning = true;
    document.getElementById('camera-placeholder').classList.add('hidden');
    document.getElementById('scan-laser-line').classList.remove('hidden');
    document.getElementById('btn-start-camera').disabled = true;
    document.getElementById('btn-stop-camera').disabled = false;
    showToast('Kamera aktif! Arahkan ke QR Code siswa.', 'info');
  }).catch(err => {
    console.error('Error starting camera', err);
    showToast('Gagal mengakses kamera. Pastikan izin kamera aktif atau gunakan localhost.', 'danger');
  });
}

function stopScannerCamera() {
  if (!isScannerRunning || !html5QrScanner) return;
  html5QrScanner.stop().then(() => {
    isScannerRunning = false;
    document.getElementById('camera-placeholder').classList.remove('hidden');
    document.getElementById('scan-laser-line').classList.add('hidden');
    document.getElementById('btn-start-camera').disabled = false;
    document.getElementById('btn-stop-camera').disabled = true;
  }).catch(err => {
    console.error('Error stopping camera', err);
  });
}

function scanFromImageFile(e) {
  const file = e.target.files[0];
  if (!file) return;

  const html5Qr = new Html5Qrcode('qr-reader');
  html5Qr.scanFile(file, true)
    .then(decodedText => {
      onScanSuccess(decodedText);
      e.target.value = '';
    })
    .catch(err => {
      playAudioBeep('error');
      showToast('QR Code tidak terbaca pada gambar tersebut!', 'danger');
      e.target.value = '';
    });
}

function onScanSuccess(payload) {
  const now = Date.now();
  // Prevent duplicate scan burst (3 seconds cooldown)
  if (lastScannedPayload === payload && now - lastScannedTimestamp < 3000) {
    return;
  }
  lastScannedPayload = payload;
  lastScannedTimestamp = now;

  // Parse QR payload (support either plain NISN or JSON token)
  let nisn = payload.trim();
  try {
    const parsed = JSON.parse(payload);
    if (parsed.nisn) nisn = parsed.nisn;
  } catch (e) {
    // raw string
  }

  // Find student in DB
  const student = db.students.find(s => s.nisn === nisn);
  if (!student) {
    playAudioBeep('error');
    showToast(`Siswa dengan NISN "${nisn}" tidak terdaftar!`, 'danger');
    renderScanResultCard(null, nisn, false);
    return;
  }

  // Get active mode
  const modeRadio = document.querySelector('input[name="scanMode"]:checked');
  const scanMode = modeRadio ? modeRadio.value : 'masuk';

  const todayStr = getTodayDateString();
  const key = `${todayStr}_${student.nisn}`;
  const currentTime = getCurrentTimeString();

  // Check late rule
  const isLate = checkIsLate(currentTime, db.settings.timeLate || '07:15');
  let noteText = isLate ? `Terlambat (${currentTime})` : 'Tepat Waktu';

  if (scanMode === 'pulang') {
    noteText = `Pulang (${currentTime})`;
  }

  // Record attendance
  db.attendance[key] = {
    date: todayStr,
    nisn: student.nisn,
    status: 'H',
    note: noteText,
    time: currentTime,
    mode: 'qr'
  };

  saveDatabase();
  playAudioBeep('success');

  // Add to session feed
  sessionScanHistory.unshift({
    student,
    time: currentTime,
    status: 'H',
    note: noteText,
    isLate
  });

  renderScanResultCard(student, currentTime, true, isLate);
  renderScanHistoryFeed();
}

function checkIsLate(currentTimeStr, lateLimitStr) {
  try {
    const [ch, cm] = currentTimeStr.split(':').map(Number);
    const [lh, lm] = lateLimitStr.split(':').map(Number);
    return ch * 60 + cm > lh * 60 + lm;
  } catch (e) {
    return false;
  }
}

function renderScanResultCard(student, info, isSuccess, isLate) {
  const cardBody = document.getElementById('scan-result-body');
  if (!cardBody) return;

  if (!isSuccess) {
    cardBody.innerHTML = `
      <div class="py-4 text-center text-rose-600 animate-fade-in">
        <span class="text-4xl block mb-2">❌</span>
        <h4 class="font-bold text-sm">QR Code Tidak Dikenali</h4>
        <p class="text-xs text-slate-500 mt-1">NISN: ${info}</p>
      </div>
    `;
    return;
  }

  cardBody.innerHTML = `
    <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center animate-fade-in space-y-2">
      <div class="w-14 h-14 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center text-xl font-bold shadow-md">
        ${student.name.charAt(0)}
      </div>
      <div>
        <h4 class="font-extrabold text-sm text-slate-900">${student.name}</h4>
        <p class="text-xs text-slate-600 font-medium">NISN: ${student.nisn} &bull; ${student.class}</p>
      </div>
      <div class="flex items-center justify-center gap-2 pt-1">
        <span class="badge-status badge-hadir">✅ HADIR</span>
        <span class="text-xs font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
          🕒 ${info} WIB
        </span>
      </div>
      <p class="text-[11px] font-bold ${isLate ? 'text-amber-700' : 'text-emerald-700'}">
        ${isLate ? '⚠️ Melewati batas jam masuk (Terlambat)' : '✨ Tepat Waktu'}
      </p>
    </div>
  `;
}

function renderScanHistoryFeed() {
  const feed = document.getElementById('scan-history-feed');
  const countBadge = document.getElementById('scan-count-badge');
  if (!feed) return;

  countBadge.textContent = `${sessionScanHistory.length} Siswa`;
  feed.innerHTML = '';

  if (sessionScanHistory.length === 0) {
    feed.innerHTML = '<p class="text-xs text-slate-400 text-center py-4">Belum ada scan pada sesi ini.</p>';
    return;
  }

  sessionScanHistory.forEach(item => {
    const div = document.createElement('div');
    div.className = 'flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs hover:bg-slate-100 transition';
    div.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold">
          ${item.student.name.charAt(0)}
        </span>
        <div>
          <p class="font-bold text-slate-800">${item.student.name}</p>
          <p class="text-[10px] text-slate-500">${item.student.class} &bull; ${item.student.nisn}</p>
        </div>
      </div>
      <div class="text-right">
        <span class="font-mono font-bold text-slate-700">${item.time}</span>
        <p class="text-[10px] ${item.isLate ? 'text-amber-600 font-bold' : 'text-emerald-600'}">${item.note}</p>
      </div>
    `;
    feed.appendChild(div);
  });
}

// ==========================================
// 7. TAB: CETAK KARTU SISWA (ID CARD)
// ==========================================
function populateCardFilters() {
  const classSelect = document.getElementById('card-class-select');
  if (!classSelect) return;

  const currentVal = classSelect.value || 'ALL';
  classSelect.innerHTML = '<option value="ALL">Semua Kelas</option>';
  db.classes.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.name;
    opt.textContent = c.name;
    classSelect.appendChild(opt);
  });
  classSelect.value = currentVal;
  updateCardStudentDropdown();
}

function updateCardStudentDropdown() {
  const classSelect = document.getElementById('card-class-select');
  const studentSelect = document.getElementById('card-student-select');
  if (!classSelect || !studentSelect) return;

  const selectedClass = classSelect.value;
  const students = selectedClass === 'ALL'
    ? db.students
    : db.students.filter(s => s.class === selectedClass);

  studentSelect.innerHTML = '<option value="ALL">Semua Siswa di Pilihan Ini</option>';
  students.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.nisn;
    opt.textContent = `${s.name} (${s.nisn})`;
    studentSelect.appendChild(opt);
  });
}

function renderStudentCards() {
  populateCardFilters();
  const classSelect = document.getElementById('card-class-select');
  const studentSelect = document.getElementById('card-student-select');
  const container = document.getElementById('cards-container');
  if (!container) return;

  const selectedClass = classSelect ? classSelect.value : 'ALL';
  const selectedNisn = studentSelect ? studentSelect.value : 'ALL';

  let list = db.students;
  if (selectedClass !== 'ALL') {
    list = list.filter(s => s.class === selectedClass);
  }
  if (selectedNisn !== 'ALL') {
    list = list.filter(s => s.nisn === selectedNisn);
  }

  container.innerHTML = '';
  if (list.length === 0) {
    container.innerHTML = '<p class="text-xs text-slate-400 py-8 col-span-3 text-center">Tidak ada siswa yang cocok dengan filter.</p>';
    return;
  }

  list.forEach(student => {
    const cardEl = document.createElement('div');
    cardEl.className = 'id-card-preview';

    const qrWrapperId = `qr-target-${student.nisn}`;

    cardEl.innerHTML = `
      <!-- Header ID Card -->
      <div class="id-card-header">
        <div class="text-xl">🎓</div>
        <div class="overflow-hidden">
          <h5 class="text-[10px] font-extrabold uppercase tracking-tight truncate leading-tight">${db.settings.schoolName || 'KARTU PELAJAR'}</h5>
          <p class="text-[8px] text-indigo-200 uppercase tracking-widest font-semibold">KARTU PELAJAR &bull; TA ${db.settings.academicYear || '2026/2027'}</p>
        </div>
      </div>

      <!-- Body ID Card -->
      <div class="id-card-body">
        <div class="w-14 h-18 bg-white/20 rounded-md border border-white/40 flex flex-col items-center justify-center text-white shadow-sm flex-shrink-0">
          <span class="text-2xl">${student.gender === 'L' ? '👨‍🎓' : '👩‍🎓'}</span>
          <span class="text-[8px] font-bold mt-0.5">${student.gender === 'L' ? 'L' : 'P'}</span>
        </div>
        <div class="flex-1 overflow-hidden">
          <p class="text-[11px] font-extrabold text-white truncate leading-tight">${student.name}</p>
          <div class="mt-1 space-y-0.5 text-[9px] text-indigo-100">
            <p><span class="text-indigo-300">NISN:</span> <strong class="text-white">${student.nisn}</strong></p>
            <p><span class="text-indigo-300">Kelas:</span> <strong class="text-white">${student.class}</strong></p>
            <p><span class="text-indigo-300">NPSN:</span> ${db.settings.npsn || '-'}</p>
          </div>
        </div>
        <!-- QR Code Container -->
        <div class="id-card-qr" id="${qrWrapperId}"></div>
      </div>

      <!-- Footer Bar -->
      <div class="text-[7px] text-indigo-200 text-center border-t border-white/10 pt-1 mt-1 flex justify-between">
        <span>Gunakan saat presensi</span>
        <span>Valid: Siswa Aktif</span>
      </div>
    `;

    container.appendChild(cardEl);

    // Generate QR Code via QRCode.js
    setTimeout(() => {
      const qrTarget = document.getElementById(qrWrapperId);
      if (qrTarget && window.QRCode) {
        qrTarget.innerHTML = '';
        new QRCode(qrTarget, {
          text: student.nisn,
          width: 58,
          height: 58,
          colorDark: '#0f172a',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.M
        });
      }
    }, 10);
  });
}

// ==========================================
// 8. TAB: DATA MURID & KELAS (CRUD & IMPORT)
// ==========================================
function populateMuridClassFilter() {
  const filter = document.getElementById('murid-class-filter');
  if (!filter) return;

  const currentVal = filter.value || 'ALL';
  filter.innerHTML = '<option value="ALL">Semua Kelas</option>';
  db.classes.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.name;
    opt.textContent = c.name;
    filter.appendChild(opt);
  });
  filter.value = currentVal;
}

function renderStudentTable() {
  populateMuridClassFilter();

  const filterSelect = document.getElementById('murid-class-filter');
  const searchInput = document.getElementById('murid-search-input');
  const tbody = document.getElementById('student-table-body');
  const countInfo = document.getElementById('murid-count-info');
  if (!tbody) return;

  const selectedClass = filterSelect ? filterSelect.value : 'ALL';
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

  let list = db.students;
  if (selectedClass !== 'ALL') {
    list = list.filter(s => s.class === selectedClass);
  }
  if (query) {
    list = list.filter(s => s.name.toLowerCase().includes(query) || s.nisn.includes(query));
  }

  tbody.innerHTML = '';
  if (countInfo) {
    countInfo.textContent = `Menampilkan ${list.length} dari ${db.students.length} siswa`;
  }

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="py-6 text-center text-slate-400">Tidak ada data murid yang ditemukan.</td></tr>`;
    return;
  }

  list.forEach((s, idx) => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 transition';
    tr.innerHTML = `
      <td class="py-3 px-3 text-center text-slate-400 font-mono">${idx + 1}</td>
      <td class="py-3 px-4 font-mono font-bold text-slate-700">${s.nisn}</td>
      <td class="py-3 px-4 font-bold text-slate-900">
        <div class="flex items-center gap-2">
          <span class="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold">
            ${s.name.charAt(0)}
          </span>
          <span>${s.name}</span>
        </div>
      </td>
      <td class="py-3 px-3"><span class="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold text-[11px]">${s.class}</span></td>
      <td class="py-3 px-2 text-center font-bold ${s.gender === 'L' ? 'text-blue-600' : 'text-pink-600'}">${s.gender}</td>
      <td class="py-3 px-4 text-slate-600 font-mono">${s.phone || '-'}</td>
      <td class="py-3 px-3 text-center">
        <button onclick="previewStudentCardModal('${s.nisn}')" class="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded font-semibold text-[10px] border border-indigo-200">
          🔍 Lihat QR
        </button>
      </td>
      <td class="py-3 px-4 text-center">
        <div class="flex items-center justify-center gap-1.5">
          <button onclick="openModalStudent('edit', '${s.id}')" class="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded" title="Edit">
            ✏️
          </button>
          <button onclick="deleteStudent('${s.id}')" class="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded" title="Hapus">
            🗑️
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function previewStudentCardModal(nisn) {
  switchTab('kartu');
  const studentSelect = document.getElementById('card-student-select');
  if (studentSelect) {
    studentSelect.value = nisn;
    renderStudentCards();
  }
}

// Student Form Modal
function openModalStudent(mode = 'add', studentId = null) {
  const modal = document.getElementById('modal-student');
  const title = document.getElementById('modal-student-title');
  const classSelect = document.getElementById('m-student-class');
  const form = document.getElementById('form-student');

  // Populate class dropdown
  classSelect.innerHTML = '';
  db.classes.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.name;
    opt.textContent = c.name;
    classSelect.appendChild(opt);
  });

  form.reset();
  document.getElementById('student-edit-id').value = '';

  if (mode === 'edit' && studentId) {
    title.textContent = 'Edit Data Siswa';
    const s = db.students.find(st => st.id === studentId);
    if (s) {
      document.getElementById('student-edit-id').value = s.id;
      document.getElementById('m-student-nisn').value = s.nisn;
      document.getElementById('m-student-name').value = s.name;
      document.getElementById('m-student-class').value = s.class;
      document.getElementById('m-student-gender').value = s.gender;
      document.getElementById('m-student-phone').value = s.phone || '';
    }
  } else {
    title.textContent = 'Tambah Siswa Baru';
  }

  modal.classList.remove('hidden');
}

function closeModalStudent() {
  document.getElementById('modal-student').classList.add('hidden');
}

function handleSaveStudent(e) {
  e.preventDefault();
  const id = document.getElementById('student-edit-id').value;
  const nisn = document.getElementById('m-student-nisn').value.trim();
  const name = document.getElementById('m-student-name').value.trim();
  const className = document.getElementById('m-student-class').value;
  const gender = document.getElementById('m-student-gender').value;
  const phone = document.getElementById('m-student-phone').value.trim();

  // Validate duplicate NISN
  const existing = db.students.find(s => s.nisn === nisn && s.id !== id);
  if (existing) {
    showToast(`NISN "${nisn}" sudah digunakan oleh siswa ${existing.name}!`, 'danger');
    return;
  }

  if (id) {
    // Edit
    const idx = db.students.findIndex(s => s.id === id);
    if (idx !== -1) {
      db.students[idx] = { ...db.students[idx], nisn, name, class: className, gender, phone };
      showToast('Data siswa berhasil diperbarui!', 'success');
    }
  } else {
    // Add
    const newStudent = {
      id: 's_' + Date.now(),
      nisn,
      name,
      class: className,
      gender,
      phone
    };
    db.students.push(newStudent);
    showToast('Siswa baru berhasil ditambahkan!', 'success');
  }

  saveDatabase();
  closeModalStudent();
  renderStudentTable();
}

function deleteStudent(id) {
  const student = db.students.find(s => s.id === id);
  if (!student) return;

  if (confirm(`Yakin ingin menghapus siswa ${student.name} (${student.nisn})?`)) {
    db.students = db.students.filter(s => s.id !== id);
    saveDatabase();
    renderStudentTable();
    showToast('Siswa berhasil dihapus.', 'info');
  }
}

// Class Management Modal
function openModalClass() {
  const modal = document.getElementById('modal-class');
  renderClassListTable();
  modal.classList.remove('hidden');
}

function closeModalClass() {
  document.getElementById('modal-class').classList.add('hidden');
  populateAttendanceFilters();
  populateDashboardFilters();
  populateMuridClassFilter();
  renderStudentTable();
}

function renderClassListTable() {
  const tbody = document.getElementById('class-list-table-body');
  if (!tbody) return;

  tbody.innerHTML = '';
  db.classes.forEach(c => {
    const studentCount = db.students.filter(s => s.class === c.name).length;
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 transition';
    tr.innerHTML = `
      <td class="p-2.5 font-bold text-slate-800">
        ${c.name}
        <span class="text-[10px] text-slate-400 font-normal">(${studentCount} siswa)</span>
      </td>
      <td class="p-2.5 text-slate-600">${c.wali}</td>
      <td class="p-2.5 text-center">
        <button onclick="deleteClass('${c.id}')" class="text-rose-600 hover:text-rose-800 p-1 font-bold" title="Hapus">
          🗑️
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function handleAddClass(e) {
  e.preventDefault();
  const name = document.getElementById('m-class-name').value.trim();
  const wali = document.getElementById('m-class-wali').value.trim();

  if (db.classes.some(c => c.name.toLowerCase() === name.toLowerCase())) {
    showToast(`Kelas "${name}" sudah ada!`, 'danger');
    return;
  }

  db.classes.push({
    id: 'c_' + Date.now(),
    name,
    wali,
    nipWali: '-'
  });

  saveDatabase();
  document.getElementById('form-add-class').reset();
  renderClassListTable();
  showToast(`Kelas "${name}" berhasil ditambahkan!`, 'success');
}

function deleteClass(id) {
  const c = db.classes.find(cl => cl.id === id);
  if (!c) return;

  const hasStudents = db.students.some(s => s.class === c.name);
  if (hasStudents) {
    alert(`Tidak dapat menghapus kelas "${c.name}" karena masih ada siswa di kelas ini!`);
    return;
  }

  if (confirm(`Hapus kelas "${c.name}"?`)) {
    db.classes = db.classes.filter(cl => cl.id !== id);
    saveDatabase();
    renderClassListTable();
    showToast('Kelas dihapus.', 'info');
  }
}

// Excel Import / Export for Students
function openModalImportExcel() {
  document.getElementById('modal-import').classList.remove('hidden');
}

function closeModalImportExcel() {
  document.getElementById('modal-import').classList.add('hidden');
}

function downloadSampleExcelTemplate() {
  if (!window.XLSX) {
    showToast('SheetJS belum termuat', 'danger');
    return;
  }

  const sampleData = [
    { NISN: '0081030099', Nama: 'Budi Kurniawan', Kelas: 'X MIPA 1', JK: 'L', Telepon: '081234567899' },
    { NISN: '0081030100', Nama: 'Citra Kirana', Kelas: 'X MIPA 1', JK: 'P', Telepon: '081234567800' }
  ];

  const ws = XLSX.utils.json_to_sheet(sampleData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Template_Siswa');
  XLSX.writeFile(wb, 'Template_Import_Siswa_SiHadir.xlsx');
  showToast('Template Excel berhasil diunduh!', 'success');
}

function processImportExcelFile() {
  const fileInput = document.getElementById('excel-file-input');
  const file = fileInput.files[0];
  if (!file) {
    showToast('Pilih file Excel terlebih dahulu!', 'warning');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.SheetNames[0];
      const rows = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet]);

      let importedCount = 0;
      rows.forEach(r => {
        const nisn = String(r.NISN || r.nisn || '').trim();
        const name = String(r.Nama || r.nama || r.Name || '').trim();
        const className = String(r.Kelas || r.kelas || 'X MIPA 1').trim();
        const gender = String(r.JK || r.jk || r.Gender || 'L').toUpperCase().trim();
        const phone = String(r.Telepon || r.telepon || r.HP || '').trim();

        if (nisn && name) {
          // auto-create class if not existing
          if (!db.classes.some(c => c.name === className)) {
            db.classes.push({ id: 'c_' + Date.now() + Math.random(), name: className, wali: 'Wali Kelas ' + className, nipWali: '-' });
          }

          const existingIdx = db.students.findIndex(s => s.nisn === nisn);
          if (existingIdx !== -1) {
            db.students[existingIdx] = { ...db.students[existingIdx], name, class: className, gender, phone };
          } else {
            db.students.push({
              id: 's_' + Date.now() + Math.random(),
              nisn,
              name,
              class: className,
              gender: gender === 'P' ? 'P' : 'L',
              phone
            });
          }
          importedCount++;
        }
      });

      saveDatabase();
      closeModalImportExcel();
      renderStudentTable();
      showToast(`Berhasil mengimpor ${importedCount} siswa!`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Gagal memproses file Excel. Pastikan format sesuai!', 'danger');
    }
  };
  reader.readAsArrayBuffer(file);
}

function exportStudentsExcel() {
  if (!window.XLSX) return;
  const data = db.students.map((s, idx) => ({
    No: idx + 1,
    NISN: s.nisn,
    'Nama Siswa': s.name,
    Kelas: s.class,
    'Jenis Kelamin': s.gender,
    'No HP Wali': s.phone || '-'
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Daftar_Siswa');
  XLSX.writeFile(wb, `Data_Siswa_${db.settings.schoolName.replace(/\s+/g, '_')}.xlsx`);
  showToast('Data siswa berhasil diekspor ke Excel!', 'success');
}

// ==========================================
// 9. TAB: REKAPITULASI & LAPORAN BULANAN
// ==========================================
function populateReportFilters() {
  const classSelect = document.getElementById('lap-class-select');
  if (!classSelect) return;

  const currentVal = classSelect.value || (db.classes[0] && db.classes[0].name);
  classSelect.innerHTML = '';
  db.classes.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.name;
    opt.textContent = c.name;
    classSelect.appendChild(opt);
  });
  if (currentVal) classSelect.value = currentVal;

  const monthSelect = document.getElementById('lap-month-select');
  if (monthSelect && !monthSelect.value) {
    monthSelect.value = String(new Date().getMonth() + 1);
  }
}

function renderMonthlyReport() {
  populateReportFilters();

  const monthSelect = document.getElementById('lap-month-select');
  const yearSelect = document.getElementById('lap-year-select');
  const classSelect = document.getElementById('lap-class-select');
  if (!monthSelect || !yearSelect || !classSelect) return;

  const month = parseInt(monthSelect.value, 10);
  const year = parseInt(yearSelect.value, 10);
  const selectedClass = classSelect.value;

  const daysInMonth = new Date(year, month, 0).getDate();
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const monthName = months[month - 1];

  // Update Kop & Metadata
  document.getElementById('kop-school-name').textContent = db.settings.schoolName || 'SEKOLAH';
  document.getElementById('kop-school-sub').textContent = `${db.settings.address || ''} • NPSN: ${db.settings.npsn || '-'}`;
  document.getElementById('lap-meta-class').textContent = `Kelas: ${selectedClass}`;
  document.getElementById('lap-meta-period').textContent = `Periode: ${monthName} ${year}`;

  const classObj = db.classes.find(c => c.name === selectedClass);
  const waliName = classObj ? classObj.wali : '-';
  const waliNip = classObj ? classObj.nipWali : '-';
  document.getElementById('lap-meta-wali').textContent = `Wali Kelas: ${waliName}`;

  // Signatures
  document.getElementById('kop-kepsek-name').textContent = db.settings.kepsek || 'Kepala Sekolah';
  document.getElementById('kop-kepsek-nip').textContent = db.settings.nipKepsek ? `NIP. ${db.settings.nipKepsek}` : '';
  document.getElementById('lap-wali-signature-name').textContent = waliName;
  document.getElementById('lap-wali-signature-nip').textContent = waliNip !== '-' ? `NIP. ${waliNip}` : '';
  document.getElementById('kop-city-date').textContent = `${db.settings.city || 'Jakarta'}, ${daysInMonth} ${monthName} ${year}`;
  document.getElementById('lap-print-timestamp').textContent = formatIndoDate(getTodayDateString());

  // Render Table Head (Tanggal 1 to N)
  const thead = document.getElementById('lap-matrix-head');
  let headHtml = `
    <tr>
      <th class="py-2 px-1 border border-slate-400 w-8" rowspan="2">No</th>
      <th class="py-2 px-2 border border-slate-400 w-24" rowspan="2">NISN</th>
      <th class="py-2 px-3 border border-slate-400 text-left min-w-[140px]" rowspan="2">Nama Siswa</th>
      <th class="py-2 px-1 border border-slate-400 w-8" rowspan="2">L/P</th>
      <th class="py-1 px-1 border border-slate-400" colspan="${daysInMonth}">Tanggal (${monthName})</th>
      <th class="py-1 px-1 border border-slate-400 bg-emerald-100" colspan="4">Total Rekap</th>
      <th class="py-2 px-1 border border-slate-400 w-12" rowspan="2">% Hadir</th>
    </tr>
    <tr>
  `;

  for (let d = 1; d <= daysInMonth; d++) {
    const curDate = new Date(year, month - 1, d);
    const dayOfWeek = curDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    headHtml += `<th class="py-1 px-0.5 border border-slate-400 w-5 ${isWeekend ? 'bg-slate-200 text-slate-500' : ''}">${d}</th>`;
  }

  headHtml += `
      <th class="py-1 px-1 border border-slate-400 bg-emerald-50 text-emerald-800 w-7">H</th>
      <th class="py-1 px-1 border border-slate-400 bg-amber-50 text-amber-800 w-7">S</th>
      <th class="py-1 px-1 border border-slate-400 bg-blue-50 text-blue-800 w-7">I</th>
      <th class="py-1 px-1 border border-slate-400 bg-rose-50 text-rose-800 w-7">A</th>
    </tr>
  `;
  thead.innerHTML = headHtml;

  // Render Table Body
  const tbody = document.getElementById('lap-matrix-body');
  const students = db.students.filter(s => s.class === selectedClass);
  tbody.innerHTML = '';

  if (students.length === 0) {
    tbody.innerHTML = `<tr><td colspan="${daysInMonth + 9}" class="py-6 text-center text-slate-400">Belum ada murid di kelas ini.</td></tr>`;
    return;
  }

  students.forEach((s, idx) => {
    let h = 0, sc = 0, i = 0, a = 0;
    let daysCells = '';

    for (let d = 1; d <= daysInMonth; d++) {
      const curDate = new Date(year, month - 1, d);
      const isWeekend = curDate.getDay() === 0 || curDate.getDay() === 6;
      const dateKeyStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const rec = db.attendance[`${dateKeyStr}_${s.nisn}`];

      let cellText = '-';
      let cellColor = '';

      if (isWeekend) {
        cellText = '';
        cellColor = 'bg-slate-100 text-slate-300';
      } else if (rec && rec.status) {
        cellText = rec.status;
        if (rec.status === 'H') { h++; cellColor = 'text-emerald-700 font-bold'; }
        else if (rec.status === 'S') { sc++; cellColor = 'text-amber-700 font-bold bg-amber-50'; }
        else if (rec.status === 'I') { i++; cellColor = 'text-blue-700 font-bold bg-blue-50'; }
        else if (rec.status === 'A') { a++; cellColor = 'text-rose-700 font-bold bg-rose-50'; }
      }

      daysCells += `<td class="border border-slate-400 py-1 px-0.5 ${cellColor}">${cellText}</td>`;
    }

    const totalActiveDays = h + sc + i + a;
    const pct = totalActiveDays > 0 ? Math.round((h / totalActiveDays) * 100) : 0;

    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50';
    tr.innerHTML = `
      <td class="border border-slate-400 py-1 px-1 font-mono">${idx + 1}</td>
      <td class="border border-slate-400 py-1 px-2 font-mono text-slate-600">${s.nisn}</td>
      <td class="border border-slate-400 py-1 px-3 text-left font-bold text-slate-900">${s.name}</td>
      <td class="border border-slate-400 py-1 px-1 font-bold ${s.gender === 'L' ? 'text-blue-600' : 'text-pink-600'}">${s.gender}</td>
      ${daysCells}
      <td class="border border-slate-400 py-1 px-1 bg-emerald-50 text-emerald-800 font-bold">${h}</td>
      <td class="border border-slate-400 py-1 px-1 bg-amber-50 text-amber-800 font-bold">${sc}</td>
      <td class="border border-slate-400 py-1 px-1 bg-blue-50 text-blue-800 font-bold">${i}</td>
      <td class="border border-slate-400 py-1 px-1 bg-rose-50 text-rose-800 font-bold">${a}</td>
      <td class="border border-slate-400 py-1 px-1 font-bold ${pct >= 85 ? 'text-emerald-700' : 'text-amber-700'}">${pct}%</td>
    `;
    tbody.appendChild(tr);
  });
}

function exportMonthlyReportExcel() {
  if (!window.XLSX) return;
  const monthSelect = document.getElementById('lap-month-select');
  const yearSelect = document.getElementById('lap-year-select');
  const classSelect = document.getElementById('lap-class-select');

  const month = parseInt(monthSelect.value, 10);
  const year = parseInt(yearSelect.value, 10);
  const selectedClass = classSelect.value;
  const daysInMonth = new Date(year, month, 0).getDate();

  const students = db.students.filter(s => s.class === selectedClass);
  const exportRows = [];

  students.forEach((s, idx) => {
    const row = {
      No: idx + 1,
      NISN: s.nisn,
      'Nama Siswa': s.name,
      'L/P': s.gender
    };

    let h = 0, sc = 0, i = 0, a = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const dateKeyStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const rec = db.attendance[`${dateKeyStr}_${s.nisn}`];
      const status = rec ? rec.status : '-';
      row[`Tgl_${d}`] = status;

      if (status === 'H') h++;
      else if (status === 'S') sc++;
      else if (status === 'I') i++;
      else if (status === 'A') a++;
    }

    row['Hadir (H)'] = h;
    row['Sakit (S)'] = sc;
    row['Izin (I)'] = i;
    row['Alpha (A)'] = a;
    const tot = h + sc + i + a;
    row['% Kehadiran'] = tot > 0 ? `${Math.round((h / tot) * 100)}%` : '0%';

    exportRows.push(row);
  });

  const ws = XLSX.utils.json_to_sheet(exportRows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, `Rekap_${selectedClass}`);
  XLSX.writeFile(wb, `Rekap_Presensi_${selectedClass}_Bulan_${month}_${year}.xlsx`);
  showToast('Laporan bulanan Excel berhasil diunduh!', 'success');
}

function exportCurrentAttendanceExcel() {
  if (!window.XLSX) return;
  const classSelect = document.getElementById('abs-class-select');
  const datePicker = document.getElementById('abs-date-picker');
  const selectedClass = classSelect.value;
  const selectedDate = datePicker.value || getTodayDateString();

  const students = db.students.filter(s => s.class === selectedClass);
  const rows = students.map((s, idx) => {
    const key = `${selectedDate}_${s.nisn}`;
    const rec = db.attendance[key] || { status: 'Belum', note: '', time: '-' };
    return {
      No: idx + 1,
      NISN: s.nisn,
      'Nama Siswa': s.name,
      Kelas: s.class,
      'L/P': s.gender,
      Status: rec.status || 'Belum',
      Keterangan: rec.note || '',
      'Jam Masuk': rec.time || '-'
    };
  });

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Absensi_Harian');
  XLSX.writeFile(wb, `Presensi_${selectedClass}_${selectedDate}.xlsx`);
  showToast('Rekap presensi harian berhasil diekspor!', 'success');
}

// ==========================================
// 10. TAB: PENGATURAN & BACKUP
// ==========================================
function loadSettingsForm() {
  document.getElementById('setting-school-name').value = db.settings.schoolName || '';
  document.getElementById('setting-npsn').value = db.settings.npsn || '';
  document.getElementById('setting-academic-year').value = db.settings.academicYear || '';
  document.getElementById('setting-address').value = db.settings.address || '';
  document.getElementById('setting-kepsek').value = db.settings.kepsek || '';
  document.getElementById('setting-nip-kepsek').value = db.settings.nipKepsek || '';
  document.getElementById('setting-time-in').value = db.settings.timeIn || '07:00';
  document.getElementById('setting-time-late').value = db.settings.timeLate || '07:15';
}

function saveSchoolSettings() {
  db.settings.schoolName = document.getElementById('setting-school-name').value.trim();
  db.settings.npsn = document.getElementById('setting-npsn').value.trim();
  db.settings.academicYear = document.getElementById('setting-academic-year').value.trim();
  db.settings.address = document.getElementById('setting-address').value.trim();
  db.settings.kepsek = document.getElementById('setting-kepsek').value.trim();
  db.settings.nipKepsek = document.getElementById('setting-nip-kepsek').value.trim();
  db.settings.timeIn = document.getElementById('setting-time-in').value;
  db.settings.timeLate = document.getElementById('setting-time-late').value;

  saveDatabase();
  const headerSchool = document.getElementById('header-school-name');
  if (headerSchool) headerSchool.textContent = db.settings.schoolName;
  const sidebarSchool = document.getElementById('sidebar-school-name');
  if (sidebarSchool) sidebarSchool.textContent = db.settings.schoolName;
  const heroYear = document.getElementById('hero-academic-year');
  if (heroYear) heroYear.textContent = db.settings.academicYear;
  showToast('Identitas dan pengaturan sekolah berhasil disimpan!', 'success');
}

function exportDatabaseJson() {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(db, null, 2));
  const dlAnchor = document.createElement('a');
  dlAnchor.setAttribute('href', dataStr);
  dlAnchor.setAttribute('download', `sihadir_backup_${getTodayDateString()}.json`);
  dlAnchor.click();
  showToast('Cadangan database JSON berhasil diunduh!', 'success');
}

function restoreDatabaseJson(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      const parsed = JSON.parse(evt.target.result);
      if (parsed.students && parsed.classes) {
        db = parsed;
        saveDatabase();
        showToast('Database berhasil dipulihkan secara penuh!', 'success');
        setTimeout(() => location.reload(), 1000);
      } else {
        showToast('Format file backup tidak valid!', 'danger');
      }
    } catch (err) {
      showToast('Gagal membaca file JSON backup!', 'danger');
    }
  };
  reader.readAsText(file);
}

function resetToSampleDemoData() {
  if (confirm('Reset ulang data ke data demo bawaan (semua murid & presensi contoh)?')) {
    const seed = generateInitialDemoData();
    db.students = seed.students;
    db.attendance = seed.attendance;
    saveDatabase();
    showToast('Data demo berhasil dimuat ulang!', 'success');
    renderDashboard();
  }
}

function clearAllDataConfirm() {
  if (confirm('PERINGATAN: Kosongkan seluruh data siswa dan absensi? Tindakan ini tidak dapat dibatalkan!')) {
    db.students = [];
    db.attendance = {};
    saveDatabase();
    showToast('Seluruh data berhasil dikosongkan.', 'info');
    renderDashboard();
  }
}

// ==========================================
// 11. INITIALIZATION ON PAGE LOAD
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  loadDatabase();

  // Populate dynamic header and sidebar info
  const headerSchool = document.getElementById('header-school-name');
  if (headerSchool) headerSchool.textContent = db.settings.schoolName || 'Aplikasi Absensi';
  const sidebarSchool = document.getElementById('sidebar-school-name');
  if (sidebarSchool) sidebarSchool.textContent = db.settings.schoolName || 'Aplikasi Absensi';
  const heroYear = document.getElementById('hero-academic-year');
  if (heroYear) heroYear.textContent = db.settings.academicYear || '2026/2027';

  // Start live clock
  updateLiveClock();
  setInterval(updateLiveClock, 1000);

  // Initialize initial tab
  populateDashboardFilters();
  renderDashboard();

  // Initialize camera list
  initCameraDeviceList();
});
