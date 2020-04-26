const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { createStore } = require('./utils');
const LaunchAPI = require('./datasources/launch');
const UserAPI = require('./datasources/user');
const isEmail = require('isemail');

const store = createStore();

const server = new ApolloServer({
    context: async ({ req }) => {
        // simple auth check on every request
        const auth = req.headers && req.headers.authorization || '';
        const email = Buffer.from(auth, 'base64').toString('ascii');
        if (!isEmail.validate(email)) return { user: null };
        // find a user by their email
        const users = await store.users.findOrCreate({ where: { email } });
        const user = users && users[0] || null;
    
        return { user: { ...user.dataValues } };
    },
    typeDefs,
    resolvers,
    dataSources: () => ({
        launchAPI: new LaunchAPI(),
        userAPI: new UserAPI({ store })
    })
});

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});
