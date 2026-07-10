// Internship data (later this will come from your backend/API)
const internships = [
  { id: 1, title: "Frontend developer intern", company: "Zynith Labs", location: "Remote", stipend: "₹15k/mo", type: "paid", role: "Software", duration: "3 months", employment: "Full-time", description: "Work with the product team to build and ship UI features using React. Good fit for students comfortable with JavaScript and CSS." },
  { id: 2, title: "Data analyst intern", company: "Corelytics", location: "Bangalore", stipend: "Deadline in 3 days", type: "deadline", role: "Software", duration: "2 months", employment: "Part-time", description: "Analyze product data and build dashboards to support the data team's decisions. SQL and Excel knowledge preferred." },
];

// ---------- SAVE / BOOKMARK (localStorage) ----------
function getSavedIds() {
  return JSON.parse(localStorage.getItem("savedInternships") || "[]");
}

function setSavedIds(ids) {
  localStorage.setItem("savedInternships", JSON.stringify(ids));
}

function toggleSave(button, id) {
  event.stopPropagation(); // prevent the card's onclick from firing too
  let saved = getSavedIds();
  const icon = button.querySelector("i");

  if (saved.includes(id)) {
    saved = saved.filter(sid => sid !== id);
    icon.classList.remove("fa-solid");
    icon.classList.add("fa-regular");
    button.classList.remove("saved");
  } else {
    saved.push(id);
    icon.classList.remove("fa-regular");
    icon.classList.add("fa-solid");
    button.classList.add("saved");
  }
  setSavedIds(saved);
}

// ---------- HOMEPAGE ----------
function renderInternships(list) {
  const container = document.getElementById("internshipList");
  if (!container) return; // not on homepage
  container.innerHTML = "";
  const savedIds = getSavedIds();

  list.forEach((item) => {
    const isSaved = savedIds.includes(item.id);
    const card = document.createElement("div");
    card.className = "card";
    card.style.cursor = "pointer";
    card.onclick = () => location.href = `detail.html?id=${item.id}`;
    card.innerHTML = `
      <div>
        <h3>${item.title}</h3>
        <p>${item.company} · ${item.location}</p>
        <span class="badge ${item.type}">${item.stipend}</span>
      </div>
      <button class="save-btn ${isSaved ? 'saved' : ''}" onclick="toggleSave(this, ${item.id})">
        <i class="fa-${isSaved ? 'solid' : 'regular'} fa-bookmark"></i>
      </button>
    `;
    container.appendChild(card);
  });

  document.getElementById("resultCount").textContent = `${list.length} internships found`;
}

function applyFilters() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const location = document.getElementById("locationFilter").value;
  const role = document.getElementById("roleFilter").value;
  const stipend = document.getElementById("stipendFilter").value;

  let filtered = internships.filter(i =>
    i.title.toLowerCase().includes(query) || i.company.toLowerCase().includes(query)
  );

  if (location !== "Location") filtered = filtered.filter(i => i.location === location);
  if (role !== "Role type") filtered = filtered.filter(i => i.role === role);
  if (stipend === "Paid") filtered = filtered.filter(i => i.type === "paid");
  if (stipend === "Unpaid") filtered = filtered.filter(i => i.type !== "paid");

  renderInternships(filtered);
}

function searchInternships() {
  applyFilters();
}

// ---------- SAVED PAGE ----------
function renderSavedList() {
  const container = document.getElementById("savedList");
  if (!container) return; // not on saved page
  const savedIds = getSavedIds();
  const savedItems = internships.filter(i => savedIds.includes(i.id));

  document.getElementById("savedCount").textContent = `${savedItems.length} saved internship(s)`;

  container.innerHTML = "";
  savedItems.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.cursor = "pointer";
    card.onclick = () => location.href = `detail.html?id=${item.id}`;
    card.innerHTML = `
      <div>
        <h3>${item.title}</h3>
        <p>${item.company} · ${item.location}</p>
        <span class="badge ${item.type}">${item.stipend}</span>
      </div>
      <button class="save-btn saved" onclick="toggleSave(this, ${item.id})">
        <i class="fa-solid fa-bookmark"></i>
      </button>
    `;
    container.appendChild(card);
  });
}

// ---------- DETAIL PAGE ----------
function renderDetailPage() {
  const container = document.getElementById("detailContent");
  if (!container) return; // not on detail page

  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));
  const item = internships.find(i => i.id === id) || internships[0];
  const isSaved = getSavedIds().includes(item.id);

  container.innerHTML = `
    <div class="detail-header">
      <div>
        <h2>${item.title}</h2>
        <p>${item.company} · ${item.location}</p>
      </div>
      <button class="save-btn ${isSaved ? 'saved' : ''}" onclick="toggleSave(this, ${item.id})">
        <i class="fa-${isSaved ? 'solid' : 'regular'} fa-bookmark"></i>
      </button>
    </div>
    <div class="detail-tags">
      <span class="badge ${item.type}">${item.stipend}</span>
      <span class="tag">${item.duration}</span>
      <span class="tag">${item.employment}</span>
    </div>
    <div class="detail-section">
      <p class="detail-label">About the role</p>
      <p>${item.description}</p>
    </div>
    <button class="auth-btn">Apply now</button>
  `;
}

// ---------- AUTH (frontend-only demo for now — real backend comes later) ----------
function handleLogin() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    alert("Please fill in both fields.");
    return;
  }
  localStorage.setItem("loggedInUser", email);
  alert("Logged in successfully (demo mode — no backend yet).");
  location.href = "index.html";
}

function handleSignup() {
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;

  if (!name || !email || !password) {
    alert("Please fill in all fields.");
    return;
  }
  if (password.length < 8) {
    alert("Password must be at least 8 characters.");
    return;
  }
  localStorage.setItem("loggedInUser", email);
  alert("Account created (demo mode — no backend yet).");
  location.href = "index.html";
}

// ---------- INIT: runs safely on every page, skips what doesn't apply ----------
renderInternships(internships);
renderSavedList();
renderDetailPage();
