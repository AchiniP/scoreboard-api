const mongoose = require('mongoose');

const userSkillSchema = mongoose.Schema({
    userId: {
        type: String
    },
    skills: [
        {
            category: {
                type: String,
                enum: ['ATTACK', 'DEFENSE', 'MAGIC', 'COOKING', 'CRAFTING']
            },
            score: {
                type: Number
            },
            level: {
                type: Number
            }
        }
    ]
});

module.exports =
    mongoose.models.skill || mongoose.model('skill', userSkillSchema);
