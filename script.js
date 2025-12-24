// Global Data Structure
let mediaLibrary = {
    all: [],      // All media items
    favorites: [],
    archived: [],
    trash: []
};

let albums = {
    'All Photos': { type: 'default', icon: '📷', items: [] },
    'Camera': { type: 'default', icon: '📷', items: [] },
    'Videos': { type: 'default', icon: '🎬', items: [] },
    'Screenshots': { type: 'default', icon: '🖼️', items: [] },
    'Downloads': { type: 'default', icon: '⬇️', items: [] }
};

let albumTrash = []; // For deleted albums

let settings = {
    selectedMediaType: 'image',
    selectedAlbum: 'Camera',
    currentView: 'grid',
    currentSort: 'date-newest',
    albumFilter: 'all',
    currentSection: 'photos',
    currentAlbum: null,
    selectedItems: [],
    multiSelectMode: false
};

// Helpers: de-duplication and album insertion
function findItemBySrc(src) {
    return mediaLibrary.all.find(i => i.src === src);
}

function pushToAlbum(albumName, item) {
    const album = albums[albumName];
    if (!album) return;
    album.items = album.items || [];
    if (!album.items.find(i => i.id === item.id)) {
        album.items.push(item);
    }
}

// Initialize Gallery
function initGallery() {
    addSampleMedia();
    renderPhotos();
    renderAlbums();
    populateAlbumSelect();
    updateStorageInfo();
}

// Add Sample Media (for demo)
function addSampleMedia() {
    const samplePhotos = [
        // Camera Photos - Dec 23-20, 2025
        { src: 'https://picsum.photos/id/1015/600/400', type: 'image', date: new Date(2025, 11, 23), album: 'Camera' },
        { src: 'https://picsum.photos/id/1011/600/400', type: 'image', date: new Date(2025, 11, 23), album: 'Camera' },
        { src: 'https://picsum.photos/id/1012/600/400', type: 'image', date: new Date(2025, 11, 22), album: 'Camera' },
        { src: 'https://picsum.photos/id/1005/600/400', type: 'image', date: new Date(2025, 11, 22), album: 'Camera' },
        { src: 'https://picsum.photos/id/180/600/400', type: 'image', date: new Date(2025, 11, 21), album: 'Camera' },
        { src: 'https://picsum.photos/id/1/600/400', type: 'image', date: new Date(2025, 11, 21), album: 'Camera' },
        { src: 'https://picsum.photos/id/10/600/400', type: 'image', date: new Date(2025, 11, 20), album: 'Camera' },
        { src: 'https://picsum.photos/id/20/600/400', type: 'image', date: new Date(2025, 11, 20), album: 'Camera' },
        
        // Screenshots - Dec 19-18, 2025
        { src: 'https://picsum.photos/id/30/600/400', type: 'image', date: new Date(2025, 11, 19), album: 'Screenshots' },
        { src: 'https://picsum.photos/id/40/600/400', type: 'image', date: new Date(2025, 11, 19), album: 'Screenshots' },
        { src: 'https://picsum.photos/id/50/600/400', type: 'image', date: new Date(2025, 11, 18), album: 'Screenshots' },
        { src: 'https://picsum.photos/id/100/600/400', type: 'image', date: new Date(2025, 11, 18), album: 'Screenshots' },
        
        // Downloads - Dec 17-16, 2025
        { src: 'https://picsum.photos/id/101/600/400', type: 'image', date: new Date(2025, 11, 17), album: 'Downloads' },
        { src: 'https://picsum.photos/id/102/600/400', type: 'image', date: new Date(2025, 11, 17), album: 'Downloads' },
        { src: 'https://picsum.photos/id/103/600/400', type: 'image', date: new Date(2025, 11, 16), album: 'Downloads' },
        { src: 'https://picsum.photos/id/201/600/400', type: 'image', date: new Date(2025, 11, 16), album: 'Downloads' },
        { src: 'https://picsum.photos/id/105/600/400', type: 'image', date: new Date(2025, 11, 16), album: 'Downloads' },
        { src: 'https://picsum.photos/id/106/600/400', type: 'image', date: new Date(2025, 11, 16), album: 'Downloads' },
        
        // More Camera Photos - Dec 15-10, 2025
        { src: 'https://picsum.photos/id/110/600/400', type: 'image', date: new Date(2025, 11, 15), album: 'Camera' },
        { src: 'https://picsum.photos/id/111/600/400', type: 'image', date: new Date(2025, 11, 14), album: 'Camera' },
        { src: 'https://picsum.photos/id/112/600/400', type: 'image', date: new Date(2025, 11, 13), album: 'Camera' },
        { src: 'https://picsum.photos/id/113/600/400', type: 'image', date: new Date(2025, 11, 12), album: 'Camera' },
        { src: 'https://picsum.photos/id/114/600/400', type: 'image', date: new Date(2025, 11, 11), album: 'Camera' },
        { src: 'https://picsum.photos/id/115/600/400', type: 'image', date: new Date(2025, 11, 10), album: 'Camera' },
        
        // More Screenshots - Dec 9-8, 2025
        { src: 'https://picsum.photos/id/120/600/400', type: 'image', date: new Date(2025, 11, 9), album: 'Screenshots' },
        { src: 'https://picsum.photos/id/121/600/400', type: 'image', date: new Date(2025, 11, 8), album: 'Screenshots' },
        
        // Older photos - Dec 7-1, 2025
        { src: 'https://picsum.photos/id/130/600/400', type: 'image', date: new Date(2025, 11, 7), album: 'Camera' },
        { src: 'https://picsum.photos/id/131/600/400', type: 'image', date: new Date(2025, 11, 6), album: 'Camera' },
        { src: 'https://picsum.photos/id/132/600/400', type: 'image', date: new Date(2025, 11, 5), album: 'Downloads' },
        { src: 'https://picsum.photos/id/133/600/400', type: 'image', date: new Date(2025, 11, 4), album: 'Camera' },
        { src: 'https://picsum.photos/id/134/600/400', type: 'image', date: new Date(2025, 11, 3), album: 'Screenshots' },
        { src: 'https://picsum.photos/id/135/600/400', type: 'image', date: new Date(2025, 11, 2), album: 'Camera' },
        { src: 'https://picsum.photos/id/136/600/400', type: 'image', date: new Date(2025, 11, 1), album: 'Downloads' },
        
        // November photos
        { src: 'https://picsum.photos/id/140/600/400', type: 'image', date: new Date(2025, 10, 30), album: 'Camera' },
        { src: 'https://picsum.photos/id/141/600/400', type: 'image', date: new Date(2025, 10, 28), album: 'Camera' },
        { src: 'https://picsum.photos/id/142/600/400', type: 'image', date: new Date(2025, 10, 25), album: 'Downloads' },
        { src: 'https://picsum.photos/id/143/600/400', type: 'image', date: new Date(2025, 10, 22), album: 'Screenshots' },
        { src: 'https://picsum.photos/id/144/600/400', type: 'image', date: new Date(2025, 10, 20), album: 'Camera' },
        { src: 'https://picsum.photos/id/145/600/400', type: 'image', date: new Date(2025, 10, 18), album: 'Camera' },
    ];
    
    // Add videos (unique sources)
    const sampleVideos = [
        { src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', type: 'video', date: new Date(2025, 11, 23), album: 'Videos' },
        { src: 'https://media.w3.org/2010/05/sintel/trailer.mp4', type: 'video', date: new Date(2025, 11, 22), album: 'Videos' },
        { src: 'https://media.w3.org/2010/05/bunny/trailer.mp4', type: 'video', date: new Date(2025, 11, 20), album: 'Videos' },
        { src: 'https://media.w3.org/2010/05/video/movie_300.mp4', type: 'video', date: new Date(2025, 11, 18), album: 'Videos' },
        { src: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4', type: 'video', date: new Date(2025, 11, 15), album: 'Videos' },
        { src: 'https://samplelib.com/lib/preview/mp4/sample-10s.mp4', type: 'video', date: new Date(2025, 11, 10), album: 'Videos' },
    ];
    
    let photoIndex = 0;
    samplePhotos.forEach((photo) => {
        const existing = findItemBySrc(photo.src);
        if (existing) {
            // Ensure it's listed in the right albums only once
            pushToAlbum(photo.album, existing);
            pushToAlbum('All Photos', existing);
        } else {
            photo.id = `photo_${photoIndex++}`;
            photo.favorite = false;
            photo.archived = false;
            photo.deleted = false;
            mediaLibrary.all.push(photo);
            pushToAlbum(photo.album, photo);
            pushToAlbum('All Photos', photo);
        }
    });
    
    let videoIndex = 0;
    sampleVideos.forEach((video) => {
        const existing = findItemBySrc(video.src);
        if (existing) {
            pushToAlbum(video.album, existing);
            pushToAlbum('All Photos', existing);
        } else {
            video.id = `video_${videoIndex++}`;
            video.favorite = false;
            video.archived = false;
            video.deleted = false;
            mediaLibrary.all.push(video);
            pushToAlbum(video.album, video);
            pushToAlbum('All Photos', video);
        }
    });
}

// Show Section
function showSection(sectionName) {
    settings.currentSection = sectionName;
    
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(sectionName + 'Section').classList.add('active');
    
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    renderSectionContent();
}

// Render Section Content
function renderSectionContent() {
    switch(settings.currentSection) {
        case 'photos':
            renderPhotos();
            break;
        case 'albums':
            renderAlbums();
            break;
        case 'favorites':
            renderFavorites();
            break;
        case 'trash':
            renderTrash();
            break;
    }
}

// Render Photos with Date Grouping
function renderPhotos() {
    const container = document.getElementById('photosTimeline');
    container.innerHTML = '';
    
    // Show all photos in the Photos section (including favorites and archived)
    // Only exclude deleted photos
    let filteredMedia = mediaLibrary.all.filter(item => !item.deleted);
    filteredMedia = applySearch(filteredMedia);
    filteredMedia = applySorting(filteredMedia);
    
    const groupedByDate = groupByDate(filteredMedia);
    
    Object.entries(groupedByDate).forEach(([dateLabel, items]) => {
        const dateGroup = document.createElement('div');
        dateGroup.className = 'date-group';
        
        const dateHeader = document.createElement('div');
        dateHeader.className = 'date-header';
        dateHeader.textContent = dateLabel;
        dateGroup.appendChild(dateHeader);
        
        const mediaGrid = document.createElement('div');
        mediaGrid.className = 'media-grid';
        
        items.forEach(item => {
            mediaGrid.appendChild(createMediaItemElement(item));
        });
        
        dateGroup.appendChild(mediaGrid);
        container.appendChild(dateGroup);
    });
}

// Group Media by Date
function groupByDate(items) {
    const grouped = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    items.forEach(item => {
        const itemDate = new Date(item.date);
        itemDate.setHours(0, 0, 0, 0);
        
        const diffTime = today - itemDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        let label;
        if (diffDays === 0) label = 'Today';
        else if (diffDays === 1) label = 'Yesterday';
        else if (diffDays <= 7) label = 'This Week';
        else if (diffDays <= 30) label = 'This Month';
        else label = itemDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
        
        if (!grouped[label]) grouped[label] = [];
        grouped[label].push(item);
    });
    
    return grouped;
}

// Create Media Item Element
function createMediaItemElement(item) {
    const div = document.createElement('div');
    div.className = 'media-item';
    if (item.favorite) div.classList.add('favorite');
    if (settings.selectedItems.find(i => i.id === item.id)) div.classList.add('selected');
    
    const mediaHTML = item.type === 'image' 
        ? `<img src="${item.src}" alt="Photo">`
        : `<video><source src="${item.src}"></video>`;
    
    const videoIcon = item.type === 'video' ? '<div class="video-icon"><span class="play-icon">▶</span></div>' : '';
    
    div.innerHTML = `
        ${mediaHTML}
        ${videoIcon}
        <div class="checkbox" onclick="toggleSelection(event, '${item.id}')">✓</div>
        <button class="favorite-btn" onclick="toggleFavorite(event, '${item.id}')">${item.favorite ? '⭐' : '☆'}</button>
    `;
    
    div.onclick = (e) => {
        if (!e.target.classList.contains('checkbox') && !e.target.classList.contains('favorite-btn')) {
            openLightbox(item);
        }
    };
    
    return div;
}

// Toggle Selection
function toggleSelection(event, itemId) {
    event.stopPropagation();
    settings.multiSelectMode = true;
    
    const item = mediaLibrary.all.find(i => i.id === itemId);
    const index = settings.selectedItems.findIndex(i => i.id === itemId);
    
    if (index > -1) {
        settings.selectedItems.splice(index, 1);
    } else {
        settings.selectedItems.push(item);
    }
    
    updateMultiSelectToolbar();
    renderSectionContent();
}

// Update Multi-select Toolbar
function updateMultiSelectToolbar() {
    const toolbar = document.getElementById('multiSelectToolbar');
    const countSpan = document.getElementById('selectedCount');
    
    if (settings.selectedItems.length > 0) {
        toolbar.style.display = 'flex';
        countSpan.textContent = `${settings.selectedItems.length} selected`;
    } else {
        toolbar.style.display = 'none';
        settings.multiSelectMode = false;
    }
}

// Cancel Selection
function cancelSelection() {
    settings.selectedItems = [];
    updateMultiSelectToolbar();
    renderSectionContent();
}

// Toggle Favorite
function toggleFavorite(event, itemId) {
    event.stopPropagation();
    
    // Find item from any source
    let item = mediaLibrary.all.find(i => i.id === itemId) ||
               mediaLibrary.favorites.find(i => i.id === itemId) ||
               mediaLibrary.archived.find(i => i.id === itemId);
    
    if (!item) return;
    
    item.favorite = !item.favorite;
    
    if (item.favorite) {
        if (!mediaLibrary.favorites.find(i => i.id === itemId)) {
            mediaLibrary.favorites.push(item);
        }
    } else {
        mediaLibrary.favorites = mediaLibrary.favorites.filter(i => i.id !== itemId);
    }
    
    renderSectionContent();
}

// Favorite Selected
function favoriteSelected() {
    settings.selectedItems.forEach(item => {
        item.favorite = true;
        // Add to favorites if not already there
        if (!mediaLibrary.favorites.find(i => i.id === item.id)) {
            mediaLibrary.favorites.push(item);
        }
    });
    cancelSelection();
    renderSectionContent();
}

// Archive Selected
function archiveSelected() {
    settings.selectedItems.forEach(item => {
        item.archived = true;
        // Add to archived if not already there
        if (!mediaLibrary.archived.find(i => i.id === item.id)) {
            mediaLibrary.archived.push(item);
        }
        // Remove from favorites if it was favorited
        mediaLibrary.favorites = mediaLibrary.favorites.filter(i => i.id !== item.id);
    });
    // Remove from all and favorites
    mediaLibrary.all = mediaLibrary.all.filter(item => !settings.selectedItems.find(i => i.id === item.id));
    mediaLibrary.favorites = mediaLibrary.favorites.filter(item => !settings.selectedItems.find(i => i.id === item.id));
    cancelSelection();
    renderSectionContent();
}

// Delete Selected
function deleteSelected() {
    if (confirm(`Delete ${settings.selectedItems.length} items?`)) {
        settings.selectedItems.forEach(item => {
            item.deleted = true;
            mediaLibrary.trash.push(item);
        });
        mediaLibrary.all = mediaLibrary.all.filter(item => !settings.selectedItems.find(i => i.id === item.id));
        cancelSelection();
        renderSectionContent();
    }
}

// Render Favorites
function renderFavorites() {
    const container = document.getElementById('favoritesGrid');
    container.innerHTML = '';
    
    let items = mediaLibrary.favorites.filter(item => !item.deleted);
    items = applySearch(items);
    items = applySorting(items);
    
    if (items.length === 0) {
        container.innerHTML = '<div style="grid-column:1/-1; color:#9d4edd; padding:40px;">No favorite items yet</div>';
        return;
    }
    
    items.forEach(item => {
        container.appendChild(createMediaItemElement(item));
    });
}

// Render Archive
function renderArchive() {
    const container = document.getElementById('archiveGrid');
    container.innerHTML = '';
    
    let items = mediaLibrary.archived.filter(item => !item.deleted);
    items = applySearch(items);
    items = applySorting(items);
    
    if (items.length === 0) {
        container.innerHTML = '<div style="grid-column:1/-1; color:#9d4edd; padding:40px;">No archived items</div>';
        return;
    }
    
    items.forEach(item => {
        container.appendChild(createMediaItemElement(item));
    });
}

// Render Trash
function renderTrash() {
    const container = document.getElementById('trashGrid');
    const trashActions = document.getElementById('trashActions');
    
    container.innerHTML = '';
    
    let items = mediaLibrary.trash;
    
    if (items.length === 0 && albumTrash.length === 0) {
        container.innerHTML = '<div style="grid-column:1/-1; color:#9d4edd; padding:40px;">Trash is empty</div>';
        trashActions.style.display = 'none';
        return;
    }
    
    // Render deleted media items
    items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'media-item';
        const videoIcon = item.type === 'video' ? '<div class="video-icon"><span class="play-icon">▶</span></div>' : '';
        itemDiv.innerHTML = `
            ${item.type === 'image' ? `<img src="${item.src}" alt="Trash Item">` : `<video><source src="${item.src}"></video>`}
            ${videoIcon}
            <button onclick="restoreItem('${item.id}')" style="position: absolute; bottom: 8px; right: 8px; padding: 6px 10px; background: #9d4edd; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; z-index: 20;\">♻️</button>
        `;
        container.appendChild(itemDiv);
    });
    
    // Render deleted albums
    albumTrash.forEach((album, index) => {
        const albumDiv = document.createElement('div');
        albumDiv.className = 'media-item';
        albumDiv.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: rgba(157, 78, 221, 0.2); width: 100%;\">
                <div style="text-align: center; color: #c77dff;\">
                    <div style="font-size: 2.5em; margin-bottom: 10px;\">📁</div>
                    <div style="font-weight: bold; font-size: 14px;\">${album.name}</div>
                </div>
            </div>
            <button onclick="restoreAlbumFromTrash(${index})" style="position: absolute; bottom: 8px; right: 8px; padding: 6px 10px; background: #9d4edd; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; z-index: 20;\">♻️</button>
        `;
        container.appendChild(albumDiv);
    });
    
    trashActions.style.display = 'flex';
}

// Restore All Trash
function restoreAllTrash() {
    // Restore all items
    mediaLibrary.trash.forEach(item => {
        item.deleted = false;
        mediaLibrary.all.push(item);
        if (item.album && albums[item.album]) {
            pushToAlbum(item.album, item);
        }
    });
    mediaLibrary.trash = [];
    
    // Restore all albums
    albumTrash.forEach(album => {
        albums[album.name] = album.data;
    });
    albumTrash = [];
    
    renderTrash();
    renderAlbums();
}

// Permanently Delete Trash
function permanentlyDeleteTrash() {
    if (confirm('This will permanently delete all items in trash!')) {
        mediaLibrary.trash = [];
        albumTrash = [];
        renderTrash();
    }
}

// Render Albums
function renderAlbums() {
    const container = document.getElementById('albumsContainer');
    container.innerHTML = '';
    
    let displayAlbums = {};
    
    if (settings.albumFilter === 'all') {
        displayAlbums = albums;
    } else if (settings.albumFilter === 'default') {
        Object.entries(albums).forEach(([name, data]) => {
            if (data.type === 'default') displayAlbums[name] = data;
        });
    } else if (settings.albumFilter === 'custom') {
        Object.entries(albums).forEach(([name, data]) => {
            if (data.type === 'custom') displayAlbums[name] = data;
        });
    }
    
    Object.entries(displayAlbums).forEach(([albumName, albumData]) => {
        const card = document.createElement('div');
        card.className = `album-card ${albumData.type}`;
        card.onclick = () => openAlbum(albumName);
        
        // Filter out deleted items from album
        const activeItems = albumData.items ? albumData.items.filter(item => !item.deleted) : [];
        
        let coverHTML = '<span class="no-image">' + albumData.icon + '</span>';
        if (activeItems.length > 0) {
            const lastItem = activeItems[activeItems.length - 1];
            if (lastItem.type === 'image') {
                coverHTML = `<img src="${lastItem.src}" alt="Cover">`;
            } else {
                coverHTML = `<video><source src="${lastItem.src}"></video>`;
            }
        }
        
        card.innerHTML = `
            <div class="album-cover">${coverHTML}</div>
            <div class="album-info">
                <div class="album-name">${albumName}</div>
                <div class="album-count">${activeItems.length}</div>
            </div>
        `;
        
        container.appendChild(card);
    });
}

// Apply Search Filter
function applySearch(items) {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (!searchTerm) return items;
    
    return items.filter(item => {
        return item.album.toLowerCase().includes(searchTerm) || 
               item.type.toLowerCase().includes(searchTerm);
    });
}

// Apply Sorting
function applySorting(items) {
    let sorted = [...items];
    
    switch(settings.currentSort) {
        case 'date-newest':
            sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'date-oldest':
            sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'name':
            sorted.sort((a, b) => a.album.localeCompare(b.album));
            break;
    }
    
    return sorted;
}

// Perform Search
function performSearch() {
    if (settings.currentSection === 'photos') {
        renderPhotos();
    } else if (settings.currentSection === 'favorites') {
        renderFavorites();
    }
}

// Sort By
function sortBy(sortType) {
    settings.currentSort = sortType;
    toggleSortMenu();
    renderSectionContent();
}

// Toggle Sort Menu
function toggleSortMenu() {
    const menu = document.getElementById('sortMenu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

// Set View
function setView(viewType) {
    settings.currentView = viewType;
    document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderSectionContent();
}

// Filter Albums
function filterAlbums(filter) {
    settings.albumFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderAlbums();
}

// Upload Functions
function openUploadModal() {
    document.getElementById('uploadModal').classList.add('active');
    settings.selectedMediaType = 'image';
    populateAlbumSelect();
}

function closeUploadModal() {
    document.getElementById('uploadModal').classList.remove('active');
}

function updateMediaType() {
    settings.selectedMediaType = document.querySelector('input[name="mediaType"]:checked').value;
}

function proceedWithUpload() {
    if (settings.selectedMediaType === 'image') {
        document.getElementById('uploadInput').click();
    } else {
        document.getElementById('uploadVideoInput').click();
    }
    closeUploadModal();
}

function uploadImages() {
    const input = document.getElementById('uploadInput');
    Array.from(input.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            addMediaItem(e.target.result, 'image');
        };
        reader.readAsDataURL(file);
    });
    input.value = '';
}

function uploadVideos() {
    const input = document.getElementById('uploadVideoInput');
    Array.from(input.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            addMediaItem(e.target.result, 'video');
        };
        reader.readAsDataURL(file);
    });
    input.value = '';
}

function addMediaItem(src, type) {
    const existing = findItemBySrc(src);
    if (existing) {
        // Avoid duplicate entries; just map it to the selected album and All Photos
        pushToAlbum(settings.selectedAlbum, existing);
        pushToAlbum('All Photos', existing);
    } else {
        const item = {
            id: `media_${Date.now()}_${Math.random()}`,
            src: src,
            type: type,
            date: new Date(),
            album: settings.selectedAlbum,
            favorite: false,
            archived: false,
            deleted: false
        };
        mediaLibrary.all.push(item);
        pushToAlbum(settings.selectedAlbum, item);
        pushToAlbum('All Photos', item);
    }
    
    updateStorageInfo();
    renderSectionContent();
}

function populateAlbumSelect() {
    const grid = document.getElementById('albumSelectGrid');
    grid.innerHTML = '';
    
    Object.keys(albums).forEach(albumName => {
        const btn = document.createElement('button');
        btn.className = 'album-select-btn';
        if (albumName === settings.selectedAlbum) btn.classList.add('selected');
        btn.textContent = albumName;
        btn.onclick = (e) => {
            e.stopPropagation();
            settings.selectedAlbum = albumName;
            populateAlbumSelect();
        };
        grid.appendChild(btn);
    });
}

// Album Management
function openCreateAlbumModal() {
    document.getElementById('createAlbumModal').classList.add('active');
    document.getElementById('albumNameInput').value = '';
}

function closeCreateAlbumModal() {
    document.getElementById('createAlbumModal').classList.remove('active');
}

function createNewAlbum() {
    const name = document.getElementById('albumNameInput').value.trim();
    if (!name) {
        alert('Please enter album name');
        return;
    }
    
    if (albums[name]) {
        alert('Album already exists');
        return;
    }
    
    albums[name] = { type: 'custom', icon: '📁', items: [] };
    populateAlbumSelect();
    renderAlbums();
    closeCreateAlbumModal();
}

// Delete All
function deleteAllImages() {
    if (confirm('Delete all media? This cannot be undone!')) {
        mediaLibrary.all = [];
        mediaLibrary.favorites = [];
        mediaLibrary.archived = [];
        mediaLibrary.trash = [];
        Object.keys(albums).forEach(key => {
            albums[key].items = [];
        });
        updateStorageInfo();
        renderSectionContent();
    }
}

// Update Storage Info
function updateStorageInfo() {
    const totalSize = mediaLibrary.all.length * 2; // Approximate 2MB per item
    document.getElementById('storageUsed').textContent = totalSize;
}

// Lightbox Functions (Basic)
function openLightbox(item) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxVideo = document.getElementById('lightbox-video');
    
    if (item.type === 'image') {
        lightboxVideo.style.display = 'none';
        lightboxImg.style.display = 'block';
        lightboxImg.src = item.src;
    } else {
        lightboxImg.style.display = 'none';
        lightboxVideo.style.display = 'block';
        lightboxVideo.src = item.src;
    }
    
    lightbox.classList.add('active');
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
}

// Lightbox Navigation and Controls
function changeImage(direction) {
    // Placeholder - can be enhanced to navigate between images in lightbox
    console.log('Navigate:', direction);
}

function zoomIn() {
    const img = document.getElementById('lightbox-img');
    if (img && img.style.display !== 'none') {
        let currentZoom = parseFloat(img.style.transform?.match(/scale\(([\d.]+)\)/) || [1, 1])[1];
        currentZoom += 0.1;
        img.style.transform = `scale(${currentZoom})`;
        document.getElementById('zoomLevel').textContent = Math.round(currentZoom * 100) + '%';
    }
}

function zoomOut() {
    const img = document.getElementById('lightbox-img');
    if (img && img.style.display !== 'none') {
        let currentZoom = parseFloat(img.style.transform?.match(/scale\(([\d.]+)\)/) || [1, 1])[1];
        currentZoom = Math.max(0.1, currentZoom - 0.1);
        img.style.transform = `scale(${currentZoom})`;
        document.getElementById('zoomLevel').textContent = Math.round(currentZoom * 100) + '%';
    }
}

function resetZoom() {
    const img = document.getElementById('lightbox-img');
    if (img && img.style.display !== 'none') {
        img.style.transform = 'scale(1)';
        document.getElementById('zoomLevel').textContent = '100%';
    }
}

function toggleFullScreen() {
    const lightbox = document.getElementById('lightbox');
    if (!document.fullscreenElement) {
        lightbox.requestFullscreen().catch(err => {
            alert(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

function downloadImage() {
    const img = document.getElementById('lightbox-img');
    if (img && img.src) {
        const link = document.createElement('a');
        link.href = img.src;
        link.download = 'photo.jpg';
        link.click();
    }
}

function deleteImage(event) {
    if (event) event.stopPropagation();
    alert('Use the delete button in the toolbar to remove images');
}

// Open Album
function openAlbum(albumName) {
    // Store the currently viewing album
    settings.currentAlbum = albumName;
    
    // Get album data
    const albumData = albums[albumName];
    
    if (!albumData || !albumData.items || albumData.items.length === 0) {
        alert('This album is empty');
        return;
    }
    
    // Display album contents
    displayAlbumContents(albumName, albumData.items);
}

// Display Album Contents
function displayAlbumContents(albumName, items) {
    const albumsSection = document.getElementById('albumsSection');
    
    // Filter out deleted items
    const activeItems = items.filter(item => !item.deleted);
    
    // Create back button and album title
    const albumView = document.createElement('div');
    albumView.id = 'albumView';
    albumView.innerHTML = `
        <div style="display: flex; gap: 10px; margin-bottom: 30px;">
            <button onclick="backToAlbums()" style="
                padding: 10px 20px;
                border: 2px solid #9d4edd;
                background: rgba(157, 78, 221, 0.1);
                color: #c77dff;
                border-radius: 8px;
                cursor: pointer;
                font-size: 1em;
                font-weight: bold;
                transition: all 0.3s;
            ">← Back to Albums</button>
            <button onclick="deleteAlbum('${albumName}')" style="
                padding: 10px 20px;
                border: 2px solid #ff6b6b;
                background: rgba(255, 107, 107, 0.1);
                color: #ff6b6b;
                border-radius: 8px;
                cursor: pointer;
                font-size: 1em;
                font-weight: bold;
                transition: all 0.3s;
            ">🗑️ Delete Album</button>
        </div>
        <h2 style="color: #c77dff; font-size: 2em; margin: 20px 0 10px 0;">${albumName}</h2>
        <p style="color: rgba(199, 125, 255, 0.7); margin-bottom: 30px;">${activeItems.length} items</p>
        <div class="media-grid" id="albumPhotosGrid"></div>
    `;
    
    // Clear and replace albums section content
    albumsSection.innerHTML = '';
    albumsSection.appendChild(albumView);
    
    // Render photos in the album
    const grid = document.getElementById('albumPhotosGrid');
    if (activeItems.length === 0) {
        grid.innerHTML = '<div style="grid-column:1/-1; color:#9d4edd; padding:40px;">This album is empty</div>';
        return;
    }
    
    activeItems.forEach(item => {
        grid.appendChild(createMediaItemElement(item));
    });
    
    // Scroll to top
    window.scrollTo(0, 140);
}

// Delete Album
function deleteAlbum(albumName) {
    if (confirm(`Are you sure you want to delete the "${albumName}" album and all its contents?`)) {
        if (albums[albumName]) {
            // Get all items in the album
            const albumItems = albums[albumName].items || [];
            
            // Move all items to trash
            albumItems.forEach(item => {
                if (!item.deleted) {
                    item.deleted = true;
                    mediaLibrary.trash.push(item);
                    mediaLibrary.all = mediaLibrary.all.filter(i => i.id !== item.id);
                }
            });
            
            // Move album to trash
            albumTrash.push({
                name: albumName,
                data: albums[albumName]
            });
            delete albums[albumName];
            
            backToAlbums();
        }
    }
}

// Restore Item from Trash
function restoreItem(itemId) {
    const item = mediaLibrary.trash.find(i => i.id === itemId);
    if (item) {
        item.deleted = false;
        mediaLibrary.all.push(item);
        mediaLibrary.trash = mediaLibrary.trash.filter(i => i.id !== itemId);
        // Re-add to original album
        if (item.album && albums[item.album]) {
            pushToAlbum(item.album, item);
        }
        renderTrash();
    }
}

// Restore Album from Trash
function restoreAlbumFromTrash(index) {
    const album = albumTrash[index];
    if (album) {
        albums[album.name] = album.data;
        albumTrash.splice(index, 1);
        renderTrash();
        renderAlbums();
    }
}

// Back to Albums
function backToAlbums() {
    settings.currentAlbum = null;
    
    // Recreate the albums section structure
    const albumsSection = document.getElementById('albumsSection');
    albumsSection.innerHTML = `
        <div class="filters">
            <button class="filter-btn active" onclick="filterAlbums('all')">All Albums</button>
            <button class="filter-btn" onclick="filterAlbums('default')">Default</button>
            <button class="filter-btn" onclick="filterAlbums('custom')">Custom</button>
        </div>
        <div class="albums-container" id="albumsContainer"></div>
    `;
    
    // Render albums again
    renderAlbums();
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', initGallery);
