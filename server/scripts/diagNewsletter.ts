
import axios from 'axios';

const testSubscription = async () => {
    try {
        const email = `test_${Date.now()}@example.com`;
        console.log(`Attempting to subscribe with ${email}...`);

        const response = await axios.post('http://localhost:5000/api/newsletter/subscribe', {
            email,
            source: 'diagnostic_script'
        });

        console.log('✅ Subscription successful!');
        console.log('Status:', response.status);
        console.log('Data:', response.data);

    } catch (error: any) {
        console.error('❌ Subscription failed!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
};

testSubscription();
