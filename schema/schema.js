const graphql = require('graphql');
const rp = require('request-promise-native');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList
} = graphql;

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return rp({
          method: 'GET',
          uri: `http://localhost:3000/companies/${parentValue.id}/users`,
          json: true
        });
      }
    },
  })
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        return rp({
          method: 'GET',
          uri: `http://localhost:3000/companies/${parentValue.companyId}`,
          json: true
        });
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return rp({
          method: 'GET',
          uri: `http://localhost:3000/users/${args.id}`,
          json: true
        });
      }
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return rp({
          method: 'GET',
          uri: `http://localhost:3000/companies/${args.id}`,
          json: true
        });
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
