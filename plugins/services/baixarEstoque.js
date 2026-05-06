'use strict'

const fp = require('fastify-plugin');

async function estoquePlugin(fastify, opts) {

    async function baixarEstoque(conn, produtoId, quantidade) {
        const [rows] = await conn.query(
            'SELECT quantidade FROM estoque WHERE id = ? AND ativo = 1 FOR UPDATE',
            [produtoId]
        );

        if (!rows.length) {
            throw new Error('Produto não encontrado');
        }

        if (rows[0].quantidade < quantidade) {
            throw new Error('Estoque insuficiente');
        }

        await conn.query(
            'UPDATE estoque SET quantidade = quantidade - ? WHERE id = ? AND ativo = 1',
            [quantidade, produtoId]
        );
    }

    async function criarPedido(conn, pessoaId, produtoId, quantidade) {
        const [result] = await conn.query(
            'INSERT INTO pedidos (pessoa_id, estoque_id, quantidade) VALUES (?, ?, ?)',
            [pessoaId, produtoId, quantidade]
        );

        if (result.affectedRows === 0) {
            throw new Error('Falha ao criar pedido');
        }

        return result.insertId;
    }

    fastify.decorate('pedidos', {
        baixarEstoque,
        criarPedido
    });
}


module.exports = fp(estoquePlugin);