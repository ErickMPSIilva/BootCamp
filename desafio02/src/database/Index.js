import Sequelize from 'sequelize';
import Students from '../app/models/Students';
import Users from '../app/models/Users';
import databaseConfig from '../config/database';

const models = [Students, Users];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection));
  }
}

export default new Database();
