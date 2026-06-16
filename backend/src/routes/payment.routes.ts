import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { ENV } from '../config/env';
import User from '../models/User';
import { requireAuth } from '../middlewares/auth.middleware';

const router = express.Router();

const razorpay = new Razorpay({
  key_id: ENV.RAZORPAY_KEY_ID,
  key_secret: ENV.RAZORPAY_KEY_SECRET,
});

router.post('/create-order', requireAuth, async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: `receipt_order_${Math.floor(Math.random() * 1000)}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Error creating razorpay order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

router.post('/verify', requireAuth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", ENV.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment is successful, upgrade user to premium
      const user = await User.findById((req as any).user.id);
      if (user) {
        // Fetch order to get the amount paid
        const order = await razorpay.orders.fetch(razorpay_order_id);
        const amountPaid = (order as any).amount / 100;
        
        let daysToAdd = 30; // default for 199
        if (amountPaid === 49) daysToAdd = 1;
        if (amountPaid === 499) daysToAdd = 90;
        if (amountPaid === 1499) daysToAdd = 365;

        user.premiumStatus = true;
        
        const now = new Date();
        if (user.premiumExpiryDate && user.premiumExpiryDate > now) {
          // Add to existing
          const newExpiry = new Date(user.premiumExpiryDate);
          newExpiry.setDate(newExpiry.getDate() + daysToAdd);
          user.premiumExpiryDate = newExpiry;
        } else {
          // Set new expiry
          const newExpiry = new Date();
          newExpiry.setDate(newExpiry.getDate() + daysToAdd);
          user.premiumExpiryDate = newExpiry;
        }
        
        await user.save();
      }
      return res.json({ success: true, message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid signature sent!" });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

export default router;
