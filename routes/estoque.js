module.exports = async function estoqueRotas(fastify, opts) {
    //Retornar todo o estoque
    fastify.get('/estoque', async (request, reply) => {
        return fastify.mysql
            .query('SELECT * FROM estoque order by quantidade , ativo')
            .then(([rows]) => {
                if (rows.length > 0) {
                    return rows;
                } else {
                    return { message: 'Nenhum item no estoque...' };
                }
            })
            .catch(err => {
                reply.code(500);
                return { error: err.message };
            });
    });

    //Inserir no estoque
    fastify.post('/estoque', async (request, reply) => {
        const { produto, quantidade } = request.body;
        return fastify.mysql
            .query('INSERT INTO estoque (produto , quantidade ) VALUES (? , ?)', [produto, quantidade])
            .then((result) => ((result[0].insertId) ? { message: 'Item adicionado no estoque!' } : { message: 'Erro ao adicionar item no estoque...' }))
            .catch(err => {
                reply.code(500);
                return { error: err.message };
            })
    });

    //Atualizar Status do Produto
    fastify.put('/estoque/:id', async (request, reply) => {
        const { id } = request.params;
        const { ativo } = request.body;

        return fastify.mysql
            .query('UPDATE estoque SET ativo = ? WHERE id = ?', [ativo, id])
            .then((result) => {
                if (result[0].affectedRows > 0) {
                    return { message: 'Status do item atualizado no estoque!' };
                } else {
                    return { message: 'Item não encontrado no estoque...' };
                }
            })
            .catch(err => {
                reply.code(500);
                return { error: err.message };
            })
    });

    //Deletar item do estoque
    fastify.delete('/estoque/:id', async (request, reply) => {
        const { id } = request.params;

        return fastify.mysql
            .query('DELETE FROM estoque WHERE id = ?', [id])
            .then((result) => {
                if (result[0].affectedRows > 0) {
                    return { message: 'Item removido do estoque!' };
                } else {
                    return { message: 'Item não encontrado no estoque...' };
                }
            })
            .catch(err => {
                reply.code(500);
                return { error: err.message };
            })
    });
}