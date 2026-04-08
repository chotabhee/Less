/* =========================================
   DEDICATED MOVIE PLAYER & ACTOR MODAL
   ========================================= */
let activePlyr = null; 
let currentActorVideos = [];

function openMoviePlayer(vidId) {
    document.querySelectorAll('.native-video').forEach(v => v.pause());
    const data = window.processedData.find(v => v.id === vidId);
    if (!data) return;
    
    const container = document.getElementById('moviePlayerContainer');
    const wrapper = document.getElementById('movieWrapper');
    const details = document.getElementById('movieDetailsBox');

    if (Math.random() > 0.5) showMidrollAd(() => { playMovie(data, wrapper, details, container); });
    else playMovie(data, wrapper, details, container);
}

function playMovie(data, wrapper, details, container) {
    wrapper.innerHTML = `<video id="activeMovieVideo" playsinline controls data-poster="${data.thumbnail}"><source src="${data.originalUrl}" type="video/mp4"></video>`;
    details.innerHTML = `<h2>${data.title}</h2><p>${data.desc}</p>`;
    container.style.display = 'flex';
    closeSidebars();
    
    activePlyr = new Plyr('#activeMovieVideo', { controls: ['play-large', 'play', 'progress', 'current-time', 'duration', 'mute', 'volume', 'fullscreen'], autoplay: true });
}

function closeMoviePlayer() {
    const container = document.getElementById('moviePlayerContainer');
    const wrapper = document.getElementById('movieWrapper');
    if (activePlyr) { activePlyr.destroy(); activePlyr = null; }
    wrapper.innerHTML = '';
    container.style.display = 'none';
}

let adSkipTimer = null;
function showMidrollAd(callback) {
    const adOverlay = document.getElementById('adOverlay');
    const adFrame = document.getElementById('midrollAdFrame');
    const skipTimer = document.getElementById('adSkipTimer');
    const skipBtn = document.getElementById('adSkipBtn');
    
    adOverlay.style.display = 'flex';
    adFrame.src = 'https://www.youtube.com/embed/T0VyWKXz0Ow?autoplay=1&controls=0&mute=0';
    
    let timeLeft = 5;
    skipTimer.textContent = `Skip in ${timeLeft}s`;
    skipTimer.style.display = 'inline-block';
    skipBtn.style.display = 'none';
    
    adSkipTimer = setInterval(() => {
        timeLeft--;
        if (timeLeft > 0) skipTimer.textContent = `Skip in ${timeLeft}s`;
        else {
            clearInterval(adSkipTimer);
            skipTimer.style.display = 'none';
            skipBtn.style.display = 'inline-block';
        }
    }, 1000);
    window.adCallback = callback;
}

function skipAd() {
    document.getElementById('adOverlay').style.display = 'none';
    document.getElementById('midrollAdFrame').src = '';
    if (adSkipTimer) clearInterval(adSkipTimer);
    if (window.adCallback) { window.adCallback(); window.adCallback = null; }
}

function openActorModal(actorPic, actorName) {
    document.getElementById('actorModal').style.display = 'flex';
    document.getElementById('actorModalImg').src = actorPic;
    document.getElementById('actorModalName').textContent = actorName || 'Creator';
    document.getElementById('actorModalFollowers').textContent = Math.floor(Math.random() * 2000 + 100) + 'K Followers';
    
    currentActorVideos = window.processedData.filter(v => v.actorPic === actorPic);
    renderActorVideos('shorts'); 
}

function renderActorVideos(category) {
    document.getElementById('tab-shorts').classList.remove('active');
    document.getElementById('tab-movie').classList.remove('active');
    document.getElementById(`tab-${category}`).classList.add('active');

    const videoGrid = document.getElementById('actorVideoGrid');
    const filteredVideos = currentActorVideos.filter(v => v.category === category);
    
    if (filteredVideos.length === 0) {
        videoGrid.innerHTML = `<p style="color: #888; grid-column: 1/-1; text-align: center; margin-top: 20px;">No ${category} found.</p>`;
        return;
    }
    videoGrid.innerHTML = filteredVideos.map(v => `
        <div class="actor-video-item" onclick="playActorVideo('${v.id}')">
            <img src="${v.thumbnail}">
            ${category === 'movie' ? '<div class="badge">MOVIE</div>' : ''}
        </div>
    `).join('');
}

function closeActorModal() { document.getElementById('actorModal').style.display = 'none'; }
function playActorVideo(vidId) {
    closeActorModal();
    const data = window.processedData.find(v => v.id === vidId);
    if (data.category === 'movie') openMoviePlayer(vidId);
    else { const reel = document.querySelector(`[data-id="${vidId}"]`); if (reel) reel.scrollIntoView({ behavior: 'smooth' }); }
}
function toggleFollow() {
    const btn = document.querySelector('.follow-btn');
    if (btn.classList.contains('following')) { btn.classList.remove('following'); btn.innerHTML = '<i class="fa-solid fa-plus"></i> Follow'; } 
    else { btn.classList.add('following'); btn.innerHTML = '<i class="fa-solid fa-check"></i> Following'; }
}
