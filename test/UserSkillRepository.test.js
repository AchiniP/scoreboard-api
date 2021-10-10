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
       const user =  await UserSkill.findOne({ userId: {$regex: /^gentle-harry-61$/i}});
       expect(user.userId).toBe('gentle-harry-61');

       // caseInsensitive search
       const user2 =  await UserSkill.findOne({ userId: {$regex: /^GENTLE-harry-61$/i}});
       expect(user2.userId).toBe('gentle-harry-61');

       // user not found
       const user3 =  await UserSkill.findOne({ userId: {$regex: /^gentle-$/i}});
       expect(user3).toBeNull();


       const overallScoreResp = await UserSkill.aggregate(FETCH_OVERALL_SCORE_OF_USERS_QUERY(3));
       // should return limit
       expect(overallScoreResp.length).toBe(3);
       //should return same rank if score is equal
       expect(overallScoreResp[0].rank).toBe(1);
       expect(overallScoreResp[1].rank).toBe(1);
       expect(overallScoreResp[2].rank).toBe(3);
       // should give total score
       expect(overallScoreResp[0].score).toBe(2898);
       // should give category as overall
       expect(overallScoreResp[0].category).toBe("OVERALL");

       const scoreByCategory = await UserSkill.aggregate(FETCH_SCORE_OF_USERS_BY_CATEGORY_QUERY("DEFENSE", 4));

       expect(scoreByCategory.length).toBe(4);
       //should return rank in order
       expect(scoreByCategory[0].userId).toBe('Favorable-trustee-54');

       // should return same rank for equal values
       expect(scoreByCategory[1].rank).toBe(2);
       expect(scoreByCategory[2].rank).toBe(2);
       // should give total score
       expect(scoreByCategory[0].score).toBe(1048);
       // should give category as overall
       expect(scoreByCategory[0].category).toBe("DEFENSE");

       const scoreByUser = await UserSkill.aggregate(FETCH_SCORE_OF_USERS_BY_USER_ID_QUERY('charming-critic-90'));
       expect(scoreByUser.length).toBe(5);
       // should return rank of each category
       expect(scoreByUser.filter( u => u.category === 'DEFENSE')[0].rank).toBe(2);

       const overallScoreByUser = await UserSkill.aggregate(FETCH_OVERALL_RANK_OF_USER_QUERY('charming-critic-90'));
       expect(overallScoreByUser[0].score).toBe(2556)
       expect(overallScoreByUser[0].category).toBe('OVERALL')
   });
});





