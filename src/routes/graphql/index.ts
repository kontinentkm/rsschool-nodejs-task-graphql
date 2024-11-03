//src\routes\graphql\index.ts
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql } from 'graphql';
import schema from './schema.ts';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  console.log('Плагин загрузился'); // Лог запроса

  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      console.log('Received request body:', req.body); // Лог запроса
      const { query, variables } = req.body;

      if (!query) {
        console.error('No query provided');
        return { errors: [{ message: 'Query is required.' }] }; // Возврат ошибки, если запрос пуст
      }

      const result = await graphql({
        schema,
        source: query,
        variableValues: variables,
        contextValue: { prisma: fastify.prisma },
      });

      console.log('GraphQL result:', result); // Лог результата
      return result;
    },
  });
};

export default plugin;
