import Express from 'express';
import { StatusCodes } from 'http-status-codes';
import validation from 'express-joi-validation';
import Joi from 'joi';
import rug from 'random-username-generator';
import Logger from '../middleware/Logger';
import UserSkill from '../model/UserSkill';

const AdminController = Express.Router();
const validator = validation.createValidator({ passError: true });
const LOG = new Logger('AdminController.js');

/**
 * Schema Validation for generateUserSkillsDocuments
 * @type {Joi.ObjectSchema<any>}
 */
const MAX_NUM_OF_USERS = Joi.object().keys({
    count: Joi.number().positive().max(500).required()
});

const generateUserSkillsDocuments = async (req, res, next) => {
    const { count } = req.query;
    LOG.info(`[ROUTER][ADMIN]: request received to generate ${count} number of users`);
    res.status(StatusCodes.OK).send();
    //request will be processed in background
    generateDocuments(count);
}

const generateDocuments = (maxCount) => {
    for (let i=0; i<maxCount; i++){
        const categoryList = ['ATTACK', 'DEFENSE', 'MAGIC', 'COOKING', 'CRAFTING']
        const name = rug.generate();
        const dataArr = categoryList.reduce(
            (res, record) => {
                const obj = {
                    category: record,
                    score: Math.floor(Math.random() * 1000) + 100,
                    level: Math.floor(Math.random() * 100) + 1
                }
                res.push(obj);
                return res;
            }, []);
        LOG.info(`Saving user: ${name}`);
        const skill = new UserSkill({
            userId: name,
            skills: dataArr

        });
        skill.save().catch("Error occurred");
    }
}

AdminController.post('/userSkills', validator.query(MAX_NUM_OF_USERS), generateUserSkillsDocuments);

export default AdminController;
