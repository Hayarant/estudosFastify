const fp = require('fastify-plugin');

async function dbPlugin(fastify, options) {
    const { USER, PASSWORD, SERVER, DATABASE } = fastify.env;

    fastify.register(require('@fastify/mysql'), {
        promise: true,
        connectionString: `mysql://${USER}:${PASSWORD}@${SERVER}/${DATABASE}`
    });
}

module.exports = fp(dbPlugin, {
    name: 'db',
    dependencies: ['env']
});