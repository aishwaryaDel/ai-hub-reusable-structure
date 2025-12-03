import express from 'express';
import { loginUser } from '../controllers/authController';
const router = express.Router();
/**
* @openapi
* components:
*   schemas:
*     LoginRequest:
*       type: object
*       required:
*         - email
*         - password
*       properties:
*         email:
*           type: string
*           example: string
*         password:
*           type: string
*           example: string
*/

/**
* @openapi
* /api/auth/login:
*   post:
*     summary: User login
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - email
*               - password
*             properties:
*               email:
*                 type: string
*                 example: string
*               password:
*                 type: string
*                 example: string
*     responses:
*       200:
*         description: Login successful
*       400:
*         description: Missing email or password
*       401:
*         description: Invalid credentials
*       500:
*         description: Internal server error
*/
router.post('/login', loginUser);

export default router;
 