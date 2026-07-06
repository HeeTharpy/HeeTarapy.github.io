const $ = (selector) => document.querySelector(selector);
const therapistGrid = $("#therapistGrid");

if (therapistGrid) {
  therapistGrid.innerHTML = therapists.map((item) => `
    <article class="therapist-card" onclick="openProfile(${item.id})">
      <div class="thumb ${item.id}">
      
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="therapist-info">
        <h3>${item.name}</h3>
        <p>${item.work}</p>
        <span>PROFILE VIEW</span>
      </div>
    </article>
  `).join("");
}

function openProfile(id) {
  const item = therapists.find(t => t.id === id);
  if (!item) return;

  $("#modalContent").innerHTML = `
    <div class="profile-detail">
      <div class="profile-photo">
        <img src="${item.image}" alt="${item.name}" onerror="this.parentElement.classList.add('no-image'); this.remove();">
      </div>

      <div class="profile-info">
        <p class="eyebrow">THERAPIST PROFILE</p>
        <h2>${item.name}</h2>

        <div class="profile-text">
          <p>프리미엄 힐링을 위한 맞춤 관리로 편안한 시간을 선사합니다.</p>
        </div>

        <ul>
          <li><b>나이</b><span>${item.age}</span></li>
          <li><b>키</b><span>${item.height}</span></li>
          <li><b>스펙</b><span>${item.body}</span></li>
          <li><b>출근시간</b><span>${item.work}</span></li>
        </ul>

        <div class="profile-buttons">
          <a class="btn gold" href="${item.telegram}" target="_blank">텔레그램 예약</a>
          <a class="btn dark" href="tel:01072552248">전화 예약</a>
        </div>
      </div>
    </div>
  `;

  $("#profileModal").classList.add("show");
}

const closeBtn = $("#closeModal");
if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    $("#profileModal").classList.remove("show");
  });
}

const modal = $("#profileModal");
if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target.id === "profileModal") {
      modal.classList.remove("show");
    }
  });
}

const courseGrid = $("#courseGrid");
if (courseGrid) {
  courseGrid.innerHTML = `
    <article class="course-card">
      <p>BASIC</p>
      <h3>60분 코스</h3>
      <strong>170,000원</strong>
      <span>프리미엄 스웨디시 테라피</span>
    </article>

    <article class="course-card">
      <p>WAXING</p>
      <h3>왁싱 코스</h3>
      <strong>문의</strong>
      <span>하루 전 예약 진행</span>
    </article>
  `;
}

const eventGrid = $("#eventGrid");
if (eventGrid) {
  eventGrid.innerHTML = `
    <article class="event-card">
      <h3>실시간 예약 가능</h3>
      <p>텔레그램에서 빠르게 예약 가능합니다.</p>
    </article>

    <article class="event-card">
      <h3>오늘의 출근부</h3>
      <p>관리사 출근 현황을 실시간으로 확인하세요.</p>
    </article>
  `;
}