/* =========================================
   CORE ALGORITHM & SHORTS FEED ENGINE
   ========================================= */

// AI Manager ne pehle hi window.processedData bana diya hai, 
// Toh sidha shorts filter karo:
const shortsOnly = window.processedData.filter(v => v.category === 'shorts');
shortsOnly.sort(() => Math.random() - 0.5); // Shuffle Shorts

const feed = document.getElementById('mainFeed');
// ... (baki pura engine.js ka code same rahega) ...
