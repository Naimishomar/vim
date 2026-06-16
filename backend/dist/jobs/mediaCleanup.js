"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startMediaCleanupJob = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const server_1 = require("../server");
const r2_service_1 = require("../services/r2.service");
const startMediaCleanupJob = () => {
    // Schedule: At minute 0 past hour 0, 6, 12, and 18 (12:00 AM, 6:00 AM, 12:00 PM, 6:00 PM)
    node_cron_1.default.schedule('0 0,6,12,18 * * *', async () => {
        try {
            console.log('[Media Cleanup Job] Running fixed 6-hour interval cleanup...');
            // Get all accumulated media keys
            const mediaKeys = await server_1.redisClient.smembers('ephemeral:media:batch');
            if (mediaKeys && mediaKeys.length > 0) {
                console.log(`[Media Cleanup Job] Found ${mediaKeys.length} files to delete.`);
                for (const s3Key of mediaKeys) {
                    await (0, r2_service_1.deleteFromR2)(s3Key);
                }
                // Clear the batch set
                await server_1.redisClient.del('ephemeral:media:batch');
                console.log(`[Media Cleanup Job] Successfully wiped ${mediaKeys.length} files from R2.`);
            }
            else {
                console.log('[Media Cleanup Job] No files to clean up this cycle.');
            }
        }
        catch (error) {
            console.error('[Media Cleanup Job] Error cleaning up media:', error);
        }
    });
    console.log('[Media Cleanup Job] Scheduled for 12:00AM, 6:00AM, 12:00PM, and 6:00PM daily.');
};
exports.startMediaCleanupJob = startMediaCleanupJob;
//# sourceMappingURL=mediaCleanup.js.map