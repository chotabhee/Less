/* =========================================
   1. FIREBASE AUTHENTICATION (Google Login)
   ========================================= */
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

if (!firebase.apps.length) { firebase.initializeApp(firebaseConfig); }
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

auth.onAuthStateChanged((user) => {
    if (user) {
        document.getElementById('loggedOutUI').style.display = 'none';
        document.getElementById('loggedInUI').style.display = 'block';
        document.getElementById('userGoogleName').innerText = user.displayName;
        document.getElementById('userGooglePic').src = user.photoURL;
    } else {
        document.getElementById('loggedOutUI').style.display = 'block';
        document.getElementById('loggedInUI').style.display = 'none';
    }
});

function signInWithGoogle() { auth.signInWithPopup(provider).catch(e => alert(e.message)); }
function signOut() { auth.signOut(); }


/* =========================================
   2. ENGINE CORE & DATA LOAD
   ========================================= */
let videoList = [...systemData];
videoList.sort(() => Math.random() - 0.5); 

const feed = document.getElementById('mainFeed');
const state = {}; // Isme har video ka data alag save hoga

function renderFeed() {
    feed.innerHTML = '';
    videoList.forEach((vid) => {
        // Har video ko apna personal timer de rahe hain
        state[vid.id] = { adWatched: false, timerInterval: null }; 
        
        const reel = document.createElement('div');
        reel.className = `reel`;
        reel.dataset.id = vid.id;
        
        reel.innerHTML = `
            <div class="layer active-layer" id="ad-layer-${vid.id}">
                <iframe id="yt-frame-${vid.id}" src="" frameborder="0" style="width:100%; height:100%; pointer-events:none;"></iframe>
            </div>
            
            <div class="layer" id="main-layer-${vid.id}">
                <iframe id="player-${vid.id}" src="" frameborder="0" allowfullscreen style="width:100%; height:100%;"></iframe>
            </div>
            
            <div class="ad-timer" id="timer-${vid.id}">Ad: ${vid.adTime}s</div>
            
            <div class="info-bar">
                <h2 class="movie-title">${vid.title}</h2>
                <p class="desc">${vid.desc}</p>
            </div>
            
            <div class="side-actions">
                <div class="actor-profile-btn"><img src="${vid.actorPic}" alt="Profile"></div>
                <div class="action-item" onclick="toggleLike(this)"><i class="fa-solid fa-heart action-icon"></i><span class="action-text">Like</span></div>
                <div class="action-item"><i class="fa-solid fa-plus action-icon"></i><span class="action-text">List</span></div>
                <div class="action-item"><i class="fa-solid fa-share action-icon"></i><span class="action-text">Share</span></div>
            </div>
        `;
        feed.appendChild(reel);
    });
    observeVideos();
}
renderFeed();


/* =========================================
   3. AD LOGIC & TIMER (100% FIXED)
   ========================================= */
function observeVideos() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const vidId = entry.target.dataset.id;
            const data = videoList.find(v => v.id == vidId);
            const adLayer = document.getElementById(`ad-layer-${vidId}`);
            const mainLayer = document.getElementById(`main-layer-${vidId}`);
            const ytFrame = document.getElementById(`yt-frame-${vidId}`);
            const timerEl = document.getElementById(`timer-${vidId}`);
            const sendvidPlayer = document.getElementById(`player-${vidId}`);

            if (entry.isIntersecting) {
                // AGAR VIDEO SAAMNE AAYI HAI
                if (!state[vidId].adWatched) {
                    // 1. Swipe Lock karo
                    feed.style.overflowY = 'hidden'; 
                    
                    // 2. YT Ad start karo (Full mute & autoplay features ke sath)
                    timerEl.style.display = 'block';
                    ytFrame.src = `https://www.youtube.com/embed/${data.ytAdId}?autoplay=1&controls=0&modestbranding=1&rel=0&mute=1&playsinline=1`;
                    
                    let timeLeft = data.adTime;
                    timerEl.innerText = `Ad: ${timeLeft}s`;

                    // 3. Purana timer clear karo (safety ke liye)
                    if(state[vidId].timerInterval) clearInterval(state[vidId].timerInterval);

                    // 4. Sirf isi video ka timer start karo
                    state[vidId].timerInterval = setInterval(() => {
                        timeLeft--;
                        if(timerEl) timerEl.innerText = `Ad: ${timeLeft}s`;
                        
                        if (timeLeft <= 0) {
                            // AD KHATAM HO GAYA!
                            clearInterval(state[vidId].timerInterval);
                            timerEl.style.display = 'none';
                            ytFrame.src = ""; // Ad hatao
                            state[vidId].adWatched = true; 
                            
                            // Swipe Unlock karo
                            feed.style.overflowY = 'scroll'; 
                            
                            // Sendvid chalu karo
                            adLayer.classList.remove('active-layer');
                            mainLayer.classList.add('active-layer');
                            sendvidPlayer.src = data.originalUrl; 
                        }
                    }, 1000);
                } else {
                    // AD PEHLE HI DEKH LIYA HAI
                    mainLayer.classList.add('active-layer');
                    if(sendvidPlayer.src === "") sendvidPlayer.src = data.originalUrl;
                }
            } else {
                // AGAR SCROLL KARKE AAGE NIKAL GAYE
                
                // 1. Us video ka timer turant rok do
                if (state[vidId].timerInterval) {
                    clearInterval(state[vidId].timerInterval);
                }
                
                // 2. Video rok do (Background awaz band)
                sendvidPlayer.src = ""; 
                
                // 3. Agar ad poora nahi hua tha, toh YouTube bhi rok do aur swipe khol do
                if (!state[vidId].adWatched) {
                     ytFrame.src = ""; 
                     feed.style.overflowY = 'scroll'; 
                }
            }
        });
    }, { threshold: 0.7 });
    
    document.querySelectorAll('.reel').forEach(r => observer.observe(r));
}


/* =========================================
   4. MAGIC SWIPE GESTURES (LEFT & RIGHT)
   ========================================= */
const leftSidebar = document.getElementById('leftSidebar');
const rightSidebar = document.getElementById('rightMoviesSidebar');
const overlay = document.getElementById('sidebarOverlay');
let touchstartX = 0; let touchendX = 0;

document.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; });
document.addEventListener('touchend', e => { 
    touchendX = e.changedTouches[0].screenX; 
    const swipeDistance = touchendX - touchstartX;
    
    // Swipe Right se Left (👈) -> Open Movies
    if (swipeDistance < -50) {
        if (leftSidebar.classList.contains('open')) closeSidebars(); 
        else if (!rightSidebar.classList.contains('open')) openMoviesList(); 
    }
    
    // Swipe Left se Right (👉) -> SWIPE BACK (Close Movies) OR Open Profile
    if (swipeDistance > 50) { 
        if (rightSidebar.classList.contains('open')) closeSidebars(); 
        else if (!leftSidebar.classList.contains('open')) toggleLeftMenu(); 
    }
});

function toggleLeftMenu() { leftSidebar.classList.add('open'); overlay.style.display = 'block'; }
function closeSidebars() { leftSidebar.classList.remove('open'); rightSidebar.classList.remove('open'); overlay.style.display = 'none'; }

function openMoviesList() {
    const moviesGrid = document.getElementById('moviesCatalogueGrid');
    const moviesOnly = videoList.filter(v => v.category === 'movie');
    moviesGrid.innerHTML = '';
    moviesOnly.forEach(vid => {
        moviesGrid.innerHTML += `
            <div class="grid-item">
                <img src="${vid.thumbnail}" alt="Thumbnail">
                <div class="views"><i class="fa-solid fa-play"></i> Watch</div>
            </div>
        `;
    });
    rightSidebar.classList.add('open'); overlay.style.display = 'block';
}

function toggleLike(btn) { btn.querySelector('.action-icon').classList.toggle('liked'); }
