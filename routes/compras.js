'use strict'

const { baixarEstoque } = require('./estoque');

module.exports = async function (fastify, opts) {
    fastify.post('/compras', async (request, reply) => {
        const { produto_id, pessoa_id, quantidade } = request.body
        const conn = await fastify.mysql.getConnection();

        try {
            await conn.beginTransaction();

            await fastify.pedidos.baixarEstoque(
                conn,
                produto_id,
                quantidade
            );

            await conn.commit();

            const pedidoId = await fastify.pedidos.criarPedido(conn, pessoa_id, produto_id, quantidade);

            return { message: 'Compra realizada com sucesso , numero do pedido: ' + pedidoId };

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    });

    fastify.get('/compras', async (request, reply) => {
        return fastify.mysql
            .query(
                'SELECT ' +
                'a.id as id_pedido,' +
                'c.nome,' +
                'b.produto,' +
                'a.quantidade as quantidade_pedido, ' +
                'b.quantidade as quantidade_estoque ' +
                'FROM pedidos a ' +
                'JOIN estoque b ON a.estoque_id = b.id ' +
                'JOIN pessoas c on a.pessoa_id = c.id ' +
                'ORDER BY a.id '
            )
            .then(([rows]) => rows)
            .catch(err => {
                reply.code(500);
                return { error: err.message };
            });
    });

    fastify.get('/compras/:id', async (request, reply) => {

        const { id } = request.params;

        return fastify.mysql
            .query(
                'SELECT ' +
                'a.id as id_pedido,' +
                'c.nome,' +
                'b.produto,' +
                'a.quantidade as quantidade_pedido, ' +
                'b.quantidade as quantidade_estoque ' +
                'FROM pedidos a ' +
                'JOIN estoque b ON a.estoque_id = b.id ' +
                'JOIN pessoas c on a.pessoa_id = c.id ' +
                'WHERE a.id = ? ' +
                'ORDER BY a.id ', [id]
            )
            .then(([rows]) => rows)
            .catch(err => {
                reply.code(500);
                return { error: err.message };
            });
    });
}