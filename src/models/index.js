// Import the Sequelize library and configuration setup
import { Sequelize } from 'sequelize';
import configSetup from '../../config/database.js';

// Import each model explicitly


// Initialize Sequelize
const env = process.env.NODE_ENV || 'development';
const config = configSetup[env];
let sequelize;

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// Initialize each model
const models = {
};

// Set up associations if needed
// console.log(`Setting up associations ${models['Configuration']}`);
// Object.keys(models).forEach((modelName) => {
//   console.log(`Model: ${modelName}`);
//   if (models[modelName].associate) {
//     console.log(`Associating: ${modelName}`);
//     models[modelName].associate(models);
//   }
// });

Object.keys(models).forEach((modelName) => {
  if (!models[modelName]) {
    console.error(`Model ${modelName} is undefined.`);
    return;
  }

  if (typeof models[modelName].associate === 'function') {
    try {
      models[modelName].associate(models);
    } catch (error) {
      console.error(`Error associating ${modelName}: ${error.message}`);
    }
  } else {
    console.log(`No association method for ${modelName}`);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
