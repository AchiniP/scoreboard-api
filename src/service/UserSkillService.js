import Logger from "../middleware/Logger";
import UserSkillRepository from "../repository/UserSkillRepository";

const LOG = new Logger('UserSkillService.js');

const fetchUserScoreListByCategory = async (category, limit) => {
    LOG.debug(`[Service]: Request Received to fetch Score By Category: ${category} Limit: ${limit}`);
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
    const categorizedData = await UserSkillRepository.fetchScoreByUser(userId);
    const overallData = await UserSkillRepository.fetchOverallScoreByUser(userId);
    return [...categorizedData, overallData];
}

export default {
    fetchUserScoreListByCategory,
    fetchUserScoreListByUser
};
