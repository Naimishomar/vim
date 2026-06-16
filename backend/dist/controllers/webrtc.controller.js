"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCloudflareTrack = exports.createCloudflareSession = void 0;
const env_1 = require("../config/env");
const createCloudflareSession = async (req, res) => {
    try {
        const url = `https://rtc.live.cloudflare.com/v1/apps/${env_1.ENV.CLOUDFLARE_APP_ID}/sessions/new`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${env_1.ENV.CLOUDFLARE_API_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        });
        if (!response.ok) {
            const text = await response.text();
            console.error('CF Create Session Error:', text);
            res.status(response.status).json({ error: 'Failed to create CF session', details: text });
            return;
        }
        const data = await response.json();
        res.json(data);
    }
    catch (error) {
        console.error('Error generating Cloudflare session:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.createCloudflareSession = createCloudflareSession;
const createCloudflareTrack = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const url = `https://rtc.live.cloudflare.com/v1/apps/${env_1.ENV.CLOUDFLARE_APP_ID}/sessions/${sessionId}/tracks/new`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${env_1.ENV.CLOUDFLARE_API_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        });
        if (!response.ok) {
            const text = await response.text();
            console.error('CF Create Track Error:', text);
            res.status(response.status).json({ error: 'Failed to create CF track', details: text });
            return;
        }
        const data = await response.json();
        res.json(data);
    }
    catch (error) {
        console.error('Error generating Cloudflare track:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.createCloudflareTrack = createCloudflareTrack;
//# sourceMappingURL=webrtc.controller.js.map