module.exports={
  port: process.env.PORT || 42205 || 3001,
  JwtSecret: process.env.JWT_SECRET || 'secret',
  mongoPath:"mongodb+srv://Kenshin:Qutv5htu0tTpQtef@weather.t26boko.mongodb.net/test"
};
