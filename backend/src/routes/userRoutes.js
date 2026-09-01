const { Router } = require('express');
const UserController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = Router();

router.get(
    '/',
    authMiddleware,
    roleMiddleware(['ADMINISTRADOR']),
    UserController.getAll
);

router.get(
    '/:id',
    authMiddleware,
    roleMiddleware(['ADMINISTRADOR']),
    UserController.getById
);

router.post(
    '/',
    authMiddleware,
    roleMiddleware(['ADMINISTRADOR']),
    UserController.create
);

router.put(
    '/:id',
    authMiddleware,
    roleMiddleware(['ADMINISTRADOR']),
    UserController.update
);

router.patch(
    '/:id/status',
    authMiddleware,
    roleMiddleware(['ADMINISTRADOR']),
    UserController.toggleStatus
);

module.exports = router;
