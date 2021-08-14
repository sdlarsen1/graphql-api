// const productSample = require('../sample/product.sample').productSample;

class ProductsService {
    public products: any = [];

    public typeDefs: string = '';

    configTypeDefs() {
        this.typeDefs = `
          type Product {
            name: String,
            description: String,
            id: Int,
            price: Int
          } `;
        this.typeDefs += ` 
          extend type Query {
          products: [Product]
        }
        `;

        this.typeDefs += `
          extend type Mutation {
            product(name:String, id:Int, description: String, price: Int): Product!
          }`;
        return this.typeDefs;
    }

    configResolvers(resolvers: any) {
        resolvers.Query.products = () => this.products;
        resolvers.Mutation.product = (_: any, product: any) => {
            this.products.push(product);
            return product;
        };
    }
}

export default ProductsService;
