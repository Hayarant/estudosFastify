'use strict'

module.exports = async function (fastify, opts) {
    fastify.post('/calculadora', async function (request, reply) {
        const { nums, operacao } = request.body;

        switch (operacao) {
            case '+':
                const soma = nums.reduce((acc, num) => acc + num, 0);
                return { resultado: soma };
            case '-':
                const subtracao = nums.reduce((acc, num) => acc - num);
                return { resultado: subtracao };
            case '*':
                const multiplicacao = nums.reduce((acc, num) => acc * num, 1);
                return { resultado: multiplicacao };
            case '/':
                const divisao = nums.reduce((acc, num) => acc / num);
                return { resultado: divisao };
            default:
                return { error: 'Operação não suportada' };
        }
    })
}
