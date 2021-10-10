import sinon from "sinon";
import UserSkillService from "../src/service/UserSkillService";
import UserSkillRepository from "../src/repository/UserSkillRepository";
import ErrorMiddleware from "../src/middleware/error/ErrorBase";
const overallScoreData = require("./utils/OverallRank.json");
const categorizedScoreData = require("./utils/ScoreByCategory.json");
const overallScoreByUser = require("./utils/OverallScoreByUser.json");
const categorizedScoreByUser = require("./utils/CategoryScoreByUser.json");

describe("fetchUserScoreListByCategory", () =>{
    let dbStub;
    let dbStubMethod2;

    beforeEach(() => {
        dbStub = sinon.stub(UserSkillRepository, "fetchOverallScoreOfUsers");
        dbStubMethod2 = sinon.stub(UserSkillRepository, "fetchScoreByCategory");
    });

    afterEach(() => {
        dbStub.restore();
        dbStubMethod2.restore();
    });

    it("should sum up and give the overall results", async () => {
        dbStub.returns(Promise.resolve(overallScoreData));
        const result = await UserSkillService.fetchUserScoreListByCategory("OVERALL", 25);
        expect(result.length).toBe(25);
        expect(result[0].category).toBe('OVERALL');
        expect(result[0].rank).toBe(1);
    });

    it("should sum up and give the overall results by category", async () => {
        dbStubMethod2.returns(Promise.resolve(categorizedScoreData));
        const result = await UserSkillService.fetchUserScoreListByCategory("DEFENSE", 25);
        expect(result.length).toBe(3);
        expect(result[0].category).toBe('DEFENSE');
        expect(result[0].rank).toBe(1);
    });

    it("should throw an proper error upon DB error", async () => {
        dbStub.returns(Promise.reject(new ErrorMiddleware("test", "test" , 500)));
        try {
            const result = await UserSkillService.fetchUserScoreListByCategory("OVERALL", 25);
        } catch(err){
           expect(err.httpStatusCode).toBe(500);
           expect(err.errorCode).toBe("test");
        }
    });
});


describe("fetchUserScoreListByUser", () =>{
    let fetchUserSkill;
    let fetchUserSkillOverall;
    let findUserStub;

    beforeEach(() => {
        fetchUserSkill = sinon.stub(UserSkillRepository, "fetchScoreByUser");
        fetchUserSkillOverall = sinon.stub(UserSkillRepository, "fetchOverallScoreByUser");
        findUserStub = sinon.stub(UserSkillRepository, "findUser");
    });

    afterEach(() => {
        fetchUserSkill.restore();
        fetchUserSkillOverall.restore();
        findUserStub.restore();
    });

    it("should return the result with overall status", async () => {
        fetchUserSkill.returns(Promise.resolve(categorizedScoreByUser));
        fetchUserSkillOverall.returns(Promise.resolve(overallScoreByUser));
        findUserStub.returns(Promise.resolve({ userId: "Spectacular-horseman-27"}));
        const result = await UserSkillService.fetchUserScoreListByUser("Spectacular-horseman-27");
        expect(result.length).toBe(categorizedScoreByUser.length + overallScoreByUser.length);
    });

    it("should throw an proper error upon DB error when fetch data by uset", async () => {
        findUserStub.returns(Promise.resolve({ userId: "Spectacular-horseman-27"}));
        fetchUserSkill.returns(Promise.reject(new ErrorMiddleware("test", "test" , 500)));
        try {
            const result = await UserSkillService.fetchUserScoreListByUser("Spectacular-horseman-27");
        } catch(err){
            expect(err.httpStatusCode).toBe(500);
            expect(err.errorCode).toBe("test");
        }
    });
})
