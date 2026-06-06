/* ==========================================================================
   ADMIN PORTAL LOGIC - JAIN DENTOFACIAL HUB
   ========================================================================== */

const positiveReplyTemplate = `Thank you so much for your kind words! 😊 It means a great deal to Dr. Surbhi Pande and the entire Jain Dentofacial Hub team. We always strive to make every patient feel informed, comfortable, and confident — whether it's a root canal, implant, laser treatment, or a simple consultation. Your trust is what drives us every day. We look forward to being your dental care partner for years to come! 🦷✨`;

document.addEventListener("DOMContentLoaded", () => {
  // Sync page view
  loadDashboardData();
  
  // Listen for storage events or window focus updates to keep data fresh
  window.addEventListener("appointmentsUpdated", loadDashboardData);
  window.addEventListener("reviewsUpdated", loadDashboardData);
  window.addEventListener("focus", loadDashboardData);
});

// Seed data constants to match script.js
const initialReviews = [
  {
    id: 1,
    name: "Rajesh K. Nagpur",
    rating: 5,
    text: "Dr. Surbhi Pande is incredibly skilled! I was terrified of root canals, but she explained the entire procedure on my X-ray beforehand. The laser treatment was entirely painless. Highly recommended dentist in Nagpur!",
    date: "2026-05-15",
    reply: "Thank you so much for your kind words! 😊 It means a great deal to Dr. Surbhi Pande and the entire Jain Dentofacial Hub team. We always strive to make every patient feel informed, comfortable, and confident."
  },
  {
    id: 2,
    name: "Priya Sharma",
    rating: 5,
    text: "The best place for orthodontics. I got my invisible aligners done here. Excellent pricing, very professional. Dr. Surbhi is extremely warm and LGBTQ+ friendly. Very comfortable clinic vibes.",
    date: "2026-05-28",
    reply: "Thank you so much, Priya! We believe in transparent, premium treatment for everyone. Wishing you a beautiful, confident smile journey!"
  },
  {
    id: 3,
    name: "Milind Deshmukh",
    rating: 4,
    text: "Got scaling and cosmetic smile shaping done. Very happy with the detailing. Clean clinic, friendly assistant, and Dr. Pande takes her time to ensure quality care.",
    date: "2026-06-02",
    reply: ""
  }
];

const initialAppointments = [
  {
    id: 1,
    name: "Suresh Kumar",
    phone: "9876543210",
    service: "Laser Root Canal Treatment",
    date: "2026-06-08",
    time: "Evening (4:00 PM - 8:00 PM)",
    notes: "Has severe tooth pain in lower left molar.",
    status: "Pending",
    createdAt: "2026-06-05T10:00:00.000Z"
  },
  {
    id: 2,
    name: "Kiran Joshi",
    phone: "9123456789",
    service: "Invisible Braces",
    date: "2026-06-09",
    time: "Morning (10:00 AM - 1:00 PM)",
    notes: "Wants consultation for Invisalign aligners.",
    status: "Confirmed",
    createdAt: "2026-06-05T11:30:00.000Z"
  }
];

/* ==========================================================================
   NAVIGATION & TAB CONTROLS
   ========================================================================== */
function switchAdminSection(sectionId, element) {
  // Hide all sections
  document.querySelectorAll(".admin-section").forEach(sec => {
    sec.classList.remove("active");
  });
  
  // Show target section
  const target = document.getElementById(`section-${sectionId}`);
  if (target) {
    target.classList.add("active");
  }

  // Update navbar items
  document.querySelectorAll(".nav-item").forEach(item => {
    item.classList.remove("active");
  });
  element.classList.add("active");

  // Update header text
  const titleMap = {
    dashboard: { title: "Admin Dashboard", subtitle: "Overview of clinic appointments and patient reviews" },
    appointments: { title: "Appointments Manager", subtitle: "Verify, search, and approve patient consultations" },
    reviews: { title: "Patient Reviews & Replies", subtitle: "Manage patient feedback and write reply statements" }
  };
  
  document.getElementById("pageTitle").innerText = titleMap[sectionId].title;
  document.getElementById("pageSubtitle").innerText = titleMap[sectionId].subtitle;
}

function triggerNavClick(index) {
  const items = document.querySelectorAll(".sidebar-nav .nav-item");
  if (items[index]) {
    items[index].click();
  }
}

/* ==========================================================================
   STATS LOADING & RENDERING
   ========================================================================== */
function loadDashboardData() {
  const appointments = JSON.parse(localStorage.getItem("jain_hub_appointments")) || [];
  const reviews = JSON.parse(localStorage.getItem("jain_hub_reviews")) || [];

  // 1. Calculate and Render Stat Cards
  const totalApps = appointments.length;
  const pendingApps = appointments.filter(a => a.status === "Pending").length;
  const totalReviews = reviews.length;
  
  let totalRating = 0;
  reviews.forEach(r => totalRating += r.rating);
  const avgRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : "4.8";

  // Sidebar counters
  document.getElementById("badgeAppCount").innerText = pendingApps;
  document.getElementById("badgeReviewCount").innerText = reviews.filter(r => !r.reply).length;

  // Overview numbers
  document.getElementById("statTotalApps").innerText = totalApps;
  document.getElementById("statPendingApps").innerText = pendingApps;
  document.getElementById("statTotalReviews").innerText = totalReviews;
  document.getElementById("statAvgRating").innerText = avgRating;

  // 2. Populate Recent Appointments (Dashboard view)
  const dashboardRecentApps = document.getElementById("dashboardRecentAppointments");
  dashboardRecentApps.innerHTML = "";
  
  // Get latest 5
  const latestApps = [...appointments].reverse().slice(0, 5);
  if (latestApps.length === 0) {
    dashboardRecentApps.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--text-muted)">No bookings recorded yet.</td></tr>`;
  } else {
    latestApps.forEach(app => {
      const statusClass = app.status === "Pending" ? "status-badge pending" : "status-badge confirmed";
      dashboardRecentApps.innerHTML += `
        <tr>
          <td>
            <div class="patient-detail-name">${app.name}</div>
            <div class="patient-detail-phone">${app.phone}</div>
          </td>
          <td>${app.service}</td>
          <td>${app.date}</td>
          <td><span class="${statusClass}">${app.status}</span></td>
        </tr>
      `;
    });
  }

  // 3. Populate Recent Reviews pending replies (Dashboard view)
  const dashboardRecentReviews = document.getElementById("dashboardRecentReviews");
  dashboardRecentReviews.innerHTML = "";

  const unrepliedReviews = reviews.filter(r => !r.reply).slice(0, 3);
  if (unrepliedReviews.length === 0) {
    dashboardRecentReviews.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding: 10px 0;">Great! No pending reviews to answer.</p>`;
  } else {
    unrepliedReviews.forEach(rev => {
      let stars = "⭐".repeat(rev.rating);
      dashboardRecentReviews.innerHTML += `
        <div class="pending-review-item">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h4>${rev.name} (${stars})</h4>
            <button class="btn-reply-action" onclick="openReplyModal(${rev.id})"><i class="fa-solid fa-reply"></i> Reply</button>
          </div>
          <p>"${rev.text}"</p>
        </div>
      `;
    });
  }

  // 4. Render main Lists for Manager views
  renderAppointmentsPanel();
  renderReviewsPanel();
}

/* ==========================================================================
   APPOINTMENTS PANEL CONTROLS
   ========================================================================== */
function renderAppointmentsPanel() {
  const appointments = JSON.parse(localStorage.getItem("jain_hub_appointments")) || [];
  const tbody = document.getElementById("appointmentsTableBody");
  if (!tbody) return;

  tbody.innerHTML = "";
  
  // Sort reverse-chronological by createdAt
  const sorted = [...appointments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (sorted.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted)">No appointments matched your query.</td></tr>`;
    return;
  }

  sorted.forEach(app => {
    const statusClass = app.status === "Pending" ? "status-badge pending" : "status-badge confirmed";
    const approveBtn = app.status === "Pending" 
      ? `<button class="btn-action approve" onclick="approveAppointment(${app.id})" title="Confirm Appointment"><i class="fa-solid fa-check"></i></button>`
      : '';

    tbody.innerHTML += `
      <tr class="appointment-row" data-name="${app.name.toLowerCase()}" data-status="${app.status}">
        <td>
          <div class="patient-detail-name">${app.name}</div>
          <div class="patient-detail-phone">${app.phone}</div>
          <span class="patient-notes" title="${app.notes}">Note: ${app.notes || 'None'}</span>
        </td>
        <td>${app.service}</td>
        <td>
          <div>${app.date}</div>
          <div style="font-size:0.8rem; color:var(--text-muted)">${app.time || ''}</div>
        </td>
        <td><span class="${statusClass}">${app.status}</span></td>
        <td>
          <div class="action-btns">
            ${approveBtn}
            <button class="btn-action delete" onclick="deleteAppointment(${app.id})" title="Cancel &amp; Delete"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      </tr>
    `;
  });
}

function approveAppointment(appId) {
  const list = JSON.parse(localStorage.getItem("jain_hub_appointments")) || [];
  const index = list.findIndex(a => a.id === appId);
  if (index !== -1) {
    list[index].status = "Confirmed";
    localStorage.setItem("jain_hub_appointments", JSON.stringify(list));
    loadDashboardData();
    showToast("Appointment status updated to: Confirmed.");
  }
}

function deleteAppointment(appId) {
  if (confirm("Are you sure you want to delete this appointment?")) {
    const list = JSON.parse(localStorage.getItem("jain_hub_appointments")) || [];
    const filtered = list.filter(a => a.id !== appId);
    localStorage.setItem("jain_hub_appointments", JSON.stringify(filtered));
    loadDashboardData();
    showToast("Appointment deleted successfully.");
  }
}

function filterAppointments() {
  const searchQuery = document.getElementById("appSearchInput").value.toLowerCase();
  const filterStatus = document.getElementById("appFilterStatus").value;
  const rows = document.querySelectorAll("#appointmentsTableBody tr.appointment-row");

  rows.forEach(row => {
    const name = row.getAttribute("data-name");
    const status = row.getAttribute("data-status");

    const matchesSearch = name.includes(searchQuery);
    const matchesStatus = filterStatus === "All" || status === filterStatus;

    if (matchesSearch && matchesStatus) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

/* ==========================================================================
   REVIEWS PANEL CONTROLS
   ========================================================================== */
function renderReviewsPanel() {
  const reviews = JSON.parse(localStorage.getItem("jain_hub_reviews")) || [];
  const listContainer = document.getElementById("reviewsTableBody");
  if (!listContainer) return;

  listContainer.innerHTML = "";

  if (reviews.length === 0) {
    listContainer.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding: 30px 0;">No reviews left yet.</p>`;
    return;
  }

  reviews.forEach(rev => {
    // Generate Stars
    let starsHtml = "";
    for (let i = 1; i <= 5; i++) {
      if (i <= rev.rating) {
        starsHtml += '<i class="fa-solid fa-star reviewer-stars"></i>';
      } else {
        starsHtml += '<i class="fa-regular fa-star reviewer-stars empty"></i>';
      }
    }

    // Reply Box
    let replyBoxHtml = "";
    if (rev.reply) {
      replyBoxHtml = `
        <div class="review-card-reply">
          <h5>Your Reply:</h5>
          <p>${rev.reply}</p>
        </div>
      `;
    }

    const replyBtnHtml = !rev.reply 
      ? `<button class="btn-reply-action" onclick="openReplyModal(${rev.id})"><i class="fa-solid fa-reply"></i> Send Reply</button>`
      : `<button class="btn-reply-action" onclick="openReplyModal(${rev.id})" style="border-color:#aaa; color:#777;"><i class="fa-solid fa-pen-to-square"></i> Edit Reply</button>`;

    const card = document.createElement("div");
    card.className = "review-admin-card review-row-item";
    card.setAttribute("data-rating", rev.rating);
    card.setAttribute("data-replied", rev.reply ? "yes" : "no");
    card.innerHTML = `
      <div class="review-card-header">
        <div>
          <span class="reviewer-name">${rev.name}</span>
          <span style="font-size:0.8rem; color:var(--text-muted); margin-left: 10px;">${rev.date}</span>
        </div>
        <div>
          ${starsHtml}
        </div>
      </div>
      <p class="review-card-text">"${rev.text}"</p>
      ${replyBoxHtml}
      <div style="display:flex; justify-content:space-between; align-items:center;">
        ${replyBtnHtml}
        <button class="btn-action delete" onclick="deleteReview(${rev.id})" title="Delete Feedback"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;

    listContainer.appendChild(card);
  });
}

function deleteReview(revId) {
  if (confirm("Are you sure you want to delete this review?")) {
    const list = JSON.parse(localStorage.getItem("jain_hub_reviews")) || [];
    const filtered = list.filter(r => r.id !== revId);
    localStorage.setItem("jain_hub_reviews", JSON.stringify(filtered));
    loadDashboardData();
    showToast("Patient review deleted.");
  }
}

function filterReviews() {
  const ratingFilter = document.getElementById("reviewFilterRating").value;
  const replyFilter = document.getElementById("reviewFilterReply").value;
  const cards = document.querySelectorAll("#reviewsTableBody .review-row-item");

  cards.forEach(card => {
    const rating = card.getAttribute("data-rating");
    const hasReply = card.getAttribute("data-replied");

    let matchesRating = true;
    if (ratingFilter === "5") matchesRating = (rating === "5");
    else if (ratingFilter === "4") matchesRating = (rating === "4");
    else if (ratingFilter === "3") matchesRating = (parseInt(rating) <= 3);

    let matchesReply = true;
    if (replyFilter === "Unreplied") matchesReply = (hasReply === "no");
    else if (replyFilter === "Replied") matchesReply = (hasReply === "yes");

    if (matchesRating && matchesReply) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
}

/* ==========================================================================
   REPLY MODAL & TEMPLATES
   ========================================================================== */
function openReplyModal(revId) {
  const reviews = JSON.parse(localStorage.getItem("jain_hub_reviews")) || [];
  const rev = reviews.find(r => r.id === revId);
  if (!rev) return;

  document.getElementById("replyReviewId").value = rev.id;
  document.getElementById("modalReviewRating").innerHTML = "⭐".repeat(rev.rating);
  document.getElementById("modalReviewText").innerText = `"${rev.text}"`;
  document.getElementById("replyTextarea").value = rev.reply || "";

  const modal = document.getElementById("replyModal");
  modal.classList.add("active");
}

function closeReplyModal() {
  const modal = document.getElementById("replyModal");
  modal.classList.remove("active");
}

function applyReplyTemplate() {
  document.getElementById("replyTextarea").value = positiveReplyTemplate;
}

function saveReviewReply(event) {
  event.preventDefault();
  const revId = parseInt(document.getElementById("replyReviewId").value);
  const text = document.getElementById("replyTextarea").value;

  const reviews = JSON.parse(localStorage.getItem("jain_hub_reviews")) || [];
  const index = reviews.findIndex(r => r.id === revId);

  if (index !== -1) {
    reviews[index].reply = text;
    localStorage.setItem("jain_hub_reviews", JSON.stringify(reviews));
    closeReplyModal();
    loadDashboardData();
    showToast("Response posted. Updates will reflect on the live website.");
  }
}

/* ==========================================================================
   RESET & DATA SEEDING
   ========================================================================== */
function seedDemoData() {
  if (confirm("This will restore initial sample appointments and reviews for demo testing. Proceed?")) {
    localStorage.setItem("jain_hub_reviews", JSON.stringify(initialReviews));
    localStorage.setItem("jain_hub_appointments", JSON.stringify(initialAppointments));
    loadDashboardData();
    showToast("Demo datasets seeded successfully!");
  }
}

// Toast notification
function showToast(message) {
  const toast = document.getElementById("toastNotification");
  const toastMsg = document.getElementById("toastMessage");
  if (toast && toastMsg) {
    toastMsg.innerText = message;
    toast.classList.add("active");
    setTimeout(() => {
      toast.classList.remove("active");
    }, 3500);
  }
}
