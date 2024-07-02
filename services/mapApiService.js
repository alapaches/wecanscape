import axios from 'axios';

const API_URL = 'https://nominatim.openstreetmap.org/';

const apiService = {
    // Permet de rechercher une localisation avec une adresse
    async searchLocation(query) {
        try {
            const response = await axios.get(`${API_URL}search`, {
                params: {
                    format: 'json',
                    q: query
                }
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la recherche de l\'emplacement:', error);
            throw error;
        }
    },

    //Permet de récupérer les coordonnées d'une ville
    async getCoordinates(location) {
        try {
            const response = await axios.get(`${API_URL}search`, {
                params: {
                    format: 'json',
                    q: location
                }
            });
            if (response.data && response.data.length > 0) {
                const { lat, lon } = response.data[0];
                return { lat: parseFloat(lat), lng: parseFloat(lon) };
            } else {
                throw new Error('Lieu non trouvé');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des coordonnées:', error);
            throw error;
        }
    },

    // Permet de récupérer une adresse à partir de coordonnées
    async getLocationData(lat, lng) {
        try {
            const response = await axios.get(`${API_URL}reverse`, {
                params: {
                    format: 'json',
                    lat,
                    lon: lng,
                    addressdetails: 1
                }
            });
            return {
                city: response.data.address.road ? `${response.data.address.city}, ${response.data.address.road}` : response.data.address.city,
                latitude: parseFloat(lat),
                longitude: parseFloat(lng)
            };
        } catch (error) {
            console.error('Erreur lors de la récupération des données de localisation:', error);
            throw error;
        }
    }
};

export default apiService;
