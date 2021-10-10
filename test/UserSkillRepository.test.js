import UserSkill from '../src/model/UserSkill';
import data from './utils/ScoreDataCollection.json';
import {
    FETCH_OVERALL_RANK_OF_USER_QUERY,
    FETCH_OVERALL_SCORE_OF_USERS_QUERY,
    FETCH_SCORE_OF_USERS_BY_CATEGORY_QUERY, FETCH_SCORE_OF_USERS_BY_USER_ID_QUERY
} from "../src/repository/Query";

beforeAll(async() => {
    data.map(async record => UserSkill.create(record));
})

describe("test queries", ()=>{
   it("should fetch overall score of all the users", async () => {
       const user =  await UserSkill.findOne({ userId: {$regex: /^amazing-drummle-18$/i}});
       expect(user.userId).toBe('Amazing-drummle-18');

       // caseInsensitive search
       const user2 =  await UserSkill.findOne({ userId: {$regex: /^amazing-drummle-18$/i}});
       expect(user2.userId).toBe('Amazing-drummle-18');

       // user not found
       const user3 =  await UserSkill.findOne({ userId: {$regex: /^amazing-$/i}});
       expect(user3).toBeNull();


       const overallScoreResp = await UserSkill.aggregate(FETCH_OVERALL_SCORE_OF_USERS_QUERY(3));
       // should return limit
       expect(overallScoreResp.length).toBe(3);
       //should return rank in order
       expect(overallScoreResp[1].rank).toBe(2);
       // should give total score
       expect(overallScoreResp[0].score).toBe(3298);
       // should give category as overall
       expect(overallScoreResp[0].category).toBe("OVERALL");

       const scoreByCategory = await UserSkill.aggregate(FETCH_SCORE_OF_USERS_BY_CATEGORY_QUERY("DEFENSE", 2));

       expect(scoreByCategory.length).toBe(2);
       // //should return rank in order
       expect(scoreByCategory[0].userId).toBe('Amazing-drummle-18');
       expect(scoreByCategory[1].rank).toBe(2);
       // // should give total score
       expect(scoreByCategory[0].score).toBe(798);
       // // should give category as overall
       expect(scoreByCategory[0].category).toBe("DEFENSE");

       const scoreByUser = await UserSkill.aggregate(FETCH_SCORE_OF_USERS_BY_USER_ID_QUERY('Amazing-drummle-18'));
       expect(scoreByUser.length).toBe(5);
       // should return rank of each category
       expect(scoreByUser.filter( u => u.category === 'COOKING')[0].rank).toBe(4);
       expect(scoreByUser.filter( u => u.category === 'DEFENSE')[0].rank).toBe(1);

       const overallScoreByUser = await UserSkill.aggregate(FETCH_OVERALL_RANK_OF_USER_QUERY('Amazing-drummle-18'));
       expect(overallScoreByUser[0].score).toBe(2215)
       expect(overallScoreByUser[0].category).toBe('OVERALL')
   });
});





