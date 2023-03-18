import * as dotenv from 'dotenv'
dotenv.config()

export const defaultConfig = {
  PORT: process.env.PORT || 3000,
  HOST: process.env.HOST || 'localhost',
  node_mailer_key: process.env.NODE_MAILER_KEY,
  authentication: {
    jwtSecret: process.env.JWT_SECRET,
  },
  facebook: {
    FACEBOOK_APP_ID: '',
    FACEBOOK_APP_SECRET: '',
  },
  google: {
    PLACES_API: process.env.PLACES_API,
  },
  ZIPCODE_API: {
    URL: process.env.ZIPCODE_API_URI,
    API_KEY: process.env.ZIPCODE_API_KEY,
  },
  REDLINE_API: {
    APP_KEY: process.env.REDLINE_APPLICATION_KEY,
    APP_HOST: process.env.REDLINE_API_HOST,
    APP_URI: process.env.REDLINE_URI,
  },
  db: {
    connectString: process.env.DB_CONNECT_STRING,
    test: 'mongodb+srv://online-dating-test:online-dating-test@cluster0.nh21d4g.mongodb.net/?retryWrites=true&w=majority',
  },
}
