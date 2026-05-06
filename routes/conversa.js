'use strict'

module.exports = async function (fastify, opts) {
    fastify.get('/hello', async function (request, reply) {
        return { hello: 'hello!' }
    })

    fastify.get('/bye', async function (request, reply) {
        return { bye: 'good bye!' }
    })

    fastify.post('/age', async function (request, reply) {
        const { age } = request.body;
        return { "age": "Sua idade é: " + age + " anos!" }
    })
}
