document.addEventListener('DOMContentLoaded', function () {
    // Create a container for the location message
    const messageContainer = document.createElement('div');
    messageContainer.id = 'location-message';
    messageContainer.style.position = 'fixed';
    messageContainer.style.top = '80px'; // Below the fixed header
    messageContainer.style.left = '50%';
    messageContainer.style.transform = 'translateX(-50%)';
    messageContainer.style.backgroundColor = '#003087'; // Souza Cruz blue
    messageContainer.style.color = 'white';
    messageContainer.style.padding = '10px 20px';
    messageContainer.style.borderRadius = '8px';
    messageContainer.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
    messageContainer.style.zIndex = '1000';
    messageContainer.style.fontSize = '14px';
    messageContainer.style.textAlign = 'center';
    messageContainer.style.display = 'none'; // Hidden initially
    document.body.appendChild(messageContainer);

    // Function to show the message
    function showMessage(message) {
        messageContainer.textContent = message;
        messageContainer.style.display = 'block';
        // Hide the message after 5 seconds
        setTimeout(() => {
            messageContainer.style.display = 'none';
        }, 5000);
    }

    // Function to fetch the city using Nominatim API
    async function getCity(lat, lon) {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Nominatim API response:', data); // Log the API response for debugging
            // Extract the city (or town/village as fallback)
            const city = data.address.city || data.address.town || data.address.village || '';
            if (!city) {
                console.warn('City not found in API response:', data.address);
                return 'sua cidade';
            }
            return city;
        } catch (error) {
            console.error('Erro ao buscar cidade:', error);
            return 'sua cidade'; // Fallback if the API fails
        }
    }

    // Check if geolocation is supported
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                // Success: We got the location
                const { latitude, longitude } = position.coords;
                console.log('User coordinates:', latitude, longitude); // Log coordinates for debugging
                // Fetch the city
                const city = await getCity(latitude, longitude);
                // Show the message in the specified format
                showMessage(`Em ${city} entregamos no mesmo dia!`);
            },
            (error) => {
                // Error: User denied location or other issue
                console.error('Geolocation error:', error);
                showMessage('Não conseguimos acessar sua localização. Verifique a entrega na sua cidade.');
            }
        );
    } else {
        // Geolocation not supported
        showMessage('Seu navegador não suporta localização. Verifique a entrega na sua cidade.');
    }
});