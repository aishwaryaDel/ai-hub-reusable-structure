import { Router } from 'express';
import { useCaseController } from '../controllers/useCaseController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();


// router.get('/', (req, res) => useCaseController.getAllUseCases(req, res));

// router.get('/:id', (req, res) => useCaseController.getUseCaseById(req, res));

// router.post('/', (req, res) => useCaseController.createUseCase(req, res));

// router.put('/:id', (req, res) => useCaseController.updateUseCase(req, res));

// router.delete('/:id', (req, res) => useCaseController.deleteUseCase(req, res));

/**
* @openapi
* components:
*   schemas:
*     CreateUseCaseDTO:
*       type: object
*       required:
*         - title
*         - short_description
*         - full_description
*         - department
*         - status
*         - owner_name
*         - owner_email
*         - technology_stack
*         - tags
*         - internal_links
*         - application_url
*       properties:
*         title:
*           type: string
*         short_description:
*           type: string
*         full_description:
*           type: string
*         department:
*           type: string
*         status:
*           type: string
*         owner_name:
*           type: string
*         owner_email:
*           type: string
*         technology_stack:
*           type: array
*           items:
*             type: string
*         tags:
*           type: array
*           items:
*             type: string
*         internal_links:
*           type: object
*           additionalProperties:
*             type: string
*         application_url:
*           type: string
*     UpdateUseCaseDTO:
*       type: object
*       properties:
*         title:
*           type: string
*         short_description:
*           type: string
*         full_description:
*           type: string
*         department:
*           type: string
*         status:
*           type: string
*         owner_name:
*           type: string
*         owner_email:
*           type: string
*         technology_stack:
*           type: array
*           items:
*             type: string
*         tags:
*           type: array
*           items:
*             type: string
*         internal_links:
*           type: object
*           additionalProperties:
*             type: string
*         application_url:
*           type: string
*/

// For each route, add a separate block like this above the route:

/**
* @openapi
* /api/use-cases:
*   get:
*     summary: Get all use cases
*     responses:
*       200:
*         description: List of use cases
*/
router.get('/', (req, res) => useCaseController.getAllUseCases(req, res));

/**
* @openapi
* /api/use-cases:
*   post:
*     summary: Create a new use case
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/CreateUseCaseDTO'
*     responses:
*       201:
*         description: Use case created
*/
router.post('/', authenticateToken, (req, res) => useCaseController.createUseCase(req, res));

/**
* @openapi
* /api/use-cases/{id}:
*   get:
*     summary: Get use case by ID
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*     responses:
*       200:
*         description: Use case found
*       404:
*         description: Use case not found
*/
router.get('/:id', (req, res) => useCaseController.getUseCaseById(req, res));

/**
* @openapi
* /api/use-cases/{id}:
*   put:
*     summary: Update use case by ID
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
*             $ref: '#/components/schemas/UpdateUseCaseDTO'
*     responses:
*       200:
*         description: Use case updated
*       404:
*         description: Use case not found
*/
router.put('/:id', authenticateToken, (req, res) => useCaseController.updateUseCase(req, res));

/**
* @openapi
* /api/use-cases/{id}:
*   delete:
*     summary: Delete use case by ID
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*     responses:
*       200:
*         description: Use case deleted
*       404:
*         description: Use case not found
*/
router.delete('/:id', authenticateToken, (req, res) => useCaseController.deleteUseCase(req, res));

export default router;

 