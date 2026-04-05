/* =========================================
   🧠 AI ENGINE CORE (DO NOT EDIT)
   ========================================= */
// Ye systemData variable data.js se auto-fetch hoga
let videoList = [...systemData];

// AI Algorithm: Shuffle videos randomly for fresh feed every time
videoList.sort(() => Math.random() - 0.5); 

const feed = document.getElementById('mainFeed');
const players = {}; 
const state = {};   
let currentCategory = 'all';

// ================= RENDER FEED =================
function renderFeed() {
    feed.innerHTML = '<div id="no-results">No videos found.</div>';
    videoList.forEach((vid) => {
        state[vid.id] = { adWatched: false }; 
        const reel = document.createElement('div');
        reel.className = `reel`;
        reel.dataset.id = vid.id;
        reel.dataset.category = vid.category;
        
        reel.innerHTML = `
            <div class="layer active-layer" id="ad-layer-${vid.id}">
                <iframe id="yt-frame-${vid.id}" src="https://www.youtube.com/embed/${vid.ytAdId}?autoplay=0&controls=0&modestbranding=1&rel=0&mute=1&enablejsapi=1" allow="autoplay"></iframe>
            </div>
            <div class="layer" id="main-layer-${vid.id}">
                <video id="player-${vid.id}" playsinline loop crossorigin>
                    <source src="${vid.originalUrl}" type="video/mp4">
                </video>
            </div>
            <div class="overlay-gradient"></div>
            <div class="ad-timer" id="timer-${vid.id}">Ad: ${vid.adTime}s</div>
            
            <div class="info-bar">
                <h2 class="movie-title">${vid.title}</h2>
                <div class="tags"><span class="tag-red">${vid.category}</span> ${vid.tags}</div>
                <p class="desc">${vid.desc}</p>
            </div>
            <div class="side-actions">
                <div class="actor-profile-btn" onclick="openProfile('${vid.actorId}')">
                    <img src="${vid.actorPic}" alt="Actor">
                </div>
                <button class="action-item" onclick="toggleLike(this)"><div class="action-icon"><i class="fa-solid fa-heart"></i></div><span class="action-text">Like</span></button>
                <button class="action-item"><div class="action-icon"><i class="fa-solid fa-plus"></i></div><span class="action-text">List</span></button>
                <button class="action-item"><div class="action-icon"><i class="fa-solid fa-share"></i></div><span class="action-text">Share</span></button>
            </div>
        `;
        feed.appendChild(reel);
        players[vid.id] = new Plyr(`#player-${vid.id}`, { controls: ['play-large', 'progress'], clickToPlay: true });
    });
    observeVideos();
    
    // Auto-load shorts on start
    setTimeout(() => { setCategory('shorts', document.getElementById('btn-shorts')); }, 100);
}
renderFeed();

// ================= SWIPE GESTURES =================
const leftSidebar = document.getElementById('leftSidebar');
const rightSidebar = document.getElementById('rightMoviesSidebar');
const overlay = document.getElementById('sidebarOverlay');
let touchstartX = 0; let touchendX = 0;

function checkDirection() {
    const swipeDistance = touchendX - touchstartX;
    if (swipeDistance > 60) { leftSidebar.classList.add('open'); overlay.style.display = 'block'; } 
    else if (swipeDistance < -60) { openMoviesList(); }
}
document.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; });
document.addEventListener('touchend', e => { touchendX = e.changedTouches[0].screenX; checkDirection(); });

function closeSidebars() {
    leftSidebar.classList.remove('open'); rightSidebar.classList.remove('open'); overlay.style.display = 'none';
}

function setCategory(cat, btnElement) {
    currentCategory = cat;
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    if(btnElement) btnElement.classList.add('active');
    
    let visibleCount = 0;
    document.querySelectorAll('.reel').forEach(reel => {
        if (currentCategory === 'all' || reel.dataset.category === currentCategory) {
            reel.style.display = 'block'; visibleCount++;
        } else {
            reel.style.display = 'none';
            if(players[reel.dataset.id]) players[reel.dataset.id].pause();
        }
    });
    document.getElementById('no-results').style.display = visibleCount === 0 ? 'block' : 'none';
    closeSidebars(); 
}

// ================= MOVIES GRID (AI Auto-Fetch) =================
function openMoviesList() {
    const moviesGrid = document.getElementById('moviesCatalogueGrid');
    const moviesOnly = videoList.filter(v => v.category === 'movie');
    
    moviesGrid.innerHTML = '';
    moviesOnly.forEach(vid => {
        moviesGrid.innerHTML += `
            <div class="grid-item" onclick="playSpecificVideo(${vid.id}, 'movie')">
                <img src="${vid.thumbnail}" alt="Thumbnail">
                <div class="type-badge">MOVIE</div>
                <div class="views"><i class="fa-solid fa-play"></i> Play</div>
            </div>
        `;
    });
    rightSidebar.classList.add('open'); overlay.style.display = 'block';
}

// ================= SMART PROFILE ALGORITHM =================
function openProfile(actorId) {
    const actorData = videoList.find(v => v.actorId === actorId);
    if(!actorData) return;

    document.getElementById('profileNameHeader').innerText = actorData.actorName;
    document.getElementById('profileName').innerText = actorData.actorName;
    document.getElementById('profileBio').innerText = actorData.actorBio;
    document.getElementById('profilePic').src = actorData.actorPic;

    // AI Logic: Ek hi actor ke videos dhoondho aur categories me baanto
    const actorVideos = videoList.filter(v => v.actorId === actorId);
    const shortsGrid = document.getElementById('profileShortsGrid');
    const moviesGrid = document.getElementById('profileMoviesGrid');
    shortsGrid.innerHTML = ''; moviesGrid.innerHTML = '';
    
    actorVideos.forEach(vid => {
        const itemHTML = `
            <div class="grid-item" onclick="playSpecificVideo(${vid.id}, '${vid.category}')">
                <img src="${vid.thumbnail}" alt="Thumbnail">
                <div class="views"><i class="fa-solid fa-play"></i> ${Math.floor(Math.random() * 900) + 100}k</div>
            </div>
        `;
        if(vid.category === 'shorts') shortsGrid.innerHTML += itemHTML;
        else if(vid.category === 'movie') moviesGrid.innerHTML += itemHTML;
    });

    shortsGrid.previousElementSibling.style.display = shortsGrid.innerHTML === '' ? 'none' : 'block';
    moviesGrid.previousElementSibling.style.display = moviesGrid.innerHTML === '' ? 'none' : 'block';

    document.getElementById('profileOverlay').classList.add('open');
}

function closeProfile() { document.getElementById('profileOverlay').classList.remove('open'); }

function playSpecificVideo(vidId, cat) {
    closeProfile(); closeSidebars();
    setCategory(cat, document.getElementById('btn-' + cat));
}

// ================= OBSERVER (Play/Pause/Ad Logic) =================
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

            if(entry.target.style.display === 'none') return;

            if (entry.isIntersecting) {
                if (!state[vidId].adWatched) {
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
                            adLayer.classList.remove('active-layer');
                            mainLayer.classList.add('active-layer');
                            players[vidId].play();
                        }
                    }, 1000);
                } else {
                    mainLayer.classList.add('active-layer');
                    players[vidId].play();
                }
            } else {
                if (activeInterval) clearInterval(activeInterval); 
                players[vidId].pause(); 
                if (!state[vidId].adWatched && ytFrame.src.includes('autoplay=1')) {
                     ytFrame.src = ytFrame.src.replace('autoplay=1', 'autoplay=0'); 
                }
            }
        });
    }, { threshold: 0.7 });

    document.querySelectorAll('.reel').forEach(r => observer.observe(r));
}

function toggleLike(btn) { btn.querySelector('.action-icon').classList.toggle('liked'); }
