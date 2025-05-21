const Router = require('express');
const router = Router();
const { SharedLocation } = require('../models/sharedLocationModel');
const { validateToken } = require('../middlewares/validateToken');

// Share location
router.post('/share', validateToken, async (req, res) => {
    try {
        const { lat, lng, duration, sharedWith } = req.body;
        const userId = req.user._id;

        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + duration);

        const sharedLocation = new SharedLocation({
            user: userId,
            location: { lat, lng },
            expiresAt,
            sharedWith
        });

        await sharedLocation.save();
        res.status(201).json({ message: 'Location shared successfully', sharedLocation });
    } catch (error) {
        res.status(500).json({ message: 'Error sharing location', error: error.message });
    }
});

// Get shared locations
router.get('/shared-with-me', validateToken, async (req, res) => {
    try {
        const userId = req.user._id;
        const sharedLocations = await SharedLocation.find({
            sharedWith: userId,
            expiresAt: { $gt: new Date() }
        }).populate('user', 'uname');

        res.json(sharedLocations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching shared locations', error: error.message });
    }
});

module.exports = router;
