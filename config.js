'use strict';
exports.DATABASE_URL = process.env.DATABASE_URL || "mongodb://admin:aaron123@ds257981.mlab.com:57981/bartenders_blackbook";
exports.PORT = process.env.PORT || 8080;
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || "mongodb://admin:aaron123@ds159641.mlab.com:59641/test_bartenders_blackbook";