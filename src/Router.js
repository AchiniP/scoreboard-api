import Express from 'express';
import ScoreListController from '../src/controller/ScoreListController';

const router = Express.Router();

/**
 * If there any other routesr need to be added in future, you can add them here
 */
router.use('/score', ScoreListController);
export default router;

