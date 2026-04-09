# 🎓 UniNotes - Modern Üniversite PDF Arama Motoru

UniNotes, üniversite öğrencilerinin ders notlarına, özetlere ve akademik dökümanlara saniyeler içinde ulaşmasını sağlayan modern, hızlı ve açık kaynaklı bir arama platformudur. Google arama motorunun gücünü kullanarak internet üzerindeki sadece akademik PDF dosyalarını tarar ve size reklamsız, temiz bir listeleme sunar.

![UniNotes Preview](assets/preview.png)

## ✨ Öne Çıkan Özellikler

- **🔍 Hassas PDF Filtreleme:** Sadece `.pdf` uzantılı ve üniversite kaynaklı dökümanları listeler.
- **👁️ Anında Önizleme:** Google Docs Viewer entegrasyonu ile dosyaları indirmeden tarayıcıda görüntüleyin.
- **📱 Kesintisiz Responsive Deneyim:** Mobil cihazlarda kusursuz çalışan, modern ve premium karanlık tema.
- **⚡ Işık Hızında Performans:** Node.js backend ve optimize edilmiş vanilya JS frontend.
- **🌊 Glassmorphism Tasarım:** Modern UI trendlerine uygun, göz yormayan şeffaf arayüz.

## 🌐 Canlı Yayına Alma (Deployment)

Projeyi internette yayınlarken frontend ve backend kısımlarını ayrı ayrı düşünmelisiniz:

### 1. Backend (Sunucu) Yayını
Backend kodunuzu ([Render](https://render.com/), [Railway](https://railway.app/) veya [DigitalOcean](https://www.digitalocean.com/)) gibi servislerde yayınlayın.
- `.env` ayarlarını (API anahtarı) bu platformların "Environment Variables" kısmına ekleyin.

### 2. Frontend (Arayüz) Bağlantısı
Frontend'i Cloudflare Pages, Vercel veya Netlify gibi servislerde yayınladıktan sonra:
- `script.js` dosyasını açın.
- Üst kısımdaki `API_BASE_URL` değişkenini, canlıdaki backend adresinizle değiştirin.
- Örnek: `const API_BASE_URL = "https://backend-adresiniz.com";`

> [!IMPORTANT]
> Tarayıcıların güvenlik kuralları gereği, Cloudflare gibi HTTPS üzerinden yayınlanan siteler `http://localhost:3000` adresine bağlanamazlar. Bu nedenle dışarıdan erişim (arkadaşlarınızın açabilmesi) için mutlaka backend'i de bir sunucuya yüklemeli ve HTTPS adresini kullanmalısınız.

## 🚀 Yerel Hızlı Kurulum

Projeyi kendi bilgisayarınızda çalıştırmak için:
1. Depoyu klonlayın.
2. `npm install` ile bağımlılıkları yükleyin.
3. `.env` dosyasına `SERPAPI_KEY` ekleyin.
4. `npm start` ile başlatın.

## 🛠️ Teknik Mimari

- **Backend:** Node.js & Express
- **Frontend:** Vanilla JS & CSS Glassmorphism
- **API:** SerpApi (Google Search Engine)

## 🤝 Katkıda Bulunma

Bu proje açık kaynaklıdır! Katkıda bulunmak isterseniz:
1. Depoyu forklayın.
2. Yeni bir feature branch oluşturun (`git checkout -b feature/yeniozellik`).
3. Değişikliklerinizi commit edin (`git commit -m 'Yenilik eklendi'`).
4. Branch'inizi push edin (`git push origin feature/yeniozellik`).
5. Bir Pull Request açın.

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) ile lisanslanmıştır. Daha fazla bilgi için LICENSE dosyasına göz atabilirsiniz.

---
*Geleceğin notlarını bugünden keşfedin. - UniNotes*
