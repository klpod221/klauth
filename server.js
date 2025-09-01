const app = require('./app');
const config = require('./src/config');
const { apiLogger } = require('./src/utils/logger');
const connectDB = require('./src/config/db');

const PORT = config.port || 3000;

connectDB();

app.listen(PORT, () => {
  apiLogger.info(`Server is running on port ${PORT}`);
});
