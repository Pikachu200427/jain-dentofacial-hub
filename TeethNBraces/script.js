/* ==========================================================================
   TEETH N BRACES CLINIC - CLIENT LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initPlanner();
  initInstagram();
  initReviews();
  initFaqs();
  initWhatsApp();
  initModal();
});

/* ==========================================================================
   NAVIGATION & MOBILE DRAWER
   ========================================================================== */
function initNavbar() {
  const header = document.getElementById('mainHeader');
  const hamburger = document.getElementById('hamburgerMenu');
  const navLinksList = document.getElementById('navLinks');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll effect on header
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll spy: update active link
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });
  });

  // Toggle mobile menu drawer
  hamburger.addEventListener('click', () => {
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isExpanded);
    hamburger.classList.toggle('active');
    navLinksList.classList.toggle('active');
  });

  // Close drawer on clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.classList.remove('active');
      navLinksList.classList.remove('active');
    });
  });
}

/* ==========================================================================
   INTERACTIVE TREATMENT PLANNER & ESTIMATOR
   ========================================================================== */
const plannerData = {
  braces: {
    aligners: {
      title: 'Invisible Clear Aligners Details',
      time: '6 to 15 months',
      aesthetic: '100% Invisible, Removable for eating & brushing',
      cost: '₹45,000 - ₹1,20,000'
    },
    ceramic: {
      title: 'Ceramic & Metallic Braces Details',
      time: '12 to 24 months',
      aesthetic: 'Semi-visible ceramic brackets / Visible steel brackets',
      cost: '₹25,000 - ₹55,000'
    }
  },
  rct: {
    laser: {
      title: 'Painless Laser RCT Details',
      time: '1 to 2 sessions (approx. 45 mins each)',
      aesthetic: 'Painless local anesthesia, high-tech rotary & laser disinfection',
      cost: '₹3,500 - ₹5,500'
    },
    standard: {
      title: 'Standard Rotary RCT Details',
      time: '2 to 3 sessions (approx. 45 mins each)',
      aesthetic: 'Effective root sterilization, conventional rotary preparation',
      cost: '₹2,500 - ₹4,000'
    }
  },
  crowns: {
    zirconia: {
      title: 'Premium Zirconia Crown Details',
      time: '10 to 15+ years (often with lifetime warranty)',
      aesthetic: '100% biocompatible, metal-free, natural translucent shading',
      cost: '₹7,000 - ₹15,000'
    },
    ceramic: {
      title: 'Porcelain Fused to Metal (PFM) Details',
      time: '5 to 10 years durability',
      aesthetic: 'Strong metal core with ceramic veneer cladding',
      cost: '₹3,000 - ₹6,000'
    }
  },
  kids: {
    consult: {
      title: 'First Checkup & Counseling Details',
      time: '20 to 30 mins',
      aesthetic: "Dr. Monica Giri's interactive dental games, clean assessment",
      cost: '₹500 - ₹1,000'
    },
    restorative: {
      title: 'Kids Fillings & Sealants Details',
      time: '1 session per tooth (approx. 20 mins)',
      aesthetic: 'Cavity protection sealant / aesthetic glass ionomer restorations',
      cost: '₹800 - ₹1,500'
    }
  }
};

let currentTab = 'braces';
let currentOptions = {
  braces: 'aligners',
  rct: 'laser',
  crowns: 'zirconia',
  kids: 'consult'
};

window.switchPlannerTab = function(tabId) {
  currentTab = tabId;
  
  // Update tabs styling
  document.querySelectorAll('.planner-tab').forEach(button => {
    button.classList.remove('active');
    button.setAttribute('aria-selected', 'false');
  });
  
  const activeTab = document.getElementById('tab' + tabId.charAt(0).toUpperCase() + tabId.slice(1));
  if (activeTab) {
    activeTab.classList.add('active');
    activeTab.setAttribute('aria-selected', 'true');
  }

  // Update visible step panel
  document.querySelectorAll('.planner-step').forEach(panel => {
    panel.classList.remove('active');
  });
  
  const activePanel = document.getElementById('plannerStep-' + tabId);
  if (activePanel) {
    activePanel.classList.add('active');
  }
};

window.selectPlannerOption = function(tabId, optionId, cardElement) {
  currentOptions[tabId] = optionId;
  
  // Deselect other cards in this specific grid
  const stepPanel = document.getElementById('plannerStep-' + tabId);
  if (stepPanel) {
    stepPanel.querySelectorAll('.planner-option-card').forEach(card => {
      card.classList.remove('selected');
    });
  }
  
  // Select clicked card
  cardElement.classList.add('selected');

  // Update estimates
  updatePlannerResult(tabId, optionId);
};

function updatePlannerResult(tabId, optionId) {
  const data = plannerData[tabId][optionId];
  if (!data) return;

  const resultCard = document.querySelector(`#plannerStep-${tabId} .planner-result-card`);
  if (!resultCard) return;

  const titleNode = resultCard.querySelector('h4');
  const details = resultCard.querySelectorAll('.result-detail-row');

  titleNode.textContent = data.title;
  
  if (details.length >= 3) {
    details[0].querySelector('.result-value').textContent = data.time;
    
    // Label change depending on tabs
    if (tabId === 'crowns') {
      details[1].querySelector('.result-label').textContent = 'Lifespan & Warranty:';
    } else if (tabId === 'kids') {
      details[1].querySelector('.result-label').textContent = 'Child Comfort Strategy:';
    } else {
      details[1].querySelector('.result-label').textContent = 'Aesthetics & Maintenance:';
    }
    
    details[1].querySelector('.result-value').textContent = data.aesthetic;
    details[2].querySelector('.result-value').textContent = data.cost;
  }
}

/* ==========================================================================
   INSTAGRAM MOCKUP WIDGET
   ========================================================================== */
function initInstagram() {
  const heartBtn = document.getElementById('instaHeartBtn');
  const likesCountNode = document.getElementById('instaLikesCount');
  let liked = false;
  let likesCount = parseInt(likesCountNode.textContent) || 246;

  window.toggleInstaHeart = function() {
    liked = !liked;
    if (liked) {
      heartBtn.classList.add('liked', 'fa-solid');
      heartBtn.classList.remove('fa-regular');
      likesCount++;
    } else {
      heartBtn.classList.remove('liked', 'fa-solid');
      heartBtn.classList.add('fa-regular');
      likesCount--;
    }
    likesCountNode.textContent = likesCount;
  };
}

/* ==========================================================================
   PATIENT REVIEWS & FEEDBACK (LOCAL STORAGE BACKEND)
   ========================================================================== */
const initialDefaultReviews = [
  {
    id: 1,
    name: "Suresh Deshmukh",
    rating: 5,
    text: "Excellent service! Dr. Amit Giri did my braces treatment. He explained the orthodontic process thoroughly and accommodated my schedule. Highly recommended braces clinic near Medical Square Nagpur!",
    date: "2026-05-15",
    reply: "Thank you Suresh! Glad we could design a confident smile alignment plan for you."
  },
  {
    id: 2,
    name: "Preeti Rao",
    rating: 5,
    text: "Dr. Monica Giri is extremely soft-spoken and patient. My daughter was afraid of dental fillings, but Dr. Monica made it so fun. The best kids dentist in Nagpur. Truly child friendly!",
    date: "2026-05-28",
    reply: "Thank you Preeti! We love making dentistry comfortable and happy for kids."
  },
  {
    id: 3,
    name: "Amit Kumar Jha",
    rating: 5,
    text: "Got a painless root canal (RCT) treatment done here. Extremely clean setup, strict hygiene standard, and reasonable costs. Dr. Monica Giri did a wonderful, gentle job. Painless root canal Untkhana indeed!",
    date: "2026-06-02",
    reply: ""
  }
];

let selectedFormRating = 5;

function initReviews() {
  // Check if reviews database exist
  if (!localStorage.getItem('tnb_reviews')) {
    localStorage.setItem('tnb_reviews', JSON.stringify(initialDefaultReviews));
  }
  
  renderReviews();
  setSelectRating(5);
}

window.toggleReviewForm = function() {
  const form = document.getElementById('reviewForm');
  form.classList.toggle('active');
  const btn = document.getElementById('writeReviewBtn');
  if (form.classList.contains('active')) {
    btn.textContent = 'Close Review Form';
  } else {
    btn.textContent = 'Write a Review';
  }
};

window.setSelectRating = function(rating) {
  selectedFormRating = rating;
  const stars = document.querySelectorAll('#ratingStarsSelect i');
  stars.forEach((star, idx) => {
    if (idx < rating) {
      star.classList.add('selected');
    } else {
      star.classList.remove('selected');
    }
  });
};

window.handleReviewSubmit = function(event) {
  event.preventDefault();
  const nameInput = document.getElementById('reviewName');
  const textInput = document.getElementById('reviewText');
  
  const reviews = JSON.parse(localStorage.getItem('tnb_reviews')) || [];
  
  const newReview = {
    id: Date.now(),
    name: nameInput.value.trim(),
    rating: selectedFormRating,
    text: textInput.value.trim(),
    date: new Date().toISOString().split('T')[0],
    reply: ""
  };
  
  reviews.unshift(newReview); // Add to the top
  localStorage.setItem('tnb_reviews', JSON.stringify(reviews));
  
  // Reset Form
  nameInput.value = "";
  textInput.value = "";
  setSelectRating(5);
  toggleReviewForm();
  
  // Show Toast & Re-render
  showToast("Review submitted successfully! Thank you. 😊");
  renderReviews();
};

function renderReviews() {
  const feed = document.getElementById('reviewsFeed');
  const countNode = document.getElementById('verifiedReviewsCount');
  const scoreNode = document.getElementById('avgRatingScore');
  
  const reviews = JSON.parse(localStorage.getItem('tnb_reviews')) || [];
  
  // Update aggregate scores
  const totalReviewsCount = reviews.length;
  countNode.textContent = totalReviewsCount;
  
  if (totalReviewsCount > 0) {
    const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    const avg = (sum / totalReviewsCount).toFixed(1);
    scoreNode.textContent = avg;
  } else {
    scoreNode.textContent = "0.0";
  }

  // Clear feed
  feed.innerHTML = "";

  reviews.forEach(review => {
    const card = document.createElement('article');
    card.className = 'review-card';
    
    let starsHtml = "";
    for (let i = 1; i <= 5; i++) {
      if (i <= review.rating) {
        starsHtml += '<i class="fa-solid fa-star"></i>';
      } else {
        starsHtml += '<i class="fa-regular fa-star"></i>';
      }
    }

    let replyHtml = "";
    if (review.reply) {
      replyHtml = `
        <div class="review-reply">
          <div class="review-reply-header">
            <i class="fa-solid fa-reply"></i>
            <span>Response from Teeth N Braces:</span>
          </div>
          <p>${review.reply}</p>
        </div>
      `;
    }

    card.innerHTML = `
      <div class="review-card-header">
        <div>
          <span class="reviewer-name">${escapeHtml(review.name)}</span>
          <span class="review-date"> · ${formatDate(review.date)}</span>
        </div>
        <div class="reviewer-stars">${starsHtml}</div>
      </div>
      <p class="review-text">${escapeHtml(review.text)}</p>
      ${replyHtml}
    `;
    
    feed.appendChild(card);
  });
}

function formatDate(dateStr) {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const date = new Date(parts[0], parts[1] - 1, parts[2]);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* ==========================================================================
   FAQS ACCORDION
   ========================================================================== */
function initFaqs() {
  window.toggleFaq = function(button) {
    const faqItem = button.parentNode;
    const answer = faqItem.querySelector('.faq-answer');
    const isActive = faqItem.classList.contains('active');

    // Close other faqs
    document.querySelectorAll('.faq-item').forEach(item => {
      item.classList.remove('active');
      item.querySelector('.faq-answer').style.maxHeight = null;
    });

    if (!isActive) {
      faqItem.classList.add('active');
      answer.style.maxHeight = answer.scrollHeight + "px";
    }
  };
}

/* ==========================================================================
   WHATSAPP CHAT WIDGET
   ========================================================================== */
function initWhatsApp() {
  // Set current time for welcome message
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const timeNode = document.getElementById('chatTime');
  if (timeNode) timeNode.textContent = timeStr;
}

window.toggleChatBox = function() {
  const chatBox = document.getElementById('waChatBox');
  chatBox.classList.toggle('active');
};

window.handleChatSubmit = function(event) {
  if (event.key === 'Enter') {
    submitChat();
  }
};

window.submitChat = function() {
  const input = document.getElementById('chatInputField');
  const text = input.value.trim();
  if (!text) return;

  // Append user message
  appendWaMessage(text, true);
  input.value = "";

  // Mock typing response
  const body = document.getElementById('chatBody');
  const typingMsg = document.createElement('div');
  typingMsg.className = 'chat-msg';
  typingMsg.innerHTML = '<span style="font-style: italic; color: #8e8e8e;">Typing...</span>';
  body.appendChild(typingMsg);
  body.scrollTop = body.scrollHeight;

  setTimeout(() => {
    // Remove typing indicator
    typingMsg.remove();
    
    // Choose reply
    let replyText = "Thank you for reaching out! Let me know if you would like to book a braces consult or pediatric checkup. You can call us at 090220 13669.";
    const lower = text.toLowerCase();
    
    if (lower.includes('brace') || lower.includes('align') || lower.includes('ortho') || lower.includes('clip')) {
      replyText = "Hello! Yes, we specialize in Orthodontics. Dr. Amit Giri (MDS Orthodontist) offers metal, ceramic, self-ligating brackets, and clear aligners. Would you like to schedule a 3D assessment?";
    } else if (lower.includes('kid') || lower.includes('child') || lower.includes('pediatric') || lower.includes('baby')) {
      replyText = "Hello! For kids, Dr. Monica Giri is renowned for her extremely soft-spoken, smiling, and friendly approach. What is the age of your child? We make checkups fun!";
    } else if (lower.includes('root canal') || lower.includes('rct') || lower.includes('pain') || lower.includes('toothache')) {
      replyText = "Oh, tooth pain can be very uncomfortable. We specialize in painless single-visit Root Canal Treatment (RCT) using advanced rotary systems. Let's block a spot to resolve it quickly.";
    } else if (lower.includes('cost') || lower.includes('price') || lower.includes('fees') || lower.includes('charge') || lower.includes('rate')) {
      replyText = "We believe in transparent billing. General consult is ₹500. Painless RCT starts at ₹3,500, and braces range from ₹25,000 to ₹1,20,000 depending on brackets type. Installment options are available!";
    } else if (lower.includes('time') || lower.includes('hour') || lower.includes('open') || lower.includes('close') || lower.includes('timing')) {
      replyText = "We are open Monday to Saturday from 11:00 AM to 9:00 PM for late evening appointments. Sunday is by appointment only.";
    }

    appendWaMessage(replyText, false);
  }, 1500);
};

function appendWaMessage(text, isUser = false) {
  const body = document.getElementById('chatBody');
  const msg = document.createElement('div');
  msg.className = `chat-msg ${isUser ? 'user' : ''}`;
  
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  msg.innerHTML = `
    ${escapeHtml(text)}
    <span class="time">${timeStr}</span>
  `;
  
  body.appendChild(msg);
  body.scrollTop = body.scrollHeight;
}

/* ==========================================================================
   APPOINTMENT BOOKING & MODAL CONTROL
   ========================================================================== */
let activeBookingSource = 'general';

function initModal() {
  // Close modal clicking outside content
  const overlay = document.getElementById('bookingModal');
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeBookingModal();
    }
  });
  
  // Set date input to tomorrow as default
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  document.getElementById('formDate').value = tomorrowStr;
  document.getElementById('modalDate').value = tomorrowStr;
}

window.openBookingModal = function(source = 'general') {
  activeBookingSource = source;
  const modal = document.getElementById('bookingModal');
  modal.classList.add('active');
  
  const title = document.getElementById('modalTitle');
  const serviceSelect = document.getElementById('modalService');
  
  if (source.includes('Kids')) {
    title.textContent = "Book Kids Dental Visit";
    serviceSelect.value = "Kids Dentistry";
  } else if (source.includes('Braces') || source.includes('Aligner')) {
    title.textContent = "Book Braces Consultation";
    serviceSelect.value = "Braces Treatment";
  } else if (source === 'planner') {
    title.textContent = "Book Estimator Treatment";
    // Pre-select service based on active estimator tab
    if (currentTab === 'braces') serviceSelect.value = "Braces Treatment";
    else if (currentTab === 'rct') serviceSelect.value = "Painless Root Canal";
    else if (currentTab === 'crowns') serviceSelect.value = "Dental Crowns";
    else if (currentTab === 'kids') serviceSelect.value = "Kids Dentistry";
  } else {
    title.textContent = "Book Consultation";
    serviceSelect.value = "General Consultation";
  }
};

window.closeBookingModal = function() {
  const modal = document.getElementById('bookingModal');
  modal.classList.remove('active');
};

window.handleDirectBooking = function(event) {
  event.preventDefault();
  const name = document.getElementById('formName').value.trim();
  const phone = document.getElementById('formPhone').value.trim();
  const service = document.getElementById('formService').value;
  const date = document.getElementById('formDate').value;
  const notes = document.getElementById('formNotes').value.trim();
  
  saveAppointment(name, phone, service, date, "Evening (5:00 PM - 9:00 PM)", notes);
  
  // Reset
  document.getElementById('mainBookingForm').reset();
  initModal();
};

window.handleModalBooking = function(event) {
  event.preventDefault();
  const name = document.getElementById('modalName').value.trim();
  const phone = document.getElementById('modalPhone').value.trim();
  const service = document.getElementById('modalService').value;
  const date = document.getElementById('modalDate').value;
  const time = document.getElementById('modalTime').value;
  
  saveAppointment(name, phone, service, date, time, `Modal Booking from source: ${activeBookingSource}`);
  
  // Close
  closeBookingModal();
  document.getElementById('modalBookingForm').reset();
  initModal();
};

function saveAppointment(name, phone, service, date, time, notes) {
  const appointments = JSON.parse(localStorage.getItem('tnb_appointments')) || [];
  
  const appt = {
    id: Date.now(),
    name: name,
    phone: phone,
    service: service,
    date: date,
    time: time,
    notes: notes,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  appointments.push(appt);
  localStorage.setItem('tnb_appointments', JSON.stringify(appointments));
  
  showToast(`Booking request submitted for ${name}! We will contact you soon. 📞`);
}

/* ==========================================================================
   TOAST NOTIFICATION UTILS
   ========================================================================== */
function showToast(message) {
  const toast = document.getElementById('toastNotification');
  const msgNode = document.getElementById('toastMessage');
  
  msgNode.textContent = message;
  toast.classList.add('active');
  
  setTimeout(() => {
    toast.classList.remove('active');
  }, 3000);
}
