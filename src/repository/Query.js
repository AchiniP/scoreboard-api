export const FETCH_OVERALL_SCORE_OF_USERS_QUERY = (limit) =>  [
    {
        '$addFields': {
            'level': {
                '$reduce': {
                    'input': '$skills',
                    'initialValue': 0,
                    'in': {
                        '$add': [
                            '$$value', '$$this.level'
                        ]
                    }
                }
            },
            'score': {
                '$reduce': {
                    'input': '$skills',
                    'initialValue': 0,
                    'in': {
                        '$add': [
                            '$$value', '$$this.score'
                        ]
                    }
                }
            }
        }
    }, {
        '$setWindowFields': {
            'sortBy': {
                'score': -1
            },
            'output': {
                'rank': {
                    '$rank': {}
                }
            }
        }
    }, {
        '$limit': limit
    }, {
        '$project': {
            'userId': '$userId',
            'category': 'OVERALL',
            'level': '$level',
            'score': '$score',
            'rank': '$rank'
        }
    }, {
        '$unset': '_id'
    }
];


export const FETCH_SCORE_OF_USERS_BY_CATEGORY_QUERY = (category, limit) =>  [
    {
        '$unwind': {
            'path': '$skills'
        }
    }, {
        '$match': {
            'skills.category': category
        }
    }, {
        '$project': {
            'userId': '$userId',
            'category': '$skills.category',
            'level': '$skills.level',
            'score': '$skills.score'
        }
    }, {
        '$setWindowFields': {
            'sortBy': {
                'score': -1
            },
            'output': {
                'rank': {
                    '$rank': {}
                }
            }
        }
    }, {
        '$limit': limit
    }, {
        '$unset': '_id'
    }
]

export const FETCH_SCORE_OF_USERS_BY_USER_ID_QUERY = (userId) => [
    {
        '$unwind': {
            'path': '$skills'
        }
    }, {
        '$setWindowFields': {
            'partitionBy': '$skills.category',
            'sortBy': {
                'skills.score': -1
            },
            'output': {
                'rank': {
                    '$rank': {}
                }
            }
        }
    }, {
        '$match': {
            'userId': {
                '$regex': `^${userId}$`,
                '$options': 'i'
            }
        }
    }, {
        '$project': {
            'userId': '$userId',
            'category': '$skills.category',
            'score': '$skills.score',
            'level': '$skills.level',
            'rank': '$rank'
        }
    }, {
        '$unset': '_id'
    }
];


export const FETCH_OVERALL_RANK_OF_USER_QUERY = (userId) => [
    {
        '$addFields': {
            'level': {
                '$reduce': {
                    'input': '$skills',
                    'initialValue': 0,
                    'in': {
                        '$add': [
                            '$$value', '$$this.level'
                        ]
                    }
                }
            },
            'score': {
                '$reduce': {
                    'input': '$skills',
                    'initialValue': 0,
                    'in': {
                        '$add': [
                            '$$value', '$$this.score'
                        ]
                    }
                }
            }
        }
    }, {
        '$setWindowFields': {
            'sortBy': {
                'score': -1
            },
            'output': {
                'rank': {
                    '$rank': {}
                }
            }
        }
    }, {
        '$match': {
            'userId': {
                '$regex': `^${userId}$`,
                '$options': 'i'
            }
        }
    }, {
        '$project': {
            'userId': '$userId',
            'category': 'OVERALL',
            'level': '$level',
            'score': '$score',
            'rank': '$rank'
        }
    }, {
        '$unset': '_id'
    }
];
