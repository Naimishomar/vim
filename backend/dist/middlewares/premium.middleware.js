"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requirePremium = void 0;
const requirePremium = (req, res, next) => {
    // @ts-ignore
    const user = req.user;
    if (!user || !user.premiumStatus) {
        res.status(403).json({ error: 'Premium subscription required' });
        return;
    }
    next();
};
exports.requirePremium = requirePremium;
//# sourceMappingURL=premium.middleware.js.map