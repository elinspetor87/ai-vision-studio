
const URLS = [
    'https://ai-vision-studioai-vision-studio-backend.onrender.com/api/social-media',
    'https://ai-vision-studioai-vision-studio-backend.onrender.com/api/social-media/'
];

async function testRedirects() {
    for (const url of URLS) {
        console.log(`\n🔍 Testing: ${url}`);
        try {
            const res = await fetch(url, { method: 'GET', redirect: 'manual' });
            console.log(`📡 Status: ${res.status}`);
            console.log(`📂 Location Header: ${res.headers.get('location')}`);

            if (res.status === 301 || res.status === 308) {
                console.log('⚠️ REDIRECT DETECTED!');
            } else {
                console.log('✅ No Redirect.');
            }
        } catch (err) {
            console.error('🚨 Error:', err);
        }
    }
}

testRedirects();
