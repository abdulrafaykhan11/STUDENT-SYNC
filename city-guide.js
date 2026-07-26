// Top 5 Universities Dynamic Data
const studentData = {
  ned: {
    uniName: "NED University / Karachi University (KU)",
    areas: [
      "Gulshan-e-Iqbal (Block 1, 6, 7 & 13D)",
      "University Road / Abul Hasan Isphahani Road",
      "Nipa & Mosamiyat Area"
    ],
    hostels: [
      "Official University Hostels (Merit-based)",
      "Private Boys/Girls Hostels (Mosamiyat & Abul Hasan Road)",
      "Shared Rental Flats in Gulshan-e-Iqbal"
    ],
    food: [
      "Hostel Mess System (Monthly 3-time meals)",
      "University Road Dhabas & Tiffin Services",
      "Mess Tiffin Facility (Delivery to rooms)"
    ],
    budget: {
      hostel: "PKR 10,000 - 16,000",
      food: "PKR 8,000 - 12,000",
      transport: "PKR 3,000 - 5,000 (Point Service / Bus)",
      total: "PKR 21,000 - 33,000"
    },
    proTip: "KU aur NED ke aas-paas Mosamiyat aur Abul Hasan Isphahani road par sab se saste private hostels aur student mess milte hain."
  },

  iba: {
    uniName: "IBA Karachi (Main Campus & City Campus)",
    areas: [
      "Main Campus: University Road / Gulshan-e-Iqbal",
      "City Campus: Saddar, Garden East, PECHS"
    ],
    hostels: [
      "IBA On-Campus Boys & Girls Hostels (Top Class)",
      "Private Student Hostels near Saddar / Line Lines (City Campus)",
      "Shared Apartments in PECHS / Gulshan"
    ],
    food: [
      "IBA Campus Canteen / Mess",
      "PECHS & Saddar Mess Services",
      "Local Restaurants (Zameer Ansari, Food Street)"
    ],
    budget: {
      hostel: "PKR 15,000 - 25,000",
      food: "PKR 10,000 - 15,000",
      transport: "PKR 4,000 - 7,000",
      total: "PKR 29,000 - 47,000"
    },
    proTip: "Agar Main Campus hai to University Hostel pehla option rakhein. City Campus ke liye PECHS ya Garden East me flats sharing best hain."
  },

  fast: {
    uniName: "FAST-NUCES (National Highway)",
    areas: [
      "Malir Cantt & Scheme 33",
      "Gulshan-e-Maymar",
      "Shah Latif Town / Port Qasim Housing"
    ],
    hostels: [
      "Private Hostels in Scheme 33 & Malir",
      "Shared Flats in Gulshan-e-Maymar",
      "University Recommended Private Hostels"
    ],
    food: [
      "FAST Campus Cafeteria",
      "Malir Cantt Food Outlets",
      "Monthly Mess Delivery Services"
    ],
    budget: {
      hostel: "PKR 10,000 - 18,000",
      food: "PKR 9,000 - 13,000",
      transport: "PKR 5,000 - 8,000 (Point Service)",
      total: "PKR 24,000 - 39,000"
    },
    proTip: "FAST University city se thori door hai, is liye 'University Point/Van' laznmi avail karein aur housing Malir Cantt ya Scheme 33 me dekhein."
  },

  dow: {
    uniName: "Dow University (Ojha Campus & City Campus)",
    areas: [
      "Ojha Campus: Safoora Chowrangi, Scheme 33, Gulshan-e-Iqbal",
      "City Campus: Civil Hospital Area, Garden, Saddar"
    ],
    hostels: [
      "DOW Official Hostels (Limited seats)",
      "Private Medical Student Hostels near Safoora",
      "PECHS / Saddar Working & Student Hostels"
    ],
    food: [
      "Hospital Canteen & Mess",
      "Safoora Chowrangi Local Mess Options",
      "Self Cooking / Tiffin Service"
    ],
    budget: {
      hostel: "PKR 12,000 - 20,000",
      food: "PKR 9,000 - 14,000",
      transport: "PKR 3,000 - 6,000",
      total: "PKR 24,000 - 40,000"
    },
    proTip: "Medical students ke liye late hours study hoti hai, is liye Safoora Chowrangi ya Scheme 33 me walking-distance accommodation preferred hai."
  },

  szabist: {
    uniName: "SZABIST / DHA Suffa (Clifton & DHA)",
    areas: [
      "Clifton (Block 2, 5)",
      "DHA Phase 1, Phase 2 Extension, Gizri",
      "PECHS (Near Nursery)"
    ],
    hostels: [
      "Private Hostels in DHA Phase 2 Ext / Gizri",
      "Paying Guest (PG) Rooms in Clifton",
      "Shared Apartments in PECHS"
    ],
    food: [
      "Gizri Commercial Local Mess",
      "PECHS Tiffin Services",
      "Clifton / Defence Cafes & Fast Food"
    ],
    budget: {
      hostel: "PKR 18,000 - 30,000",
      food: "PKR 12,000 - 18,000",
      transport: "PKR 5,000 - 9,000 (Bykea / Bus / Careem)",
      total: "PKR 35,000 - 57,000"
    },
    proTip: "Clifton aur DHA me rent zyada hota hai. Student groups ban kar PECHS ya Gizri me 2-bedroom flat share karte hain to budget control me rehta hai."
  }
};

// Function to render content
function renderGuide(uniKey) {
  const data = studentData[uniKey];
  const container = document.getElementById("guideContent");

  container.innerHTML = `
    <!-- Rehaish/Areas Card -->
    <div class="info-card">
      <h3>📍 Qareebi Behtareen Ilake (Areas)</h3>
      <ul>
        ${data.areas.map(area => `<li><strong>${area}</strong></li>`).join('')}
      </ul>
    </div>

    <!-- Hostel Options Card -->
    <div class="info-card">
      <h3>🏠 Rehaish (Hostel / Flat Options)</h3>
      <ul>
        ${data.hostels.map(hostel => `<li>${hostel}</li>`).join('')}
      </ul>
    </div>

    <!-- Khana/Mess Card -->
    <div class="info-card">
      <h3>🍲 Khane Ka Intezam (Mess & Food)</h3>
      <ul>
        ${data.food.map(f => `<li>${f}</li>`).join('')}
      </ul>
    </div>

    <!-- Monthly Expense Breakdown -->
    <div class="info-card budget-box">
      <h3>💰 Monthly Andaazatan Akhrajaat (Monthly Budget)</h3>
      <p style="margin-top: 5px; color: #555;">${data.proTip}</p>
      
      <div class="budget-grid">
        <div class="budget-item">
          Room / Hostel Rent
          <span>${data.budget.hostel}</span>
        </div>
        <div class="budget-item">
          Food / Mess
          <span>${data.budget.food}</span>
        </div>
        <div class="budget-item">
          Local Transport
          <span>${data.budget.transport}</span>
        </div>
        <div class="budget-item">
          Total Expected
          <span>${data.budget.total}</span>
        </div>
      </div>
    </div>
  `;
}

// Event Listener for Dropdown Change
document.getElementById("uniSelect").addEventListener("change", (e) => {
  renderGuide(e.target.value);
});

// Initial Render (Default NED/KU)
renderGuide("ned");