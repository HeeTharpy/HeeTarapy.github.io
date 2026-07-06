let managers = [];
let site = {};
let uploadedImage = "";
let uploadedHeroImage = "";

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

function getSavedJSON(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) {
    return fallback;
  }
}

function normalizeManagers(list) {
  return (Array.isArray(list) ? list : []).map((m, index) => ({
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


function formatAgeText(age) {
  const value = String(age || "").trim();
  if (!value) return "나이 문의";
  if (value === "20중") return "20대 중반";
  if (value === "20초") return "20대 초반";
  if (value === "20후") return "20대 후반";
  return value;
}

function formatHeightText(height) {
  const value = String(height || "").trim();
  if (!value) return "키 문의";
  return /cm/i.test(value) ? value : `${value}cm`;
}

function formatBodyText(body) {
  const value = String(body || "").trim();
  if (!value) return "스펙 문의";

  const parts = value
    .replace(/,/g, " /")
    .split(/[\/·]/)
    .map((part) => part.trim())
    .filter(Boolean);

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

function login() {
  const id = document.getElementById("id").value.trim();
  const pw = document.getElementById("pw").value.trim();

  if (id === "heetherapy" && pw === "qorrha!12") {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("adminWrap").style.display = "block";
    loadAll();
  } else {
    alert("아이디 또는 비밀번호가 틀렸습니다.");
  }
}

function loadAll() {
  managers = normalizeManagers(getSavedJSON("heetherapyManagers", therapists.map(t => ({ ...t }))));
  localStorage.setItem("heetherapyManagers", JSON.stringify(managers));
  site = { ...DEFAULT_SITE, ...getSavedJSON("heetherapySite", {}) };
  fillSiteForm();
  renderManagers();
}

function saveManagers() {  
  localStorage.setItem("heetherapyManagers", JSON.stringify(managers));
  localStorage.setItem("heetherapyLastSaved", new Date().toLocaleString("ko-KR"));
  renderManagers();
}

function saveSiteStorage() {
  localStorage.setItem("heetherapySite", JSON.stringify(site));
  localStorage.setItem("heetherapyLastSaved", new Date().toLocaleString("ko-KR"));
}

function fillSiteForm() {
  document.getElementById("sitePhone").value = site.phone || "";
  document.getElementById("siteTelegram").value = site.telegram || "";
  document.getElementById("siteAddress").value = site.address || "";
  document.getElementById("siteHours").value = site.hours || "";
  document.getElementById("siteHeroTitle").value = site.heroTitle || "";
  document.getElementById("siteHeroSubTitle").value = site.heroSubTitle || "";
  document.getElementById("siteHeroDesc").value = site.heroDesc || "";
  showHeroPreview(site.heroImage || "");
  document.getElementById("eventTitle1").value = site.eventTitle1 || "";
  document.getElementById("eventText1").value = site.eventText1 || "";
  document.getElementById("eventTitle2").value = site.eventTitle2 || "";
  document.getElementById("eventText2").value = site.eventText2 || "";
}

function saveSite() {
  site.phone = document.getElementById("sitePhone").value.trim();
  site.telegram = document.getElementById("siteTelegram").value.trim();
  site.address = document.getElementById("siteAddress").value.trim();
  site.hours = document.getElementById("siteHours").value.trim();
  site.heroTitle = document.getElementById("siteHeroTitle").value.trim();
  site.heroSubTitle = document.getElementById("siteHeroSubTitle").value.trim();
  site.heroDesc = document.getElementById("siteHeroDesc").value.trim();
  if (uploadedHeroImage) site.heroImage = uploadedHeroImage;
  uploadedHeroImage = "";
  saveSiteStorage();
  alert("기본 정보가 저장되었습니다.");
}

function saveEvents() {
  site.eventTitle1 = document.getElementById("eventTitle1").value.trim();
  site.eventText1 = document.getElementById("eventText1").value.trim();
  site.eventTitle2 = document.getElementById("eventTitle2").value.trim();
  site.eventText2 = document.getElementById("eventText2").value.trim();
  saveSiteStorage();
  alert("이벤트가 저장되었습니다.");
}

function saveManager() {
  const idValue = document.getElementById("managerId").value;
  const imagePath = uploadedImage || document.getElementById("managerImage").value.trim();
  const item = {
    id: idValue ? Number(idValue) : Date.now(),
    name: document.getElementById("managerName").value.trim(),
    age: document.getElementById("managerAge").value.trim(),
    height: document.getElementById("managerHeight").value.trim(),
    body: document.getElementById("managerBody").value.trim(),
    work: document.getElementById("managerWork").value.trim(),
    telegram: document.getElementById("managerTelegram").value.trim() || site.telegram || DEFAULT_SITE.telegram,
    intro: document.getElementById("managerIntro").value.trim(),
    image: imagePath || "assets/profiles/hihi/main.jpg"
  };

  if (!item.name) {
    alert("이름을 입력하세요.");
    return;
  }

  if (idValue) {
    const index = managers.findIndex(m => Number(m.id) === Number(idValue));
    if (index >= 0) managers[index] = item;
  } else {
    managers.push(item);
  }

  saveManagers();
  clearForm();
  alert("관리사 정보가 저장되었습니다.");
}

function editManager(id) {
  const item = managers.find(m => String(m.id) === String(id));
  if (!item) return;
  document.getElementById("managerId").value = item.id;
  document.getElementById("managerName").value = item.name || "";
  document.getElementById("managerAge").value = item.age || "";
  document.getElementById("managerHeight").value = item.height || "";
  document.getElementById("managerBody").value = item.body || "";
  document.getElementById("managerWork").value = item.work || "";
  document.getElementById("managerTelegram").value = item.telegram || "";
  document.getElementById("managerIntro").value = item.intro || item.desc || "";
  document.getElementById("managerImage").value = item.image || "";
  uploadedImage = "";
  showPreview(item.image);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteManager(id) {
  if (!confirm("삭제하시겠습니까?")) return;
  const before = managers.length;
  managers = managers.filter(m => String(m.id) !== String(id));

  if (managers.length === before) {
    alert("삭제할 항목을 찾지 못했습니다. 새로고침 후 다시 시도해주세요.");
    return;
  }

  saveManagers();
}

function moveManager(id, direction) {
  const index = managers.findIndex(m => String(m.id) === String(id));
  const next = index + direction;
  if (index < 0 || next < 0 || next >= managers.length) return;
  const temp = managers[index];
  managers[index] = managers[next];
  managers[next] = temp;
  saveManagers();
}

function clearForm() {
  ["managerId", "managerName", "managerAge", "managerHeight", "managerBody", "managerWork", "managerTelegram", "managerIntro", "managerImage"].forEach(id => document.getElementById(id).value = "");
  document.getElementById("managerImageFile").value = "";
  uploadedImage = "";
  document.getElementById("imagePreview").innerHTML = "사진 미리보기";
}

function showPreview(src) {
  const preview = document.getElementById("imagePreview");
  if (!src) {
    preview.innerHTML = "사진 미리보기";
    return;
  }
  preview.innerHTML = `<img src="${src}" alt="미리보기">`;
}

function renderManagers() {
  const list = document.getElementById("managerList");
  const keyword = (document.getElementById("managerSearch")?.value || "").trim();

  const totalEl = document.getElementById("totalManagers");
  const todayEl = document.getElementById("todayManagers");
  const savedEl = document.getElementById("lastSaved");

  if (totalEl) totalEl.textContent = managers.length;
  if (todayEl) todayEl.textContent = managers.filter(m => String(m.work || "").trim()).length;
  if (savedEl) savedEl.textContent = localStorage.getItem("heetherapyLastSaved") || "-";

  const filtered = managers.filter(m =>
    !keyword ||
    String(m.name || "").includes(keyword) ||
    String(m.work || "").includes(keyword)
  );

  if (!filtered.length) {
    list.innerHTML = `<div class="empty">검색 결과가 없습니다.</div>`;
    return;
  }

  list.innerHTML = filtered.map((m) => {
    const i = managers.findIndex(item => String(item.id) === String(m.id));

    return `
      <div class="manager-item">
        <div class="manager-photo"><img src="${m.image}" alt="${m.name}" onerror="this.parentElement.innerHTML='사진 없음'"></div>
        <div class="manager-text">
          <strong>${m.name}</strong>
          <span>${formatAgeText(m.age)} · ${formatHeightText(m.height)} · ${formatBodyText(m.body)}</span>
          <em>${m.work || "출근시간 문의"}</em>
        </div>
        <div class="manager-actions">
          <button class="small" onclick="moveManager('${m.id}', -1)" ${i === 0 ? "disabled" : ""}>▲</button>
          <button class="small" onclick="moveManager('${m.id}', 1)" ${i === managers.length - 1 ? "disabled" : ""}>▼</button>
          <button class="small" onclick="editManager('${m.id}')">수정</button>
          <button class="small danger" onclick="deleteManager('${m.id}')">삭제</button>
        </div>
      </div>
    `;
  }).join("");
}

function previewHome() {
  window.open("index.html", "_blank");
}

function loadDefaultManagers() {
  if (!confirm("기본 관리사 목록으로 복구할까요?")) return;
  managers = normalizeManagers(therapists.map(t => ({ ...t })));
  saveManagers();
  clearForm();
  alert("기본 관리사 목록으로 복구되었습니다. 홈페이지를 새로고침하세요.");
}

function resetAll() {
  if (!confirm("관리자 저장 내용을 초기화할까요?")) return;
  localStorage.removeItem("heetherapyManagers");
  localStorage.removeItem("heetherapySite");
  managers = normalizeManagers(therapists.map(t => ({ ...t })));
  site = { ...DEFAULT_SITE };
  uploadedHeroImage = "";
  fillSiteForm();
  renderManagers();
  clearForm();
  alert("초기화되었습니다. 홈페이지를 새로고침하세요.");
}

function compressImageFile(file, maxWidth = 900, quality = 0.78) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      reject(new Error("이미지 파일만 사용할 수 있습니다."));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("사진을 읽지 못했습니다."));
    reader.onload = function (e) {
      const img = new Image();
      img.onerror = () => reject(new Error("사진을 불러오지 못했습니다."));
      img.onload = function () {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}


function showHeroPreview(src) {
  const preview = document.getElementById("heroImagePreview");
  if (!preview) return;
  if (!src) {
    preview.innerHTML = "메인 사진 미리보기";
    return;
  }
  preview.innerHTML = `<img src="${src}" alt="메인 사진 미리보기">`;
}

const heroFileInput = document.getElementById("siteHeroImageFile");
if (heroFileInput) {
  heroFileInput.addEventListener("change", async function () {
    const file = this.files && this.files[0];
    if (!file) return;
    try {
      const preview = document.getElementById("heroImagePreview");
      preview.innerHTML = "압축 중...";
      uploadedHeroImage = await compressImageFile(file, 1500, 0.78);
      showHeroPreview(uploadedHeroImage);
    } catch (error) {
      alert(error.message || "메인 사진 처리 중 오류가 발생했습니다.");
      this.value = "";
      uploadedHeroImage = "";
      showHeroPreview(site.heroImage || "");
    }
  });
}

const managerImageFileInput = document.getElementById("managerImageFile");
if (managerImageFileInput) {
managerImageFileInput.addEventListener("change", async function () {
  const file = this.files && this.files[0];
  if (!file) return;

  try {
    const preview = document.getElementById("imagePreview");
    preview.innerHTML = "압축 중...";
    uploadedImage = await compressImageFile(file);
    document.getElementById("managerImage").value = "사진 파일 선택됨";
    showPreview(uploadedImage);
  } catch (error) {
    alert(error.message || "사진 처리 중 오류가 발생했습니다.");
    this.value = "";
    uploadedImage = "";
    showPreview("");
  }
});
}

const managerImagePathInput = document.getElementById("managerImage");
if (managerImagePathInput) {
  managerImagePathInput.addEventListener("input", function () {
    uploadedImage = "";
    showPreview(this.value.trim());
  });
}


const managerSearchInput = document.getElementById("managerSearch");
if (managerSearchInput) {
  managerSearchInput.addEventListener("input", renderManagers);
}
