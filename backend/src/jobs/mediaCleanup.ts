import cron from 'node-cron';
import { redisClient } from '../server';
import { deleteFromR2 } from '../services/r2.service';

export const startMediaCleanupJob = () => {
  // Schedule: At minute 0 past hour 0, 6, 12, and 18 (12:00 AM, 6:00 AM, 12:00 PM, 6:00 PM)
  cron.schedule('0 0,6,12,18 * * *', async () => {
    try {
      console.log('[Media Cleanup Job] Running fixed 6-hour interval cleanup...');
      
      // Get all accumulated media keys
      const mediaKeys = await redisClient.smembers('ephemeral:media:batch');
      
      if (mediaKeys && mediaKeys.length > 0) {
        console.log(`[Media Cleanup Job] Found ${mediaKeys.length} files to delete.`);
        
        for (const s3Key of mediaKeys) {
          await deleteFromR2(s3Key);
        }
        
        // Clear the batch set
        await redisClient.del('ephemeral:media:batch');
        console.log(`[Media Cleanup Job] Successfully wiped ${mediaKeys.length} files from R2.`);
      } else {
        console.log('[Media Cleanup Job] No files to clean up this cycle.');
      }
    } catch (error) {
      console.error('[Media Cleanup Job] Error cleaning up media:', error);
    }
  });
  
  console.log('[Media Cleanup Job] Scheduled for 12:00AM, 6:00AM, 12:00PM, and 6:00PM daily.');
};
