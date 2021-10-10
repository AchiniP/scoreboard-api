const mongoose = require('mongoose');

const userSkillSchema = mongoose.Schema({
    userId: {
        type: String
    },
    category: {
        type: String,
        enum: ['ATTACK', 'DEFENSE', 'MAGIC', 'COOKING', 'CRAFTING']
    },
    score: {
        type: Number
    },
});

module.exports = mongoose.model("score", userSkillSchema);
