// FIREBASE
try {
    const firebaseConfig = { apiKey: "YOUR_API_KEY", authDomain: "YOUR_ID.firebaseapp.com", projectId: "YOUR_ID" };
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const provider = new firebase.auth.GoogleAuthProvider();

    auth.onAuthStateChanged((user) => {
        if (user) {
            document.getElementById('loggedOutUI').style.display = 'none';
            document.getElementById('loggedInUI').style.display = 'block';
            document.getElementById('userGoogleName').innerText = user.displayName;
            document.getElementById('userGooglePic').src = user.photoURL;
        }
    });
    window.signInWithGoogle = () => auth.signInWithPopup(provider).catch(e => console.log(e));
    window.signOut = () => auth.signOut().then(() => location.reload());
} catch(e) { console.log("Auth skip"); }

// CORE ENGINE
let videoList = [...systemData];
const feed = document.getElementById('mainFeed');
const state = {}; 

function renderFeed() {
    feed.innerHTML = '';
    videoList.forEach((vid) => {
        state[vid.id] = { adWatched: false, timerRunning: false }; 
        const reel = document.createElement('div');
        reel.className = `reel`;
        reel.dataset.id = vid.id;
        reel.innerHTML = `
            <div class="layer active-layer" id="ad-layer-${vid.id}">
                <iframe id="yt-frame-${vid.id}" src="" frameborder="0" style="width:100%; height:100%; pointer-events:none;"></iframe>
            </div>
            <div class="layer" id="main-layer-${vid.id}">
                <video id="player-${vid.id}" class="native-video" playsinline loop muted autoplay>
                    <source src="${vid.originalUrl}" type="video/mp4">
                </video>
            </div>
            <div class="ad-timer" id="timer-${vid.id}" style="display:none;">Ad: ${vid.adTime}s</div>
            <div class="info-bar">
                <h2 class="movie-title">${vid.title}</h2>
                <p class="desc">${vid.desc}</p>
            </div>
            <div class="side-actions">
                <div class="actor-profile-btn"><img src="${vid.actorPic}"></div>
                <div class="action-item"><i class="fa-solid fa-heart action-icon"></i><span class="action-text">Like</span></div>
                <div class="action-item"><i class="fa-solid fa-share action-icon"></i><span class="action-text">Share</span></div>
            </div>
        `;
        feed.appendChild(reel);
    });
    startObserving();
}

function startObserving() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const vidId = entry.target.dataset.id;
            const data = videoList.find(v => v.id == vidId);
            const timerEl = document.getElementById(`timer-${vidId}`);
            const ytFrame = document.getElementById(`yt-frame-${vidId}`);
            const video = document.getElementById(`player-${vidId}`);

            if (entry.isIntersecting) {
                if (!state[vidId].adWatched && !state[vidId].timerRunning) {
                    state[vidId].timerRunning = true;
                    feed.classList.add('no-scroll'); 
                    let timeLeft = parseInt(data.adTime);
                    timerEl.style.display = 'block';
                    ytFrame.src = `https://www.youtube.com/embed/${data.ytAdId}?autoplay=1&controls=0&mute=1&modestbranding=1`;
                    
                    const countdown = setInterval(() => {
                        timeLeft--;
                        timerEl.innerText = `Ad: ${timeLeft}s`;
                        if (timeLeft <= 0) {
                            clearInterval(countdown);
                            state[vidId].adWatched = true;
                            timerEl.style.display = 'none';
                            ytFrame.src = ""; 
                            feed.classList.remove('no-scroll'); 
                            document.getElementById(`ad-layer-${vidId}`).classList.remove('active-layer');
                            document.getElementById(`main-layer-${vidId}`).classList.add('active-layer');
                            video.play(); video.muted = false;
                        }
                    }, 1000);
                    state[vidId].interval = countdown;
                } else if (state[vidId].adWatched) { video.play(); }
            } else {
                if (state[vidId].interval) clearInterval(state[vidId].interval);
                if (video) { video.pause(); video.currentTime = 0; }
                if (!state[vidId].adWatched) { ytFrame.src = ""; feed.classList.remove('no-scroll'); }
            }
        });
    }, { threshold: 0.8 });
    document.querySelectorAll('.reel').forEach(r => observer.observe(r));
}

// SWIPES
let tStart = 0;
document.addEventListener('touchstart', e => tStart = e.changedTouches[0].screenX);
document.addEventListener('touchend', e => {
    let tEnd = e.changedTouches[0].screenX;
    if (tStart - tEnd > 70) openMoviesList(); // Left
    if (tEnd - tStart > 70) closeSidebars(); // Right
});

function toggleLeftMenu() { document.getElementById('leftSidebar').classList.add('open'); document.getElementById('sidebarOverlay').style.display = 'block'; }
function openMoviesList() { 
    const grid = document.getElementById('moviesCatalogueGrid');
    const movies = videoList.filter(v => v.category === 'movie');
    grid.innerHTML = movies.map(v => `<div class="grid-item"><img src="${v.thumbnail}" style="width:100%"></div>`).join('');
    document.getElementById('rightMoviesSidebar').classList.add('open'); 
    document.getElementById('sidebarOverlay').style.display = 'block'; 
}
function closeSidebars() { 
    document.getElementById('leftSidebar').classList.remove('open'); 
    document.getElementById('rightMoviesSidebar').classList.remove('open'); 
    document.getElementById('sidebarOverlay').style.display = 'none'; 
}

renderFeed();
