/* =========================================================
   🚀 LESS. PLATFORM CONTROL ROOM (DATA FILE)
   =========================================================
   Bhai, ab se aapko HTML, CSS ya App.js ko touch nahi karna.
   Sirf is file me apne naye videos aur links add karte jao.
   System (Algorithm) khud samajh jayega ki isko kahan lagana hai.
========================================================= */

const systemData = [
    
    // --- 📱 SHORTS VIDEO ENTRY ---
    {
        id: 1,
        // 1. CATEGORY: Yahan likho "shorts" ya "movie"
        category: "shorts", 
        title: "Paimon OP Edit",
        tags: "Trending • 4K",
        desc: "Best moments in vertical format.",
        
        // 2. VIDEO LINKS (YouTube Ad + Original Video)
        ytAdId: "T0VyWKXz0Ow", // YouTube Short Ad ka ID
        adTime: 3, // Ad kitne second chalana hai
        originalUrl: "https://vjs.zencdn.net/v/oceans.mp4", // Original Native Video Link (.mp4)
        
        // 3. ACTOR / CREATOR PROFILE (Algorithm khud iski profile page bana dega)
        actorId: "paimon_1", // Koi bhi unique short naam (dhyan rahe same actor ke liye same ID use karein)
        actorName: "PaimonHindi",
        actorBio: "Gaming Creator & Editor. Subscribe for more!",
        actorPic: "https://i.pravatar.cc/150?u=paimon", // Profile Photo Link
        thumbnail: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=300&q=80" // Grid/Profile me dikhne wala poster
    },

    // --- 🎬 FULL MOVIE ENTRY ---
    {
        id: 2,
        // Yahan "movie" likha hai, toh ye left swipe wale "Movies Catalogue" me apne aap jayega
        category: "movie", 
        title: "Scarlett Action Full",
        tags: "Action • HD",
        desc: "Watch the full action packed movie natively.",
        
        ytAdId: "T0VyWKXz0Ow", // Is movie ke aage konsa YT ad lagana hai
        adTime: 5, 
        originalUrl: "https://www.w3schools.com/html/mov_bbb.mp4", 
        
        actorId: "scarlett_j", 
        actorName: "Scarlett Johansson",
        actorBio: "Hollywood Action Star.",
        actorPic: "https://i.pravatar.cc/150?u=scarlett",
        thumbnail: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
    },

    // --- 📱 EK AUR SHORT ENTRY (Same Actor) ---
    {
        id: 3,
        category: "shorts", 
        title: "Scarlett BTS",
        tags: "BTS • Exclusive",
        desc: "Behind the scenes.",
        
        ytAdId: "T0VyWKXz0Ow", 
        adTime: 3, 
        originalUrl: "https://vjs.zencdn.net/v/oceans.mp4", 
        
        // AI Algorithm Magic: Kyunki iska "actorId" upar wali movie se match karta hai (scarlett_j),
        // System apne aap is video ko uski profile me daal dega! Alag se profile nahi banayega.
        actorId: "scarlett_j", 
        actorName: "Scarlett Johansson",
        actorBio: "Hollywood Action Star.",
        actorPic: "https://i.pravatar.cc/150?u=scarlett",
        thumbnail: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=300&q=80"
    }
    
    // Naya video dalna ho to upar wala block { ... } copy karke yahan paste karo!
];
