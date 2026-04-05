/* =========================================
   1. FIREBASE SETUP (Safe Mode)
   ========================================= */
try {
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
        projectId: "YOUR_PROJECT_ID"
    };
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const provider = new firebase.auth.GoogleAuthProvider();

    auth.onAuthStateChanged((user) => {
        const loggedOut = document.getElementById('loggedOutUI');
        const loggedIn = document.getElementById('loggedInUI');
        if (user) {
            if(loggedOut) loggedOut.style.display = 'none';
            if(loggedIn) {
                loggedIn.style.display = 'block';
                document.getElementById('userGoogleName').innerText = user.displayName;
                document.getElementById('userGooglePic').src = user.photoURL;
            }
        } else {
            if(loggedOut) loggedOut.style.display = 'block';
            if(loggedIn) loggedIn.style.display = 'none';
        }
    });

    window.signInWithGoogle = () => auth.signInWithPopup(provider).catch(e => console.error(e));
    window.signOut = () => auth.signOut();
} catch(e) { console.log("Firebase bypass active."); }

/* =========================================
   2. ENGINE CORE & DATA LOAD
   ========================================= */
let videoList = [...systemData];
videoList.sort(() => Math.random() - 0.5); 

const feed = document.getElementById('mainFeed');
const state = {}; 

function renderFeed() {
    feed.innerHTML = '';
    videoList.forEach((vid) => {
        // State initialize
        state[vid.id] = { adWatched: false, timerRunning: false }; 
        
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
            <div class="ad-timer" id="timer-${vid.id}" style="display:none;">Ad: ${vid.adTime}s</div>
            <div class="info-bar">
                <h2 class="movie-title">${vid.title}</h2>
                <p class="desc">${vid.desc}</p>
            </div>
            <div class="side-actions">
                <div class="actor-profile-btn"><img src="${vid.actorPic}" alt="P"></div>
                <div class="action-item" onclick="toggleLike(this)"><i class="fa-solid fa-heart action-icon"></i><span class="action-text">Like</span></div>
                <div class="action-item"><i class="fa-solid fa-plus action-icon"></i><span class="action-text">List</span></div>
                <div class="action-item"><i class="fa-solid fa-share action-icon"></i><span class="action-text">Share</span></div>
            </div>
        `;
        feed.appendChild(reel);
    });
    startObserving();
}

/* =========================================
   3. TIMER & AD LOGIC (FIXED)
   ========================================= */
function startObserving() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const vidId = entry.target.dataset.id;
            const data = videoList.find(v => v.id == vidId);
            const timerEl = document.getElementById(`timer-${vidId}`);
            const ytFrame = document.getElementById(`yt-frame-${vidId}`);
            const adLayer = document.getElementById(`ad-layer-${vidId}`);
            const mainLayer = document.getElementById(`main-layer-${vidId}`);
            const mainPlayer = document.getElementById(`player-${vidId}`);

            if (entry.isIntersecting) {
                console.log("Video in view:", vidId);
                
                if (!state[vidId].adWatched && !state[vidId].timerRunning) {
                    state[vidId].timerRunning = true;
                    feed.classList.add('no-scroll'); // Lock Scroll
                    
                    let timeLeft = parseInt(data.adTime);
                    timerEl.style.display = 'block';
                    timerEl.innerText = `Ad: ${timeLeft}s`;
                    
                    // YouTube Ad Load
                    ytFrame.src = `https://www.youtube.com/embed/${data.ytAdId}?autoplay=1&controls=0&mute=1&playsinline=1&modestbranding=1`;

                    const countdown = setInterval(() => {
                        timeLeft--;
                        console.log(`Video ${vidId} timer: ${timeLeft}`);
                        
                        if (timerEl) timerEl.innerText = `Ad: ${timeLeft}s`;

                        if (timeLeft <= 0) {
                            clearInterval(countdown);
                            console.log("Timer finished for:", vidId);
                            
                            state[vidId].adWatched = true;
                            state[vidId].timerRunning = false;
                            
                            timerEl.style.display = 'none';
                            ytFrame.src = ""; // Stop Ad
                            feed.classList.remove('no-scroll'); // Unlock
                            
                            adLayer.classList.remove('active-layer');
                            mainLayer.classList.add('active-layer');
                            mainPlayer.src = data.originalUrl;
                        }
                    }, 1000);

                    // Safety: Agar user scroll kar jaye (forcefully) toh timer clear ho
                    state[vidId].currentInterval = countdown;
                } else if (state[vidId].adWatched) {
                    mainLayer.classList.add('active-layer');
                    if(!mainPlayer.src.includes("sendvid")) mainPlayer.src = data.originalUrl;
                }
            } else {
                // Video Out of View
                if (state[vidId].currentInterval) {
                    clearInterval(state[vidId].currentInterval);
                    state[vidId].timerRunning = false;
                }
                if (mainPlayer) mainPlayer.src = "";
                if (!state[vidId].adWatched) {
                    if(ytFrame) ytFrame.src = "";
                    feed.classList.remove('no-scroll');
                }
            }
        });
    }, { threshold: 0.8 }); // 80% video dikhegi tabhi shuru hoga

    document.querySelectorAll('.reel').forEach(r => observer.observe(r));
}

renderFeed();

/* =========================================
   4. SWIPE GESTURES
   ========================================= */
const leftSidebar = document.getElementById('leftSidebar');
const rightSidebar = document.getElementById('rightMoviesSidebar');
const overlay = document.getElementById('sidebarOverlay');
let touchstartX = 0; let touchendX = 0;

document.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; });
document.addEventListener('touchend', e => { 
    touchendX = e.changedTouches[0].screenX; 
    const dist = touchendX - touchstartX;
    if (dist < -50) { // Swipe Left (Movies)
        if (leftSidebar.classList.contains('open')) closeSidebars();
        else openMoviesList();
    }
    if (dist > 50) { // Swipe Right (Profile/Back)
        if (rightSidebar.classList.contains('open')) closeSidebars();
        else toggleLeftMenu();
    }
});

function toggleLeftMenu() { leftSidebar.classList.add('open'); overlay.style.display = 'block'; }
function closeSidebars() { leftSidebar.classList.remove('open'); rightSidebar.classList.remove('open'); overlay.style.display = 'none'; }
function openMoviesList() {
    const grid = document.getElementById('moviesCatalogueGrid');
    const movies = videoList.filter(v => v.category === 'movie');
    grid.innerHTML = movies.map(vid => `
        <div class="grid-item"><img src="${vid.thumbnail}" alt="T"><div class="views">Play</div></div>
    `).join('');
    rightSidebar.classList.add('open'); overlay.style.display = 'block';
}
function toggleLike(btn) { btn.querySelector('.action-icon').classList.toggle('liked'); }
