import Logger from "../middleware/Logger";
import UserSkillRepository from "../repository/UserSkillRepository";
import ErrorBase from "../middleware/error/ErrorBase";
import ErrorCodes from "../middleware/error/ErrorCodes";
import ErrorMessages from "../middleware/error/ErrorMessages";
import {StatusCodes} from "http-status-codes";

const LOG = new Logger('UserSkillService.js');

const fetchUserScoreListByCategory = async (category, limit) => {
    LOG.debug(`[Service]: Request Received to fetch Score By Category: ${category} Limit: ${limit}`);
    if (limit == null || limit < 0) {
        throw new ErrorBase(ErrorCodes.VALIDATION_ERROR, ErrorMessages.LIMIT_SHOULD_BE_POSITIVE, StatusCodes.BAD_REQUEST);
    }
    let result;
    if (category === 'OVERALL') {
        result = await UserSkillRepository.fetchOverallScoreOfUsers(limit);
    } else {
        result = await UserSkillRepository.fetchScoreByCategory(category, limit);
    }
    return result;
}

const fetchUserScoreListByUser = async (userId) => {
    LOG.debug(`[Service]: Request Received to fetch Score of User: ${userId}`);
    // check whether user exists
    const user = await UserSkillRepository.findUser(userId);
    if (!user) {
        throw new ErrorBase(ErrorCodes.NOT_FOUND, ErrorMessages.USER_NOT_FOUND, StatusCodes.NOT_FOUND);
    }
    const categorizedData = await UserSkillRepository.fetchScoreByUser(userId);
    const overallData = await UserSkillRepository.fetchOverallScoreByUser(userId);
    return [...categorizedData, ...overallData];
}

export default {
    fetchUserScoreListByCategory,
    fetchUserScoreListByUser
};
