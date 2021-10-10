import { StatusCodes } from 'http-status-codes';
import Logger from "../middleware/Logger";
import UserSkill from '../model/UserSkill';
import {
    FETCH_SCORE_OF_USERS_BY_CATEGORY_QUERY,
    FETCH_OVERALL_SCORE_OF_USERS_QUERY,
    FETCH_SCORE_OF_USERS_BY_USER_ID_QUERY,
    FETCH_OVERALL_RANK_OF_USER_QUERY
} from './Query';
import ErrorBase from "../middleware/error/ErrorBase";
import ErrorCodes from "../middleware/error/ErrorCodes";
import ErrorMessages from "../middleware/error/ErrorMessages";

const LOG = new Logger('UserSkillRepository.js');

const findUser = async (userId) => {
    LOG.debug(`Going to Fetch user by user Id: ${userId}`);
    const result = await UserSkill.findOne({ userId : { $regex: new RegExp(`^${userId}$`, 'i')}});
    return result;
}

const fetchOverallScoreOfUsers = async (limit) => {
    LOG.debug(`Going to Fetch top: ${limit} Users based on Score`);
    const result = await UserSkill.aggregate(FETCH_OVERALL_SCORE_OF_USERS_QUERY(parseInt(limit))).catch(
        error => {
            LOG.error(`Error Occurred While fetching Overall Score Of Users. Error: ${error}`);
            throw new ErrorBase(ErrorCodes.DB_ERROR, ErrorMessages.DB_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    );
    return result;
}

const fetchScoreByCategory = async (category, limit) => {
    LOG.debug(`Going to Fetch top: ${limit} Users based on Score in Category: ${category}`);
    const result = await UserSkill.aggregate(FETCH_SCORE_OF_USERS_BY_CATEGORY_QUERY(category,
        parseInt(limit))).catch(
        error => {
            LOG.error(`Error Occurred While fetching Overall Score Of Users by category. Error: ${error}`);
            throw new ErrorBase(ErrorCodes.DB_ERROR, ErrorMessages.DB_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    );
    return result;
}

const fetchScoreByUser = async (userId) => {
    LOG.debug(`Going to Fetch Score of User in each category: ${userId}`);
    const result = await UserSkill.aggregate(FETCH_SCORE_OF_USERS_BY_USER_ID_QUERY(userId)).catch(
        error => {
            LOG.error(`Error Occurred While fetching Overall Score Of Users by category. Error: ${error}`);
            throw new ErrorBase(ErrorCodes.DB_ERROR, ErrorMessages.DB_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    );
    return result;
}

const fetchOverallScoreByUser = async (userId) => {
    LOG.debug(`Going to Fetch overall Score of User in each category: ${userId}`);
    const result = await UserSkill.aggregate(FETCH_OVERALL_RANK_OF_USER_QUERY(userId)).catch(
        error => {
            LOG.error(`Error Occurred While fetching Overall Score Of Users by category. Error: ${error}`);
            throw new ErrorBase(ErrorCodes.DB_ERROR, ErrorMessages.DB_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    );
    return result;
}

export default {
    findUser,
    fetchOverallScoreOfUsers,
    fetchScoreByCategory,
    fetchScoreByUser,
    fetchOverallScoreByUser,
};
