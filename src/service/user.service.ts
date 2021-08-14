const crypto = require('crypto');

class UsersService {
    public users: any = [];

    public typeDefs: string = '';

    configTypeDefs() {
        this.typeDefs = `
          type User {
            firstName: String,
            lastName: String,
            id: Int,
            password: String,
            permissionLevel: Int,
            email: String
          } `;
        this.typeDefs += ` 
          extend type Query {
          users: [User]
        }
        `;

        this.typeDefs += `
          extend type Mutation {
            user(firstName:String,
             lastName: String,
             password: String,
             permissionLevel: Int,
             email: String,
             id:Int): User!
          }`;
        return this.typeDefs;
    }

    configResolvers(resolvers: any) {
        resolvers.Query.users = () => this.users;
        resolvers.Mutation.user = (_: any, user: any) => {
            const salt = crypto.randomBytes(16).toString('base64');
            const hash = crypto.createHmac('sha512', salt).update(user.password).digest('base64');
            user.password = hash;
            this.users.push(user);
            return user;
        };
    }
}

export default UsersService;
