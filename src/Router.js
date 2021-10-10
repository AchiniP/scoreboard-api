import Express from 'express';
import HealthcheckController from "./controller/HealthcheckController";
import ScoreListController from '../src/controller/ScoreListController';
import AdminController from "./controller/AdminController";

const router = Express.Router();

/**
 * If there any other routesr need to be added in future, you can add them here
 */
router.use('/score', ScoreListController);
router.use('/', HealthcheckController);
router.use('/admin', AdminController);
export default router;

