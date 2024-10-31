import { GraphQLObjectType, GraphQLString, GraphQLFloat, GraphQLList } from 'graphql';
import { UUIDType } from './types/uuid.ts';

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: { type: ProfileType }, // Предполагается, что ProfileType будет определен отдельно
    posts: { type: new GraphQLList(PostType) },
    userSubscribedTo: { type: new GraphQLList(UserType) },
    subscribedToUser: { type: new GraphQLList(UserType) },
  },
});
