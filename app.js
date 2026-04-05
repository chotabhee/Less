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
const state = {};   

function renderFeed() {
    feed.innerHTML = '';
    videoList.forEach((vid) => {
        state[vid.id] = { adWatched: false }; 
        const reel = document.createElement('div');
        reel.className = `reel`;
        reel.dataset.id = vid.id;
        
        reel.innerHTML = `
            <div class="layer active-layer" id="ad-layer-${vid.id}">
                <iframe id="yt-frame-${vid.id}" src="https://www.youtube.com/embed/${vid.ytAdId}?autoplay=0&controls=0&modestbranding=1&rel=0&mute=1&enablejsapi=1" allow="autoplay"></iframe>
            </div>
            <div class="layer" id="main-layer-${vid.id}" onclick="togglePlayPause('player-${vid.id}')">
                <video id="player-${vid.id}" playsinline loop crossorigin>
                    <source src="${vid.originalUrl}" type="video/mp4">
                </video>
            </div>
            
            <div class="ad-timer" id="timer-${vid.id}">Ad: ${vid.adTime}s</div>
            
            <div class="info-bar">
                <h2 class="movie-title">${vid.title}</h2>
                <p class="desc">${vid.desc}</p>
            </div>
            
            <div class="side-actions">
                <div class="actor-profile-btn"><img src="${vid.actorPic}" alt="Actor"></div>
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

function togglePlayPause(playerId) {
    const video = document.getElementById(playerId);
    if(video.paused) video.play(); else video.pause();
}

/* =========================================
   3. AD LOGIC & SWIPE LOCK
   ========================================= */
function observeVideos() {
    let activeInterval = null;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const vidId = entry.target.dataset.id;
            const data = videoList.find(v => v.id == vidId);
            const adLayer = document.getElementById(`ad-layer-${vidId}`);
            const mainLayer = document.getElementById(`main-layer-${vidId}`);
            const ytFrame = document.getElementById(`yt-frame-${vidId}`);
            const timerEl = document.getElementById(`timer-${vidId}`);
            const nativePlayer = document.getElementById(`player-${vidId}`);

            if (entry.isIntersecting) {
                if (!state[vidId].adWatched) {
                    feed.style.overflowY = 'hidden'; // Lock Scroll
                    timerEl.style.display = 'block';
                    ytFrame.src = ytFrame.src.replace('autoplay=0', 'autoplay=1');
                    let timeLeft = data.adTime;
                    timerEl.innerText = `Ad: ${timeLeft}s`;

                    activeInterval = setInterval(() => {
                        timeLeft--; timerEl.innerText = `Ad: ${timeLeft}s`;
                        if (timeLeft <= 0) {
                            clearInterval(activeInterval);
                            timerEl.style.display = 'none';
                            ytFrame.src = ""; 
                            state[vidId].adWatched = true; 
                            feed.style.overflowY = 'scroll'; // Unlock Scroll
                            adLayer.classList.remove('active-layer');
                            mainLayer.classList.add('active-layer');
                            nativePlayer.play();
                        }
                    }, 1000);
                } else {
                    mainLayer.classList.add('active-layer');
                    nativePlayer.play();
                }
            } else {
                if (activeInterval) clearInterval(activeInterval); 
                nativePlayer.pause(); 
                if (!state[vidId].adWatched && ytFrame.src.includes('autoplay=1')) {
                     ytFrame.src = ytFrame.src.replace('autoplay=1', 'autoplay=0'); 
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
        if (leftSidebar.classList.contains('open')) {
            closeSidebars(); // Agar profile khuli hai to pehle use band karega
        } else if (!rightSidebar.classList.contains('open')) {
            openMoviesList(); // Agar kuch nahi khula to Movies open karega
        }
    }
    
    // Swipe Left se Right (👉) -> SWIPE BACK (Close Movies) OR Open Profile
    if (swipeDistance > 50) { 
        if (rightSidebar.classList.contains('open')) {
            closeSidebars(); // SWIPE BACK: Movies band hoke wapas Shorts aa jayenge
        } else if (!leftSidebar.classList.contains('open')) {
            toggleLeftMenu(); // Profile menu open karega
        }
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
