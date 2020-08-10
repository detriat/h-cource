import ApolloDataSource from 'apollo-datasource-rest';

class SpaceXAPI extends ApolloDataSource.RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'https://api.spacexdata.com/v3';
    }

    async getDragon(id) {
        return await this.get(`dragons/${id}`);
    }

    async getDragons() {
        return await this.get(`dragons`);
    }
}

export default SpaceXAPI;