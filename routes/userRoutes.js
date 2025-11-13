const express = require('express');
const {
    createUser,
    getUsers,
    getUser,
    updateUser,
    patchUser,
    deleteUser
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

router.route('/')
    .post(createUser)
    .get(getUsers);

router.route('/:id')
    .get(getUser)
    .put(updateUser)
    .patch(patchUser)
    .delete(deleteUser);

module.exports = router;
