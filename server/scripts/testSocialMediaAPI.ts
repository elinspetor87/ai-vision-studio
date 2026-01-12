
import axios from 'axios';

const PROD_URL = 'https://ai-vision-studio-backend.onrender.com/api/social-media';

async function testSocialMediaAPI() {
    console.log(`📡 Testing POST to: ${PROD_URL}`);

    try {
        // Note: This test won't have the auth token, but we should see if it's a 301 or a 401
        // If it's 401, then the 301 is fixed.
        const res = await axios.post(PROD_URL, {
            platform: 'LinkedIn',
            username: 'testuser',
            url: 'https://linkedin.com/in/testuser'
        }, {
            validateStatus: () => true // Don't throw on error codes
        });

        console.log(`📡 Status: ${res.status}`);
        if (res.status === 301 || res.status === 308) {
            console.log('❌ REDIRECT STILL OCCURRING!');
            console.log('   - Location:', res.headers.location);
        } else if (res.status === 401) {
            console.log('✅ Success: Redirect bypassed (Received 401 Unauthorized as expected without token).');
        } else {
            console.log('ℹ️ Status:', res.status, res.data);
        }

    } catch (error: any) {
        console.error('🚨 Request failed:', error.message);
    }
}

testSocialMediaAPI();
