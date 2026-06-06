/* ==========================================================================
   INTERACTIVE APP CODE - JAIN DENTOFACIAL HUB
   ========================================================================== */

// Global State
let selectedRating = 5;
let currentPlannerCategory = 'rct';
let selectedPlannerOptions = {
  rct: 'single',
  aligners: 'invisible',
  implants: 'premium',
  cleaning: 'ultrasonic'
};

// Initial Sample Data (if localStorage is empty)
const defaultReviews = [
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

const defaultAppointments = [
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

// Document Ready Initialize
document.addEventListener("DOMContentLoaded", () => {
  // Initialize Local Storage for Reviews & Appointments
  if (!localStorage.getItem("jain_hub_reviews")) {
    localStorage.setItem("jain_hub_reviews", JSON.stringify(defaultReviews));
  }
  if (!localStorage.getItem("jain_hub_appointments")) {
    localStorage.setItem("jain_hub_appointments", JSON.stringify(defaultAppointments));
  }

  // Set minimum date on date picker to today
  const today = new Date().toISOString().split('T')[0];
  const dateInputs = [document.getElementById('formDate'), document.getElementById('modalDate')];
  dateInputs.forEach(input => {
    if (input) input.min = today;
  });

  // Render Reviews
  renderReviewsFeed();

  // Mobile menu toggle
  const hamburger = document.getElementById("hamburgerMenu");
  const navLinks = document.getElementById("navLinks");
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      const active = navLinks.classList.toggle("active");
      hamburger.setAttribute("aria-expanded", active);
    });

    // Close menu on link click
    document.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Sticky header on scroll
  const header = document.getElementById("mainHeader");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
    highlightActiveNavLink();
  });

  // Set chat message timestamp to current time
  const chatTime = document.getElementById("chatTime");
  if (chatTime) {
    const now = new Date();
    chatTime.innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Initialize planner
  updatePlannerResult();
});

/* ==========================================================================
   NAVIGATION LOGIC
   ========================================================================== */
function highlightActiveNavLink() {
  const sections = document.querySelectorAll("section[id]");
  const scrollY = window.pageYOffset;

  sections.forEach(current => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 150;
    const sectionId = current.getAttribute("id");
    const link = document.querySelector(`.nav-links a[href*=${sectionId}]`);

    if (link) {
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelectorAll(".nav-link").forEach(el => el.classList.remove("active"));
        link.classList.add("active");
      }
    }
  });
}

/* ==========================================================================
   BOOKING MODAL & SUBMISSION
   ========================================================================== */
function openBookingModal(source = '') {
  const modal = document.getElementById("bookingModal");
  modal.classList.add("active");
  document.body.style.overflow = "hidden";

  // Pre-fill selection based on source
  if (source === 'planner') {
    const serviceSelect = document.getElementById("modalService");
    if (currentPlannerCategory === 'rct') {
      serviceSelect.value = "Laser Root Canal Treatment";
    } else if (currentPlannerCategory === 'aligners') {
      serviceSelect.value = "Invisible Braces";
    } else if (currentPlannerCategory === 'implants') {
      serviceSelect.value = "Dental Implants";
    } else if (currentPlannerCategory === 'cleaning') {
      serviceSelect.value = "Teeth Cleaning";
    }
  }
}

function closeBookingModal() {
  const modal = document.getElementById("bookingModal");
  modal.classList.remove("active");
  document.body.style.overflow = "";
}

// Close modal when clicking outside content
window.addEventListener("click", (e) => {
  const modal = document.getElementById("bookingModal");
  if (e.target === modal) {
    closeBookingModal();
  }
});

// Toast notification trigger
function showToast(message) {
  const toast = document.getElementById("toastNotification");
  const toastMsg = document.getElementById("toastMessage");
  if (toast && toastMsg) {
    toastMsg.innerText = message;
    toast.classList.add("active");
    setTimeout(() => {
      toast.classList.remove("active");
    }, 4000);
  }
}

// Handle Form Submissions & Save to LocalStorage
function saveAppointment(appointment) {
  const list = JSON.parse(localStorage.getItem("jain_hub_appointments")) || [];
  list.push(appointment);
  localStorage.setItem("jain_hub_appointments", JSON.stringify(list));
  
  // Custom event to alert admin panel if open
  window.dispatchEvent(new Event("appointmentsUpdated"));
}

function handleDirectBooking(event) {
  event.preventDefault();
  const name = document.getElementById("formName").value;
  const phone = document.getElementById("formPhone").value;
  const service = document.getElementById("formService").value;
  const date = document.getElementById("formDate").value;
  const notes = document.getElementById("formNotes").value;

  const newApp = {
    id: Date.now(),
    name,
    phone,
    service,
    date,
    time: "Evening (4:00 PM - 8:00 PM)", // Default for page form
    notes,
    status: "Pending",
    createdAt: new Date().toISOString()
  };

  saveAppointment(newApp);
  document.getElementById("mainBookingForm").reset();
  showToast("Appointment request submitted successfully! Dr. Surbhi will contact you shortly.");
}

function handleModalBooking(event) {
  event.preventDefault();
  const name = document.getElementById("modalName").value;
  const phone = document.getElementById("modalPhone").value;
  const service = document.getElementById("modalService").value;
  const date = document.getElementById("modalDate").value;
  const time = document.getElementById("modalTime").value;

  const newApp = {
    id: Date.now(),
    name,
    phone,
    service,
    date,
    time,
    notes: "Submitted via Quick Booking Modal.",
    status: "Pending",
    createdAt: new Date().toISOString()
  };

  saveAppointment(newApp);
  closeBookingModal();
  document.getElementById("modalBookingForm").reset();
  showToast("Appointment booked! Check your phone for confirmation soon.");
}

/* ==========================================================================
   TREATMENT PLANNER & CALCULATOR
   ========================================================================== */
function switchPlannerTab(tabName) {
  currentPlannerCategory = tabName;
  
  // Update tabs active state
  document.querySelectorAll(".planner-tab").forEach(tab => {
    tab.classList.remove("active");
    tab.setAttribute("aria-selected", "false");
  });
  const activeTab = document.getElementById(`tab${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`);
  if (activeTab) {
    activeTab.classList.add("active");
    activeTab.setAttribute("aria-selected", "true");
  }

  // Update panels active state
  document.querySelectorAll(".planner-step").forEach(step => {
    step.classList.remove("active");
  });
  const activeStep = document.getElementById(`plannerStep-${tabName}`);
  if (activeStep) {
    activeStep.classList.add("active");
  }

  updatePlannerResult();
}

function selectPlannerOption(category, option, element) {
  selectedPlannerOptions[category] = option;
  
  // Update option cards active UI
  const parent = element.parentElement;
  parent.querySelectorAll(".planner-option-card").forEach(card => {
    card.classList.remove("selected");
  });
  element.classList.add("selected");

  updatePlannerResult();
}

function updatePlannerResult() {
  const category = currentPlannerCategory;
  const option = selectedPlannerOptions[category];

  // Logic tables
  const data = {
    rct: {
      single: {
        title: "Single Visit Laser RCT Details",
        time: "1 session (approx. 45 mins)",
        laser: "Yes (Advanced Dental Laser)",
        cost: "₹3,500 - ₹5,500"
      },
      multi: {
        title: "Standard Multi-Visit RCT Details",
        time: "2 to 3 sessions (30 mins each)",
        laser: "Optional / Not included",
        cost: "₹2,500 - ₹4,000"
      }
    },
    aligners: {
      invisible: {
        title: "Invisible Clear Aligners (Invisalign) Details",
        time: "6 to 14 months",
        aesthetic: "100% Invisible, Removable & Comfort-fit",
        cost: "₹45,000 - ₹1,20,000"
      },
      ceramic: {
        title: "Ceramic & Metallic Braces Details",
        time: "12 to 18 months",
        aesthetic: "Semi-visible (Ceramic) or Metallic brackets",
        cost: "₹22,000 - ₹45,000"
      }
    },
    implants: {
      premium: {
        title: "Premium Titanium Implant (Global Brands)",
        time: "2 to 3 months healing period",
        lifespan: "Lifetime durability (Warranty included)",
        cost: "₹25,000 - ₹40,000"
      },
      standard: {
        title: "Standard Dental Implant Details",
        time: "3 to 4 months healing period",
        lifespan: "10 - 15 years durability",
        cost: "₹18,000 - ₹25,000"
      }
    },
    cleaning: {
      ultrasonic: {
        title: "Ultrasonic Scaling & Plaque Clean Details",
        time: "1 session (30 mins)",
        freq: "Once every 6 months",
        cost: "₹1,000 - ₹2,000"
      },
      polishing: {
        title: "Scaling, Polishing & Stain Removal Details",
        time: "1 session (45 mins)",
        freq: "Once every 6 months / pre-event",
        cost: "₹1,500 - ₹2,800"
      }
    }
  };

  const choice = data[category][option];

  if (category === 'rct') {
    document.getElementById("rctResultTitle").innerText = choice.title;
    document.getElementById("rctResultTime").innerText = choice.time;
    document.getElementById("rctResultLaser").innerText = choice.laser;
    document.getElementById("rctResultCost").innerText = choice.cost;
  } else if (category === 'aligners') {
    document.getElementById("alignerResultTitle").innerText = choice.title;
    document.getElementById("alignerResultTime").innerText = choice.time;
    document.getElementById("alignerResultAesthetic").innerText = choice.aesthetic;
    document.getElementById("alignerResultCost").innerText = choice.cost;
  } else if (category === 'implants') {
    document.getElementById("implantsResultTitle").innerText = choice.title;
    document.getElementById("implantsResultTime").innerText = choice.time;
    document.getElementById("implantsResultLifespan").innerText = choice.lifespan;
    document.getElementById("implantsResultCost").innerText = choice.cost;
  } else if (category === 'cleaning') {
    document.getElementById("cleaningResultTitle").innerText = choice.title;
    document.getElementById("cleaningResultTime").innerText = choice.time;
    document.getElementById("cleaningResultFreq").innerText = choice.freq;
    document.getElementById("cleaningResultCost").innerText = choice.cost;
  }
}

/* ==========================================================================
   INSTAGRAM INTERACTION
   ========================================================================== */
let isLiked = false;
function toggleInstaHeart() {
  const heart = document.getElementById("instaHeartBtn");
  const countSpan = document.getElementById("instaLikesCount");
  let count = parseInt(countSpan.innerText);

  if (!isLiked) {
    heart.className = "fa-solid fa-heart";
    countSpan.innerText = count + 1;
    isLiked = true;
  } else {
    heart.className = "fa-regular fa-heart";
    countSpan.innerText = count - 1;
    isLiked = false;
  }
}

/* ==========================================================================
   PATIENT REVIEWS & FEEDBACK HUBS
   ========================================================================== */
function toggleReviewForm() {
  const form = document.getElementById("reviewForm");
  form.classList.toggle("active");
  const btn = document.getElementById("writeReviewBtn");
  if (form.classList.contains("active")) {
    btn.innerText = "Cancel Review";
  } else {
    btn.innerText = "Write a Review";
  }
}

function setSelectRating(rating) {
  selectedRating = rating;
  const stars = document.getElementById("ratingStarsSelect").querySelectorAll("i");
  stars.forEach((star, index) => {
    if (index < rating) {
      star.classList.add("selected");
    } else {
      star.classList.remove("selected");
    }
  });
}

function handleReviewSubmit(event) {
  event.preventDefault();
  const name = document.getElementById("reviewName").value;
  const text = document.getElementById("reviewText").value;
  const todayDate = new Date().toISOString().split('T')[0];

  const newReview = {
    id: Date.now(),
    name,
    rating: selectedRating,
    text,
    date: todayDate,
    reply: ""
  };

  const reviews = JSON.parse(localStorage.getItem("jain_hub_reviews")) || [];
  reviews.unshift(newReview);
  localStorage.setItem("jain_hub_reviews", JSON.stringify(reviews));

  // Reset form and hide it
  document.getElementById("reviewForm").reset();
  setSelectRating(5);
  toggleReviewForm();

  // Re-render feed
  renderReviewsFeed();
  showToast("Thank you! Your feedback has been published.");
  
  // Custom event to sync admin panel if open
  window.dispatchEvent(new Event("reviewsUpdated"));
}

function renderReviewsFeed() {
  const reviews = JSON.parse(localStorage.getItem("jain_hub_reviews")) || [];
  const feed = document.getElementById("reviewsFeed");
  if (!feed) return;

  feed.innerHTML = "";

  // Update overall counters
  let totalRating = 0;
  reviews.forEach(r => totalRating += r.rating);
  const avg = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : "4.8";
  
  document.getElementById("avgRatingScore").innerText = avg;
  document.getElementById("verifiedReviewsCount").innerText = reviews.length;

  // Render stars on overview card
  const avgStarsDiv = document.getElementById("avgRatingStars");
  avgStarsDiv.innerHTML = "";
  const fullStars = Math.floor(avg);
  const hasHalf = avg % 1 >= 0.5;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      avgStarsDiv.innerHTML += '<i class="fa-solid fa-star"></i> ';
    } else if (i === fullStars + 1 && hasHalf) {
      avgStarsDiv.innerHTML += '<i class="fa-solid fa-star-half-stroke"></i> ';
    } else {
      avgStarsDiv.innerHTML += '<i class="fa-regular fa-star"></i> ';
    }
  }

  // Render individual review cards
  reviews.forEach(review => {
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
          <h5>Response from Dr. Surbhi Pande:</h5>
          <p>${review.reply}</p>
        </div>
      `;
    }

    const avatarInitial = review.name ? review.name.charAt(0).toUpperCase() : "P";

    const card = document.createElement("article");
    card.className = "review-item-card";
    card.innerHTML = `
      <div class="review-item-header">
        <div class="review-user-meta">
          <div class="review-user-avatar">${avatarInitial}</div>
          <div class="review-user-name">
            <h4>${review.name}</h4>
            <span class="review-date">${review.date}</span>
          </div>
        </div>
        <div class="review-item-stars">
          ${starsHtml}
        </div>
      </div>
      <p class="review-item-text">"${review.text}"</p>
      ${replyHtml}
    `;

    feed.appendChild(card);
  });
}

/* ==========================================================================
   FAQ ACCORDION
   ========================================================================== */
function toggleFaq(button) {
  const item = button.parentElement;
  const answer = button.nextElementSibling;
  const isOpen = item.classList.contains("active");

  // Close other FAQs
  document.querySelectorAll(".faq-item").forEach(otherItem => {
    if (otherItem !== item) {
      otherItem.classList.remove("active");
      otherItem.querySelector(".faq-answer").style.maxHeight = null;
      otherItem.querySelector(".faq-question").setAttribute("aria-expanded", "false");
    }
  });

  if (!isOpen) {
    item.classList.add("active");
    answer.style.maxHeight = answer.scrollHeight + "px";
    button.setAttribute("aria-expanded", "true");
  } else {
    item.classList.remove("active");
    answer.style.maxHeight = null;
    button.setAttribute("aria-expanded", "false");
  }
}

/* ==========================================================================
   WHATSAPP CHAT BOT INTERACTIONS
   ========================================================================== */
function toggleChatBox() {
  const chatBox = document.getElementById("waChatBox");
  chatBox.classList.toggle("active");
}

function handleChatSubmit(event) {
  if (event.key === "Enter") {
    submitChat();
  }
}

function submitChat() {
  const input = document.getElementById("chatInputField");
  const msgText = input.value.trim();
  if (!msgText) return;

  const chatBody = document.getElementById("chatBody");
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Add User Message
  const userMsg = document.createElement("div");
  userMsg.className = "chat-msg user";
  userMsg.innerHTML = `
    ${msgText}
    <span class="time">${timeStr}</span>
  `;
  chatBody.appendChild(userMsg);
  input.value = "";
  chatBody.scrollTop = chatBody.scrollHeight;

  // Simulate Doctor Reply and redirect to Whatsapp Web
  setTimeout(() => {
    const doctorMsg = document.createElement("div");
    doctorMsg.className = "chat-msg";
    doctorMsg.innerHTML = `
      Thanks for writing! Let's connect directly on WhatsApp to answer your specific questions or book a quick spot.
      <span class="time">${timeStr}</span>
    `;
    chatBody.appendChild(doctorMsg);
    chatBody.scrollTop = chatBody.scrollHeight;

    // Open actual WhatsApp after 1.5 seconds delay with the pre-filled text
    setTimeout(() => {
      const waUrl = `https://wa.me/919552580290?text=${encodeURIComponent("Hello Dr. Surbhi, I have a dental query from your website: " + msgText)}`;
      window.open(waUrl, "_blank");
    }, 1500);
  }, 1000);
}
