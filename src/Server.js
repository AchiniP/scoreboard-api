import 'dotenv/config';
import Logger from './middleware/Logger';
import { connect, set, connection } from 'mongoose';
import App from "./App";
import { dbConnection } from './middleware/Database';

const LOG = new Logger('server.js');
const { PORT = 3000, MAX_APP_START_RETRY = 5, ENV } = process.env;

const startApplication = async (retryCount) => {
    try {
        if (ENV !== 'production') {
            set('debug', true);
        }
        connect(dbConnection.url, dbConnection.options);
        const db = connection;
        db.on("error", error => {
            LOG.error(error);
        });
        db.once("open", () => LOG.info("connected to database..."));
        App.listen(PORT, () => {
            LOG.info(`Application started at http://localhost:${PORT}`);
        });

    } catch (e) {
        LOG.error(e);
        const nextRetryCount = retryCount - 1;
        if (nextRetryCount > 0) {
            setTimeout(async () => await startApplication(nextRetryCount), 3000);
            return;
        }
        LOG.error('Unable to start application');
    }
};

startApplication(MAX_APP_START_RETRY);
