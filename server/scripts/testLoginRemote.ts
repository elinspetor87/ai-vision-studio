
const REMOTE_URL = 'https://ai-vision-studioai-vision-studio-backend.onrender.com/api/auth/login';
const CREDENTIALS = {
    email: 'admin@example.com',
    password: 'admin123'
};

console.log(`📡 Attempting login to: ${REMOTE_URL}`);

fetch(REMOTE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(CREDENTIALS)
})
    .then(async res => {
        console.log(`🔄 Status Code: ${res.status}`);
        const data = await res.json();

        if (res.ok) {
            console.log('✅ LOGIN SUCCESSFUL!');
            console.log('   - Token received:', !!data.data?.accessToken);
            console.log('   - User:', data.data?.user?.email);
        } else {
            console.log('❌ LOGIN FAILED');
            console.log('   - Error:', JSON.stringify(data, null, 2));
        }
    })
    .catch(err => {
        console.error('🚨 NETWORK/SCRIPT ERROR:', err);
    });
