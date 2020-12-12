export default {
  jwt: {
    secret: process.env.APP_SECRET || 'secret',
    expiresIn: '2d',
  },
};
