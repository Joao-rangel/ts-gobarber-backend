module.exports = [
  {
    "name": "default",
    "type": "postgres",
    "url": process.env.DATABASE_URL,
    "ssl": {
      rejectUnauthorized: false
    },
    "entities": [
      process.env.NODE_ENV === 'production' ?
        "./dist/modules/**/infra/typeorm/entities/*.js" :
        "./src/modules/**/infra/typeorm/entities/*.ts"
    ],
    "migrations": [
      process.env.NODE_ENV === 'production' ?
        "./dist/shared/infra/typeorm/migrations/*.js" :
        "./src/shared/infra/typeorm/migrations/*.ts"
    ],
    "cli": {
      "migrationsDir": "./src/shared/infra/typeorm/migrations"
    }
  },
  {
    "name": "mongo",
    "type": "mongodb",
    "url": process.env.MONGO_URL,
    "useUnifiedTopology": true,
    "entities": [
      process.env.NODE_ENV === 'production' ?
        "./dist/modules/**/infra/typeorm/schemas/*.js" :
        "./src/modules/**/infra/typeorm/schemas/*.ts"
    ]
  }
]
