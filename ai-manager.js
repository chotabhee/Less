/* =========================================
   🧠 AI AUTO-MANAGER (Code ko haath mat lagana)
   ========================================= */

window.actorDatabase = {}; // Auto-generated profiles
window.processedData = []; // Auto-formatted videos

rawUploads.forEach((raw, index) => {
    
    // 1. AI CATEGORY DETECTION (Title padh kar samajhna)
    let titleLower = raw.title.toLowerCase();
    let isMovie = titleLower.includes('movie') || titleLower.includes('film') || titleLower.includes('full');
    let category = isMovie ? 'movie' : 'shorts';

    // 2. GENRE DETECTION
    let genre = [];
    if (titleLower.includes('action')) genre.push('action');
    if (titleLower.includes('horror') || titleLower.includes('dark')) genre.push('horror');
    if (titleLower.includes('romance') || titleLower.includes('love')) genre.push('romance');
    if (genre.length === 0) genre.push('all');

    // 3. AI ACTOR MANAGEMENT (Purana Update, Naya Create)
    let safeActorName = raw.actorName ? raw.actorName.trim() : "Unknown Creator";
    
    // Naam se unique ID banana (e.g., "Shraddha Kapoor" -> "shraddha_kapoor")
    let actorId = safeActorName.toLowerCase().replace(/[^a-z0-9]/g, '_');

    // Agar actor database me NAYI hai, toh account banao
    if (!window.actorDatabase[actorId]) {
        window.actorDatabase[actorId] = {
            id: actorId,
            name: safeActorName,
            pic: raw.actorPic || "https://i.pravatar.cc/150", // default pic
            followers: Math.floor(Math.random() * 5000 + 100) + 'K', // Auto fake followers
            videoCount: 0
        };
        console.log(`🤖 AI: Created New Profile for -> ${safeActorName}`);
    } else {
        // Agar actor PURANI hai, toh pic update kar do (if new pic is provided)
        if (raw.actorPic) window.actorDatabase[actorId].pic = raw.actorPic;
        console.log(`🤖 AI: Updated Existing Profile for -> ${safeActorName}`);
    }

    // 4. FORMAT VIDEO DATA
    let videoData = {
        id: "vid_" + index + "_" + Math.random().toString(36).substr(2, 5), // Auto Unique ID
        category: category,
        title: raw.title,
        desc: raw.desc || "Exclusive content.",
        ytAdId: raw.ytAdId || "T0VyWKXz0Ow", // Default Ad
        adTime: raw.adTime || 5, // Default 5s
        originalUrl: raw.videoLink,
        actorId: actorId,
        actorName: window.actorDatabase[actorId].name,
        actorPic: window.actorDatabase[actorId].pic,
        thumbnail: raw.thumbnail || "https://via.placeholder.com/300x500",
        genre: genre
    };

    window.actorDatabase[actorId].videoCount++;
    window.processedData.push(videoData);
});

console.log("✅ AI Manager: All Data Sorted Successfully!", window.processedData);
