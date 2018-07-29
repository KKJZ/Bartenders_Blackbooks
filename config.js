'use strict';
exports.DATABASE_URL = process.env.DATABASE_URL || "mongodb://admin:test123<dbpassword>@ds257981.mlab.com:57981/bartenders_blackbook";
exports.PORT = process.env.PORT || 8080;