const { Pool } = require('pg');

module.exports = new Pool({
    connectionString: "postgresql://chaos:Uchiha0603@localhost:5432/figures"
})