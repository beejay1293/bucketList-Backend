import express from 'express';
import userController from '../../controllers/userController';
import Auth from '../../middlewares/isAuth';

const { trimmer } = Auth;

const router = express.Router();

const { signup, login, logout } = userController;

router.post('/signup', trimmer, signup);
router.post('/login', trimmer, login);
router.get('/logout', logout);


export default router;
