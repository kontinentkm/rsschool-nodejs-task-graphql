//src\routes\graphql\schema.ts
import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLInputObjectType,
} from 'graphql';
import { UUIDType } from './types/uuid.ts';

// Определение типа Profile
const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: {
    id: { type: UUIDType },
    isMale: { type: new GraphQLNonNull(GraphQLString) },
    yearOfBirth: { type: GraphQLFloat },
    memberType: { type: new GraphQLNonNull(GraphQLString) }, // Здесь лучше заменить на соответствующий объект MemberType
  },
});

// Определение типа Post
const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: {
    id: { type: UUIDType },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  },
});

// Определение типа User
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: { type: ProfileType },
    posts: { type: new GraphQLList(PostType) },
    userSubscribedTo: { type: new GraphQLList(UserType) },
    subscribedToUser: { type: new GraphQLList(UserType) },
  }),
});

// Входные типы (input)
const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});

// Root Query
const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve: async (_, __, { prisma }) => {
        return await prisma.user.findMany();
      },
    },
    user: {
      type: UserType,
      args: { id: { type: UUIDType } },
      resolve: async (_, { id }, { prisma }) => {
        return await prisma.user.findUnique({ where: { id } });
      },
    },
    // Дополнительные запросы, такие как `posts`, `profiles`, и т.д.
  },
});

// Мутации
const Mutations = new GraphQLObjectType({
  name: 'Mutations',
  fields: {
    createUser: {
      type: UserType,
      args: {
        dto: { type: CreateUserInput },
      },
      resolve: async (_, { dto }, { prisma }) => {
        return await prisma.user.create({ data: dto });
      },
    },
    // Дополнительные мутации, такие как `deleteUser`, `createPost`, и т.д.
  },
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: Mutations,
});

export default schema;
