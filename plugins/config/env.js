const fp = require('fastify-plugin');

async function envPlugin(fastify, options) {
    fastify.register(require('@fastify/env'), {
        dotenv: true,
        confKey: 'env',
        schema: {
            type: 'object',
            required: ['SERVER', 'USER', 'PASSWORD', 'DATABASE'],
            properties: {
                SERVER: { type: 'string' },
                USER: { type: 'string' },
                PASSWORD: { type: 'string' },
                DATABASE: { type: 'string' }
            }
        }
    });
}

module.exports = fp(envPlugin, {
    name: 'env'
});