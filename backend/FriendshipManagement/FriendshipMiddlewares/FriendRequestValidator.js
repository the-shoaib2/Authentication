const { body, validationResult } = require('express-validator');

const validateFriendRequest = [
    body('receiverId').isMongoId().withMessage('Receiver ID must be a valid MongoDB ID'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = validateFriendRequest;
