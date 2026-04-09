require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors({
    origin: '*', // Üretim modunda belirli bir domain ile kısıtlamanız güvenli olur.
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// API ayarlarını .env dosyasından çekiyoruz, bu sayede sistemimizi güvenli tutuyoruz
const SERPAPI_KEY = process.env.SERPAPI_KEY;
const PORT = process.env.PORT || 3000;

/**
 * Ana Arama Motoru Ucu
 * Bu endpoint, Google API (SerpApi) üzerinden sadece PDF akademik kaynaklarını tarar.
 */
app.get('/api/search', async (req, res) => {
    try {
        const query = req.query.q;
        const start = req.query.start || 0;

        if (!query) {
            return res.status(400).json({ error: 'Lütfen bir arama terimi girin.' });
        }

        /** 
         * Google'ın 'filetype:pdf' özelliğini kullanarak sadece dökümanlara odaklanıyoruz.
         * num=100 parametresi ile tek seferde çok sayıda ders notu çekiyoruz.
         */
        const encodedQuery = encodeURIComponent(`filetype:pdf ${query}`);
        const serpapiUrl = `https://serpapi.com/search.json?engine=google&q=${encodedQuery}&num=100&start=${start}&api_key=${SERPAPI_KEY}`;
        
        console.log(`[UniNotes] Search initiated: ${query} (Start offset: ${start})`);

        const response = await axios.get(serpapiUrl);
        const searchResults = response.data.organic_results;

        if (!searchResults || searchResults.length === 0) {
            return res.json({ results: [] });
        }

        // Frontend'in kolayca görüntüleyebileceği temiz bir JSON listesi oluşturuyoruz
        const results = searchResults.map(doc => {
            // Kaynak ismini daha okunaklı hale getirmek için temizlik yapıyoruz
            let domain = doc.displayed_link || 'Bilinmeyen Kaynak';
            if (domain.includes(' › ')) {
                domain = domain.split(' › ')[0];
            }

            return {
                title: doc.title || 'Ders Notu (PDF)',
                url: doc.link,
                snippet: doc.snippet ? doc.snippet.replace(/\n/g, ' ') : `"${query}" hakkında üniversite kaynaklı döküman.`,
                source: domain,
                date: new Date().toLocaleDateString('tr-TR') // Notun listeye eklenme tarihi
            };
        });

        res.json({ results });
    } catch (error) {
        console.error("[UniNotes Error] Search failed:", error.message);
        res.status(500).json({ error: 'Sunucuyla bağlantı kurulamadı, lütfen daha sonra tekrar deneyin.' });
    }
});

// Uygulamayı belirtilen port üzerinden dinlemeye başlıyoruz
app.listen(PORT, () => {
    console.log(`[UniNotes] Backend service is running at http://localhost:${PORT}`);
});
