'use strict';

const axios = require('axios');
const qs = require('qs');

class M_PesaAuth {
    constructor(consumerKey, consumerSecret, shortcode) {
        this.consumerKey = consumerKey;
        this.consumerSecret = consumerSecret;
        this.shortcode = shortcode;
        this.token = null;
        this.tokenExpiry = null;
    }

    async getAccessToken() {
        const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');

        try {
            const response = await axios.post(
                'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
                {},
                {
                    headers: {
                        'Authorization': `Basic ${auth}`
                    }
                }
            );

            this.token = response.data.access_token;
            this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
            return this.token;
        } catch (error) {
            throw new Error('Failed to retrieve access token: ' + error.message);
        }
    }

    isTokenValid() {
        return this.token && (Date.now() < this.tokenExpiry);
    }
}

module.exports = M_PesaAuth;
