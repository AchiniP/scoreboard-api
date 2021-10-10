import Express from 'express';
import { StatusCodes } from 'http-status-codes';
import validation from 'express-joi-validation';
import Joi from 'joi';
import Logger from '../middleware/Logger';
import UserSkillService from '../service/UserSkillService';

const ScoreListController = Express.Router();
const validator = validation.createValidator({ passError: true });
const LOG = new Logger('ScoreListController.js');

/**
 * Schema Validation for getScoreListByCategory
 * @type {Joi.ObjectSchema<any>}
 */
const FETCH_SCORE_BY_CATEGORY_SCHEMA = Joi.object().keys({
    category: Joi.string().valid('OVERALL', 'ATTACK', 'DEFENSE', 'MAGIC', 'COOKING', 'CRAFTING').required(),
    limit: Joi.number()
});

/**
 * Schema Validation for getScoreListByUserId
 * @type {Joi.ObjectSchema<any>}
 */
const FETCH_SCORE_BY_USERID_SCHEMA = Joi.object().keys({
    userId: Joi.string().required()
});

const getScoreListByCategory = async (req, res, next) => {
    const { category } = req.params;
    const { limit } = req.query;
    LOG.info(`[ROUTER][USER]: request received for retrieve top: ${limit} score for category: ${category}`);
    return UserSkillService.fetchUserScoreListByCategory(category, limit)
        .then(result => res.status(StatusCodes.OK).send(result))
        .catch(error => {
            LOG.error(`[ROUTER][ADMIN]: error occurred while retrieving data: ${error.message}`);
            return next(error)
        })
}

const getScoreListByUserId = async (req, res, next) => {
    const { userId } = req.params;
    LOG.info(`[ROUTER][USER]: request received for retrieve score for user: ${userId}`);
    return UserSkillService.fetchUserScoreListByUser(userId)
        .then(result => res.status(StatusCodes.OK).send(result))
        .catch(error => {
            LOG.error(`[ROUTER][ADMIN]: error occurred while retrieving data: ${error.message}`);
            return next(error)
        })
}

ScoreListController.get('/category/:category', validator.params(FETCH_SCORE_BY_CATEGORY_SCHEMA), getScoreListByCategory);
ScoreListController.get('/user/:userId', validator.params(FETCH_SCORE_BY_USERID_SCHEMA), getScoreListByUserId);

export default ScoreListController;
