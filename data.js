/* =========================================================
   🚀 LESS. PLATFORM CONTROL ROOM (DATA FILE)
   =========================================================
   Is file me apne naye videos aur links add karte jao.
   System khud samajh jayega ki kahan kya lagana hai.
========================================================= */

const systemData = [
    
    // --- 📱 SHORTS VIDEO 1 ---
    {
        id: 1,
        category: "shorts", 
        title: "Exclusive Edit 1",
        desc: "Pehli dhamakedar video ka preview.",
        
        // Aapka YouTube Shorts Ad ID
        ytAdId: "T0VyWKXz0Ow", 
        adTime: 5, // 5 second ka Ad
        
        // ORIGINAL VIDEO LINK (Dhyan rahe: Yahan Sendvid ka direct .mp4 link dalna hai)
        originalUrl: "https://sendvid.com/7fv3zl41.mp4", // .mp4 format zaroori hai
        
        // Actor Profile
        actorId: "actor_1", 
        actorName: "Creator One",
        actorBio: "Checkout my exclusive edits. Subscribe for more!",
        actorPic: "https://i.pravatar.cc/150?u=actor1", 
        thumbnail: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=300&q=80" 
    },

    // --- 📱 SHORTS VIDEO 2 ---
    {
        id: 2,
        category: "shorts", 
        title: "Exclusive Edit 2",
        desc: "Dusri OP video jo sabko pasand aayegi.",
        
        // Aapka YouTube Shorts Ad ID (Same ad laga sakte hain)
        ytAdId: "T0VyWKXz0Ow", 
        adTime: 5, 
        
        // ORIGINAL VIDEO LINK 
        originalUrl: "https://sendvid.com/rwcor9fi.mp4", // .mp4 format zaroori hai
        
        actorId: "actor_2", 
        actorName: "Creator Two",
        actorBio: "Action and drama edits.",
        actorPic: "https://i.pravatar.cc/150?u=actor2",
        thumbnail: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
    },

    // --- 🎬 MOVIE ENTRY EXAMPLE ---
    {
        id: 3,
        category: "movie", // "movie" likhne se ye automatically left swipe wale Movies Catalogue me chala jayega
        title: "Dark Forest Movie",
        desc: "Watch the full length movie.",
        
        ytAdId: "T0VyWKXz0Ow", 
        adTime: 8, // Movie se pehle 8 second ka ad
        originalUrl: "https://vjs.zencdn.net/v/oceans.mp4", // Example MP4
        
        actorId: "actor_1", // Same ID as video 1, toh ye video usi actor ki profile me jayegi
        actorName: "Creator One",
        actorBio: "Checkout my exclusive edits. Subscribe for more!",
        actorPic: "https://i.pravatar.cc/150?u=actor1",
        thumbnail: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=300&q=80"
    }
];
