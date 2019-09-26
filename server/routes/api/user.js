import express from 'express';
import userController from '../../controllers/userController';
import Auth from '../../middlewares/isAuth';

const { trimmer } = Auth;

const router = express.Router();

const { signup, login } = userController;

router.post('/signup', trimmer, signup);
router.post('/login', trimmer, login);

export default router;
