'use strict'

module.exports = async function (fastify, opts) {

    //Retornar todas as pessoas
    fastify.get('/pessoas', (request, reply) => {
        return fastify.mysql
            .query('SELECT * FROM pessoas order by id')
            .then(([rows]) => rows)
            .catch(err => {
                reply.code(500);
                return { error: err.message };
            });
    });

    //Filtrar pessoa por ID
    fastify.get('/pessoas/:id', (request, reply) => {
        const { id } = request.params;

        return fastify.mysql
            .query('SELECT * FROM pessoas WHERE id = ?', [id])
            .then(([rows]) => (rows.length > 0 ? rows[0] : { message: 'Pessoa não encontrada...' }))
            .catch(err => {
                reply.code(500);
                return { error: err.message };
            });
    });

    //Registrar Pessoa
    fastify.post('/pessoas', (request, reply) => {
        const { nome, email } = request.body;
        return fastify.mysql
            .query('INSERT INTO pessoas (nome , email) VALUES (? ,?)', [nome, email])
            .then(() => ({ message: 'Pessoa cadastrada com sucesso!' }))
            .catch(err => {
                reply.code(500);
                return { error: err.message };
            });
    });

    //Atualizar Pessoa

    fastify.put('/pessoas/:id', (request, reply) => {
        const { id } = request.params;
        const { nome, email } = request.body;

        return fastify.mysql
            .query('UPDATE pessoas SET nome = ?, email = ? WHERE id = ?', [nome, email, id])
            .then(() => ({ message: 'Pessoa atualizada com sucesso!' }))
            .catch(err => {
                reply.code(500);
                return { error: err.message };
            });
    });

    //Deletar Pessoa

    fastify.delete('/pessoas/:id', (request, reply) => {
        const { id } = request.params;

        return fastify.mysql
            .query('DELETE FROM pessoas WHERE id = ?', [id])
            .then(() => ({ message: 'Pessoa deletada com sucesso!' }))
            .catch(err => {
                reply.code(500);
                return { error: err.message };
            });
    });
};

