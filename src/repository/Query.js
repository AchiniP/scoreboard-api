export const FETCH_OVERALL_SCORE_OF_USERS_QUERY = (limit) =>  [
    {
        '$group': {
            '_id': '$userId',
            'userId': {
                '$first': '$userId'
            },
            'score': {
                '$sum': '$score'
            },
            'level': {
                '$sum': '$level'
            }
        }
    }, {
        '$unset': '_id'
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
        '$addFields': {
            'category': 'OVERALL'
        }
    }
];


export const FETCH_SCORE_OF_USERS_BY_CATEGORY_QUERY = (category, limit) =>  [
    {
        '$match': {
            'category': category
        }
    }, {
        '$unset': [
            '_id', '__v'
        ]
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
    }
];

export const FETCH_SCORE_OF_USERS_BY_USER_ID_QUERY = (userId) => [
    {
        '$sort': {
            'score': -1
        }
    }, {
        '$group': {
            '_id': '$category',
            'items': {
                '$push': '$$ROOT'
            }
        }
    }, {
        '$unwind': {
            'path': '$items',
            'includeArrayIndex': 'items.rank'
        }
    }, {
        '$match': {
            'items.userId': {
                '$regex': `^${userId}$`,
                '$options': 'i'
            }
        }
    }, {
        '$project': {
            'userId': '$items.userId',
            'category': '$items.category',
            'score': '$items.score',
            'level': '$items.level',
            'rank': {
                '$add': [
                    '$items.rank', 1
                ]
            }
        }
    },{
        '$sort': {
            'category': 1
        }
    }, {
        '$unset': '_id'
    }
];

export const FETCH_OVERALL_RANK_OF_USER_QUERY = (userId) => [
    {
        '$group': {
            '_id': '$userId',
            'userId': {
                '$first': '$userId'
            },
            'score': {
                '$sum': '$score'
            },
            'level': {
                '$sum': '$level'
            }
        }
    }, {
        '$unset': '_id'
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
        '$addFields': {
            'category': 'OVERALL'
        }
    }
];
