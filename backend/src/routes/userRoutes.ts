import { Router } from 'express';
import { userController } from '../controllers/userController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

/**
* @openapi
* components:
*   schemas:
*     CreateUserDTO:
*       type: object
*       required:
*         - name
*         - email
*         - password
*       properties:
*         name:
*           type: string
*           example: string
*         email:
*           type: string
*           example: string
*         password:
*           type: string
*           example: string
*         role:
*           type: string
*           example: admin
* @openapi
* /api/users:
*   get:
*     summary: Get all users
*     responses:
*       200:
*         description: List of users
*   post:
*     summary: Create a new user
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/CreateUserDTO'
*     responses:
*       201:
*         description: User created
*
* /api/users/{id}:
*   get:
*     summary: Get user by ID
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*     responses:
*       200:
*         description: User found
*       404:
*         description: User not found
*   put:
*     summary: Update user by ID
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/UpdateUserDTO'
*     responses:
*       200:
*         description: User updated
*       404:
*         description: User not found
*   delete:
*     summary: Delete user by ID
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*     responses:
*       200:
*         description: User deleted
*       404:
*         description: User not found **/

router.get('/', authenticateToken, (req, res, next) => userController.getAllUsers(req, res, next));

router.get('/:id', authenticateToken, (req, res, next) => userController.getUserById(req, res, next));

router.post('/', authenticateToken, (req, res, next) => userController.createUser(req, res, next));

router.put('/:id', authenticateToken, (req, res, next) => userController.updateUser(req, res));

router.delete('/:id', authenticateToken, (req, res, next) => userController.deleteUser(req, res));

export default router;

 