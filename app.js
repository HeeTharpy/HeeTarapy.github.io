const $ = (selector) => document.querySelector(selector);
let activeTherapists = [];
let site = {};
let currentProfileIndex = -1;

const DEFAULT_SITE = {
  phone: "010-7255-2248",
  telegram: "https://t.me/wh2248",
  address: "기흥구 농서동",
  hours: "10:00 ~ 02:00",
  heroTitle: "희 테라피",
  heroSubTitle: "프리미엄 힐링 공간",
  heroDesc: "고객님만을 위한 편안하고 고급스러운 힐링을 선사합니다.",
  heroImage: "",
  eventTitle1: "실시간 예약 가능",
  eventText1: "텔레그램에서 빠르게 예약 가능합니다.",
  eventTitle2: "오늘의 출근부",
  eventText2: "관리사 출근 현황을 실시간으로 확인하세요."
};

function firebaseDb() {
  if (typeof db !== "undefined") return db;
  if (window.db) return window.db;
  if (window.firebase && firebase.database) return firebase.database();
  return null;
}

function normalizeManagers(list) {
  // Firebase Realtime Database can return arrays OR objects.
  // Convert object data like {"123": {...}, "456": {...}} into an array first.
  let arr = [];
  if (Array.isArray(list)) {
    arr = list;
  } else if (list && typeof list === "object") {
    arr = Object.keys(list).map((key) => ({ id: list[key]?.id || key, ...(list[key] || {}) }));
  }
  return arr.filter(Boolean).map((m, index) => ({
    id: m.id || Date.now() + index,
    name: m.name || "",
    age: m.age || "",
    height: m.height || "",
    body: m.body || "",
    work: m.work || "",
    telegram: m.telegram || DEFAULT_SITE.telegram,
    intro: m.intro || m.desc || "",
    image: m.image || ""
  }));
}

function fallbackManagers() {
  const fallback = window.therapists || (typeof therapists !== "undefined" ? therapists : []);
  return normalizeManagers(fallback.map(t => ({ ...t })));
}

function formatAge(age) {
  const value = String(age || "").trim();
  if (!value) return "나이 문의";
  if (/^20중$/.test(value)) return "20대 중반";
  if (/^20초$/.test(value)) return "20대 초반";
  if (/^20후$/.test(value)) return "20대 후반";
  return value;
}

function formatHeight(height) {
  const value = String(height || "").trim();
  if (!value) return "키 문의";
  return /cm/i.test(value) ? value : `${value}cm`;
}

function formatBody(body) {
  const value = String(body || "").trim();
  if (!value) return "스펙 문의";
  const parts = value.replace(/,/g, " /").split(/[\/·]/).map(part => part.trim()).filter(Boolean);
  let weight = "";
  let cup = "";
  parts.forEach((part) => {
    const weightMatch = part.match(/(\d{2,3})\s*(?:kg|키로)?/i);
    const cupMatch = part.match(/\b([A-F])\s*(?:컵|cup)?\b/i);
    if (!weight && weightMatch) weight = `${weightMatch[1]}kg`;
    if (!cup && cupMatch) cup = `${cupMatch[1].toUpperCase()}컵`;
  });
  if (weight && cup) return `${weight} · ${cup}`;
  if (weight) return weight;
  if (cup) return cup;
  return value.replace(/\s*\/\s*/g, " · ");
}

function safeImage(src) {
  return String(src || "").trim();
}

function updateText(selector, text) {
  const el = $(selector);
  if (el && text !== undefined && text !== null) el.textContent = text;
}

function updateLinks() {
  const phoneNumber = String(site.phone || DEFAULT_SITE.phone).replace(/[^0-9]/g, "");
  document.querySelectorAll('a[href^="tel:"]').forEach((a) => a.href = `tel:${phoneNumber}`);
  document.querySelectorAll('a[href^="https://t.me/"]').forEach((a) => a.href = site.telegram || DEFAULT_SITE.telegram);
  updateText(".hero h1", site.heroTitle);
  updateText(".hero h2", site.heroSubTitle);
  updateText(".hero-desc", site.heroDesc);
  updateText("#addressText", site.address);
  updateText("#hoursText", site.hours);
  updateText("#phoneText", site.phone);
  const heroBg = $(".hero-bg");
  if (heroBg && site.heroImage) {
    heroBg.style.backgroundImage = `linear-gradient(rgba(0,0,0,.58),rgba(0,0,0,.76)), url('${site.heroImage}')`;
  }
  const footer = document.querySelector(".footer p");
  if (footer) footer.textContent = `${site.address} · ${site.phone} · ${site.hours}`;
}

function renderTherapists() {
  const therapistGrid = $("#therapistGrid");
  if (!therapistGrid) return;
  therapistGrid.innerHTML = activeTherapists.map((item) => `
    <article class="therapist-card" onclick="openProfile(${item.id})">
      <div class="thumb"><img src="${safeImage(item.image)}" alt="${item.name}" onerror="this.parentElement.classList.add('no-image'); this.remove();"></div>
      <div class="therapist-info">
        <h3>${item.name}</h3>
        <div class="therapist-meta">
          <span>${formatAge(item.age)}</span>
          <span>${formatHeight(item.height)}</span>
          <span>${formatBody(item.body)}</span>
        </div>
        <p>${item.work || "출근시간 문의"}</p>
        <em>PROFILE VIEW</em>
      </div>
    </article>
  `).join("");
}

function getProfileIntro(item) {
  return item.intro || item.desc || "밝고 편안한 분위기로 정성껏 관리해드립니다.\n처음 방문하시는 분들도 부담 없이 이용 가능합니다.";
}

function renderProfile(index) {
  if (!activeTherapists.length) return;
  currentProfileIndex = (index + activeTherapists.length) % activeTherapists.length;
  const item = activeTherapists[currentProfileIndex];
  const phoneNumber = String(site.phone || DEFAULT_SITE.phone).replace(/[^0-9]/g, "");
  const modalContent = $("#modalContent");
  if (!modalContent) return;
  modalContent.innerHTML = `
    <div class="premium-profile">
      <div class="premium-photo-wrap">
        <div class="profile-photo premium-photo"><img src="${safeImage(item.image)}" alt="${item.name}" onerror="this.parentElement.classList.add('no-image'); this.remove();"></div>
      </div>
      <div class="premium-info">
        <p class="eyebrow">THERAPIST PROFILE</p>
        <h2>${item.name}</h2>
        <div class="premium-specs">
          <div><b>나이</b><span>${formatAge(item.age)}</span></div>
          <div><b>키</b><span>${formatHeight(item.height)}</span></div>
          <div><b>스펙</b><span>${formatBody(item.body)}</span></div>
        </div>
        <div class="premium-work"><small>출근시간</small><strong>${item.work || "문의"}</strong></div>
        <p class="premium-intro">${getProfileIntro(item)}</p>
        <div class="premium-actions">
          <a class="btn gold" href="${item.telegram || site.telegram}" target="_blank">텔레그램 예약</a>
          <a class="btn dark" href="tel:${phoneNumber}">전화예약</a>
        </div>
        <div class="profile-nav-actions">
          <button type="button" onclick="changeProfile(-1)">← 이전 관리사</button>
          <button type="button" onclick="changeProfile(1)">다음 관리사 →</button>
        </div>
      </div>
    </div>`;
}

function openProfile(id) {
  const index = activeTherapists.findIndex(t => Number(t.id) === Number(id));
  if (index < 0) return;
  renderProfile(index);
  $("#profileModal").classList.add("show");
}

function changeProfile(direction) {
  renderProfile(currentProfileIndex + direction);
}

function renderCourse() {
  const courseGrid = $("#courseGrid");
  if (courseGrid) {
    courseGrid.innerHTML = `<article class="course-card"><p>PREMIUM</p><h3>60분 프리미엄 코스</h3><strong>170,000원</strong><span>프리미엄 스웨디시 테라피</span></article><article class="course-card"><p>WAXING</p><h3>왁싱 코스</h3><strong>문의</strong><span>하루 전 예약 진행</span></article>`;
  }
}

function renderTodaySchedule() {
  const todayWorkers = activeTherapists.filter(item => item.work && item.work.trim());
  if (!todayWorkers.length) return `<p>오늘 출근 정보는 텔레그램에서 확인해주세요.</p>`;
  return `<div class="today-schedule">${todayWorkers.map(item => `<div class="schedule-row"><strong>${item.name}</strong><span>${item.work}</span></div>`).join("")}</div>`;
}

function renderEvents() {
  const eventGrid = $("#eventGrid");
  if (!eventGrid) return;
  eventGrid.innerHTML = `
    <article class="event-card"><h3>${site.eventTitle1}</h3><div class="event-text">${String(site.eventText1 || "").replace(/\n/g, "<br>")}</div></article>
    <article class="event-card"><h3>${site.eventTitle2}</h3>${renderTodaySchedule()}</article>`;
}

function renderAll() {
  updateLinks();
  renderTherapists();
  renderCourse();
  renderEvents();
}

function startFirebase() {
  site = { ...DEFAULT_SITE };
  activeTherapists = fallbackManagers();
  renderAll();

  const database = firebaseDb();
  if (!database) {
    console.error("Firebase 연결을 찾지 못했습니다.");
    return;
  }

  database.ref("/").on("value", (snapshot) => {
    const data = snapshot.val() || {};
    site = { ...DEFAULT_SITE, ...(data.site || {}) };
    activeTherapists = normalizeManagers(data.managers || fallbackManagers());
    renderAll();
  }, (error) => {
    console.error("Firebase 읽기 실패", error);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const closeBtn = $("#closeModal");
  if (closeBtn) closeBtn.addEventListener("click", () => $("#profileModal").classList.remove("show"));
  const modal = $("#profileModal");
  if (modal) modal.addEventListener("click", (e) => { if (e.target.id === "profileModal") modal.classList.remove("show"); });
  startFirebase();
});
