/* ==========================================================================
   TEETH N BRACES CLINIC - ADMIN PORTAL LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  checkSession();
  initSidebarSpy();
});

/* ==========================================================================
   AUTHENTICATION CONTROL
   ========================================================================== */
window.handleLogin = function(event) {
  event.preventDefault();
  const user = document.getElementById('username').value.trim();
  const pass = document.getElementById('password').value.trim();
  const errorNode = document.getElementById('loginError');

  // Basic mock check: admin / clinic99
  if (user === 'admin' && pass === 'clinic99') {
    localStorage.setItem('tnb_admin_logged_in', 'true');
    errorNode.style.display = 'none';
    
    // Switch view
    document.getElementById('loginOverlay').style.display = 'none';
    document.getElementById('dashboardContainer').style.display = 'flex';
    
    // Load data
    reloadData();
    showToast("Successfully logged in! Welcome Dr. Amit & Dr. Monica. 🔑");
  } else {
    errorNode.style.display = 'block';
  }
};

window.handleLogout = function() {
  localStorage.removeItem('tnb_admin_logged_in');
  location.reload();
};

function checkSession() {
  const isLoggedIn = localStorage.getItem('tnb_admin_logged_in') === 'true';
  if (isLoggedIn) {
    document.getElementById('loginOverlay').style.display = 'none';
    document.getElementById('dashboardContainer').style.display = 'flex';
    reloadData();
  } else {
    document.getElementById('loginOverlay').style.display = 'flex';
    document.getElementById('dashboardContainer').style.display = 'none';
  }
}

/* ==========================================================================
   SIDEBAR SPY / NAVIGATION
   ========================================================================== */
function initSidebarSpy() {
  const menuAppts = document.getElementById('menuAppointments');
  const menuReviews = document.getElementById('menuReviews');
  const apptSection = document.getElementById('appointments-section');
  const reviewsSection = document.getElementById('reviews-section');

  menuAppts.addEventListener('click', (e) => {
    e.preventDefault();
    menuAppts.classList.add('active');
    menuReviews.classList.remove('active');
    apptSection.scrollIntoView({ behavior: 'smooth' });
  });

  menuReviews.addEventListener('click', (e) => {
    e.preventDefault();
    menuReviews.classList.add('active');
    menuAppts.classList.remove('active');
    reviewsSection.scrollIntoView({ behavior: 'smooth' });
  });
}

/* ==========================================================================
   DATA OPERATIONS & RENDERERS
   ========================================================================== */
window.reloadData = function() {
  renderAppointments();
  renderReviewsFeed();
  updateMetrics();
};

function updateMetrics() {
  const appts = JSON.parse(localStorage.getItem('tnb_appointments')) || [];
  const reviews = JSON.parse(localStorage.getItem('tnb_reviews')) || [];
  
  // Total Appointments
  document.getElementById('statTotalAppts').textContent = appts.length;
  
  // Pending Appointments
  const pendingCount = appts.filter(a => a.status === 'pending').length;
  document.getElementById('statPendingAppts').textContent = pendingCount;
  
  // Total Reviews
  document.getElementById('statTotalReviews').textContent = reviews.length;
  
  // Avg Rating
  if (reviews.length > 0) {
    const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    const avg = (sum / reviews.length).toFixed(1);
    document.getElementById('statAvgRating').textContent = avg;
  } else {
    document.getElementById('statAvgRating').textContent = "0.0";
  }
}

function renderAppointments() {
  const tbody = document.getElementById('appointmentsTableBody');
  const appts = JSON.parse(localStorage.getItem('tnb_appointments')) || [];
  
  tbody.innerHTML = "";

  if (appts.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 30px;">
          No appointments requested yet.
        </td>
      </tr>
    `;
    return;
  }

  // Sort: pending first, then by date descending
  const sorted = [...appts].sort((a, b) => {
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (a.status !== 'pending' && b.status === 'pending') return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  sorted.forEach(appt => {
    const tr = document.createElement('tr');
    
    let badgeClass = 'pending';
    if (appt.status === 'completed') badgeClass = 'completed';
    if (appt.status === 'cancelled') badgeClass = 'cancelled';
    
    let actionsHtml = "";
    if (appt.status === 'pending') {
      actionsHtml = `
        <div class="actions-cell">
          <button class="btn-action approve" onclick="changeApptStatus(${appt.id}, 'completed')">Complete</button>
          <button class="btn-action cancel" onclick="changeApptStatus(${appt.id}, 'cancelled')">Cancel</button>
        </div>
      `;
    } else {
      actionsHtml = `
        <button class="btn-action delete" onclick="deleteAppointment(${appt.id})">Delete</button>
      `;
    }

    const noteText = appt.notes ? `<div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 4px;">Note: ${escapeHtml(appt.notes)}</div>` : "";

    tr.innerHTML = `
      <td><strong>${appt.date}</strong></td>
      <td>${appt.time}</td>
      <td>
        <strong>${escapeHtml(appt.name)}</strong>
        ${noteText}
      </td>
      <td><a href="tel:${appt.phone}" style="color: var(--secondary); font-weight: 600;">${appt.phone}</a></td>
      <td><span class="status-badge" style="background: var(--primary-light); color: var(--primary);">${appt.service}</span></td>
      <td><span class="status-badge ${badgeClass}">${appt.status}</span></td>
      <td>${actionsHtml}</td>
    `;
    
    tbody.appendChild(tr);
  });
}

window.changeApptStatus = function(apptId, newStatus) {
  const appts = JSON.parse(localStorage.getItem('tnb_appointments')) || [];
  const updated = appts.map(appt => {
    if (appt.id === apptId) {
      appt.status = newStatus;
    }
    return appt;
  });
  
  localStorage.setItem('tnb_appointments', JSON.stringify(updated));
  reloadData();
  showToast(`Appointment status updated to ${newStatus}!`);
};

window.deleteAppointment = function(apptId) {
  if (confirm("Are you sure you want to delete this appointment record?")) {
    const appts = JSON.parse(localStorage.getItem('tnb_appointments')) || [];
    const filtered = appts.filter(appt => appt.id !== apptId);
    
    localStorage.setItem('tnb_appointments', JSON.stringify(filtered));
    reloadData();
    showToast("Appointment record deleted.");
  }
};

function renderReviewsFeed() {
  const list = document.getElementById('adminReviewsList');
  const reviews = JSON.parse(localStorage.getItem('tnb_reviews')) || [];
  
  list.innerHTML = "";

  if (reviews.length === 0) {
    list.innerHTML = `
      <p style="text-align: center; color: var(--text-muted); padding: 30px;">
        No patient reviews found.
      </p>
    `;
    return;
  }

  reviews.forEach(review => {
    const item = document.createElement('div');
    item.className = 'admin-review-item';
    
    let starsHtml = "";
    for (let i = 1; i <= 5; i++) {
      if (i <= review.rating) {
        starsHtml += '<i class="fa-solid fa-star"></i>';
      } else {
        starsHtml += '<i class="fa-regular fa-star"></i>';
      }
    }

    let replySectionHtml = "";
    if (review.reply) {
      replySectionHtml = `
        <div class="admin-reply-box">
          <p><strong>Your Reply:</strong> "${escapeHtml(review.reply)}"</p>
          <button class="btn-action delete" style="margin-top: 10px;" onclick="deleteReply(${review.id})">Delete Reply</button>
        </div>
      `;
    } else {
      replySectionHtml = `
        <form class="reply-form" onsubmit="submitReply(event, ${review.id})">
          <textarea class="reply-textarea" id="replyText-${review.id}" required placeholder="Write a response reply..."></textarea>
          <button type="submit" class="btn-reply">Submit Reply</button>
        </form>
      `;
    }

    item.innerHTML = `
      <div class="admin-review-meta">
        <div>
          <strong>${escapeHtml(review.name)}</strong>
          <span style="font-size: 0.8rem; color: var(--text-muted);"> · ${review.date}</span>
        </div>
        <div>
          <span class="stars">${starsHtml}</span>
          <button class="btn-action delete" style="margin-left: 15px;" onclick="deleteReview(${review.id})"><i class="fa-solid fa-trash"></i> Delete Review</button>
        </div>
      </div>
      <div class="admin-review-body">${escapeHtml(review.text)}</div>
      ${replySectionHtml}
    `;
    
    list.appendChild(item);
  });
}

window.submitReply = function(event, reviewId) {
  event.preventDefault();
  const replyInput = document.getElementById(`replyText-${reviewId}`);
  const replyText = replyInput.value.trim();
  if (!replyText) return;

  const reviews = JSON.parse(localStorage.getItem('tnb_reviews')) || [];
  const updated = reviews.map(rev => {
    if (rev.id === reviewId) {
      rev.reply = replyText;
    }
    return rev;
  });
  
  localStorage.setItem('tnb_reviews', JSON.stringify(updated));
  reloadData();
  showToast("Reply submitted to review feed.");
};

window.deleteReply = function(reviewId) {
  const reviews = JSON.parse(localStorage.getItem('tnb_reviews')) || [];
  const updated = reviews.map(rev => {
    if (rev.id === reviewId) {
      rev.reply = "";
    }
    return rev;
  });
  
  localStorage.setItem('tnb_reviews', JSON.stringify(updated));
  reloadData();
  showToast("Review reply removed.");
};

window.deleteReview = function(reviewId) {
  if (confirm("Are you sure you want to delete this review? It will be removed from the patient feed.")) {
    const reviews = JSON.parse(localStorage.getItem('tnb_reviews')) || [];
    const filtered = reviews.filter(rev => rev.id !== reviewId);
    
    localStorage.setItem('tnb_reviews', JSON.stringify(filtered));
    reloadData();
    showToast("Review deleted.");
  }
};

/* ==========================================================================
   UTILITIES
   ========================================================================== */
function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function showToast(message) {
  const toast = document.getElementById('toastNotification');
  const msgNode = document.getElementById('toastMessage');
  
  msgNode.textContent = message;
  toast.classList.add('active');
  
  setTimeout(() => {
    toast.classList.remove('active');
  }, 3000);
}
