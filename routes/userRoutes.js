const express = require('express');
const {
    createUser,
    getUsers,
    getUser,
    updateUser,
    patchUser,
    deleteUser
} = require('../controllers/userController');

const router = express.Router();

router.route('/')
    .post(createUser)
    .get(getUsers);

router.route('/:id')
    .get(getUser)
    .put(updateUser)
    .patch(patchUser)
    .delete(deleteUser);

module.exports = router;
