/**
 * UniNotes Frontend Kontrolcü Dosyası
 * Arayüz etkileşimlerini, API isteklerini ve dinamik listelemeyi yönetir.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // Uygulama Ayarları - Üretime geçerken burayı gerçek backend adresinizle değiştirin.
    // Örn: https://uninotes-backend.onrender.com
    const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3000'
        : ''; // Burayı deploy ettiğiniz backend adresiyle doldurun.

    // Temel kullanıcı arayüzü elementlerini seçiyoruz
    const searchBtn = document.querySelector('.btn-search');
    const searchInput = document.getElementById('mainSearch');
    const grid = document.getElementById('notesGrid');
    const loadMoreContainer = document.getElementById('loadMoreContainer');
    const btnLoadMore = document.getElementById('btnLoadMore');
    
    const controlsPanel = document.getElementById('controlsPanel');
    const resultsCount = document.getElementById('resultsCount');

    // PDF Önizleme ekranı (Modal) elementleri
    const previewModal = document.getElementById('previewModal');
    const btnCloseModal = document.getElementById('btnCloseModal');
    const previewFrame = document.getElementById('previewFrame');
    const previewTitle = document.getElementById('previewTitle');
    const modalDownloadBtn = document.getElementById('modalDownloadBtn');

    // Arama durumunu takip eden değişkenlerimiz
    let allResults = [];
    let currentOffset = 0;
    let currentQuery = '';

    /**
     * Ana Arama Fonksiyonu
     * @param {string} query - Arama yapılacak terim
     * @param {boolean} isLoadMore - Mevcut sonuçların üzerine mi eklenecek?
     */
    const performSearch = async (query, isLoadMore = false) => {
        if(!query.trim()) return;

        // Yeni bir arama başlatılıyorsa listeleri ve ayarları sıfırlıyoruz
        if (!isLoadMore) {
            currentOffset = 0;
            currentQuery = query;
            allResults = [];
            grid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 60px 40px;">
                    <div class="empty-icon-wrapper">
                        <i class="ri-loader-4-line ri-spin"></i>
                    </div>
                    <h3 style="font-size: 1.5rem; color: var(--color-white); margin-bottom: 8px;">Dökümanlar Aranıyor...</h3>
                    <p>Google altyapısı üzerinden PDF dosyaları taranıyor.</p>
                </div>
            `;
            loadMoreContainer.style.display = 'none';
            controlsPanel.style.display = 'none';
        }

        // Yükleme durumu animasyonları
        if (isLoadMore) {
            btnLoadMore.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Yükleniyor...';
            btnLoadMore.disabled = true;
        } else {
            searchBtn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i>';
            searchBtn.disabled = true;
        }

        try {
            /** 
             * Node.js backend servisimize istek atıyoruz. 
             * Offset parametresi ile sayfalama (pagination) yapıyoruz.
             */
            const apiUrl = `${API_BASE_URL}/api/search?q=${encodeURIComponent(query)}&start=${currentOffset}`;
            
            // Eğer API adresi boşsa (Production modunda ve URL set edilmemişse) kullanıcıyı uyar
            if (!API_BASE_URL && window.location.hostname !== 'localhost') {
                throw new Error("API adresi yapılandırılmamış. Lütfen script.js içindeki API_BASE_URL değişkenini güncelleyin.");
            }

            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error("Dosyalar alınırken bir hata oluştu.");
            
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                // Verileri ana listeye ekliyoruz
                if (isLoadMore) {
                    allResults = [...allResults, ...data.results];
                } else {
                    allResults = data.results;
                }
                
                // Sonuçları göster
                displayResults();
                
                // Daha fazla sonuç varsa 'Daha Fazla Yükle' butonunu açıyoruz
                if (data.results.length >= 10) {
                    currentOffset += data.results.length;
                    loadMoreContainer.style.display = 'flex';
                } else {
                    loadMoreContainer.style.display = 'none';
                }
                
                controlsPanel.style.display = 'flex';
            } else {
                if (!isLoadMore) {
                    grid.innerHTML = `
                        <div class="empty-state">
                            <h3 style="color:white">Sonuç Bulunamadı</h3>
                            <p>Aradığınız konuyla ilgili bir PDF dosyasına rastlayamadık.</p>
                        </div>`;
                    controlsPanel.style.display = 'none';
                }
                loadMoreContainer.style.display = 'none';
            }
        } catch (error) {
            console.error("[UniNotes Error] Data fetching failed:", error);
        } finally {
            searchBtn.innerHTML = 'Arama Yap';
            searchBtn.disabled = false;
            btnLoadMore.innerHTML = '<i class="ri-add-line"></i> Daha Fazla Yükle';
            btnLoadMore.disabled = false;
        }
    };

    /**
     * Sonuçları Görüntüleme Mantığı
     */
    const displayResults = () => {
        const processed = [...allResults];

        // Listeyi sıfırla ve yeniden oluştur
        grid.innerHTML = '';
        renderResults(processed, grid);
        resultsCount.textContent = `${processed.length} akademik döküman listeleniyor`;
    };

    /**
     * Sonuçları HTML Kartlarına Dönüştürme
     * @param {Array} results - İşlenecek sonuç listesi
     * @param {HTMLElement} container - Kartların ekleneceği grid alanı
     */
    const renderResults = (results, container) => {
        results.forEach(result => {
            const article = document.createElement('article');
            article.className = 'card';
            article.innerHTML = `
                <div class="card-header">
                    <div class="card-icon"><i class="ri-file-pdf-fill"></i></div>
                    <span class="card-date">${result.date}</span>
                </div>
                <div class="card-body">
                    <h3 class="card-title">${result.title}</h3>
                    <p class="card-meta"><i class="ri-global-line"></i> ${result.source}</p>
                    <p class="card-meta" style="font-size:0.85rem; opacity:0.8;">${result.snippet}</p>
                </div>
                <div class="card-actions" style="display:flex; gap:10px;">
                    <button class="btn-download btn-preview" style="background:rgba(59,130,246,0.1); color:var(--color-primary); border-color:var(--color-primary);">
                        <i class="ri-eye-line"></i> Görüntüle
                    </button>
                    <a href="${result.url}" target="_blank" class="btn-download">
                        <i class="ri-download-cloud-line"></i> İndir
                    </a>
                </div>
            `;
            
            // Önizleme butonu tetikleyicisi
            article.querySelector('.btn-preview').onclick = () => openPreview(result);
            
            container.appendChild(article);
        });
    };

    /**
     * Canlı PDF Önizleme Modalı
     * Dosyayı indirmeden tarayıcı üzerinde görüntülemeyi sağlar.
     */
    const openPreview = (result) => {
        previewTitle.textContent = result.title;
        // Google PDF Viewer altyapısını kullanarak dosyayı çekiyoruz
        const previewUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(result.url)}&embedded=true`;
        previewFrame.src = previewUrl;
        modalDownloadBtn.href = result.url;
        previewModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Sayfa kaydırmayı durdur
    };

    /**
     * Önizleme Ekranını Kapatma
     */
    const closePreview = () => {
        previewModal.classList.remove('active');
        previewFrame.src = '';
        document.body.style.overflow = 'auto'; // Sayfa kaydırmayı geri aç
    };

    // --- Olay Dinleyicileri (Event Listeners) ---
    
    // Arama butonu tıklandığında
    searchBtn.addEventListener('click', () => performSearch(searchInput.value));
    
    // Enter tuşuna basıldığında
    searchInput.addEventListener('keypress', (e) => e.key === 'Enter' && performSearch(searchInput.value));
    
    // Dah fazla yükle tıklandığında
    btnLoadMore.addEventListener('click', () => performSearch(currentQuery, true));
    
    // Modal kapatma butonu
    btnCloseModal.addEventListener('click', closePreview);
    
    // Modalın dış alanına tıklandığında kapatma
    previewModal.addEventListener('click', (e) => {
        if (e.target === previewModal) closePreview();
    });

    // Sayfa yüklendiğinde arama kutusuna otomatik odaklan
    searchInput.focus();
});
