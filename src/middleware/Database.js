const { DATABASE_URL } = process.env;

export const dbConnection = {
    url: DATABASE_URL,
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
};
