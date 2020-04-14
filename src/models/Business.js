const mongoose = require('mongoose');
const crypto = require('crypto'); 
const PointSchema = require('./utils/PointSchema');

const BusinessSchema = new mongoose.Schema({
  name: String,
  instagram_username: String,
  bio: String,
  avatar_url: String,
  services: [String],
  whatsapp: [String],
  delivery: [Boolean],
  email: String,
  hash : String, 
  salt : String,
  location: {
    type: PointSchema,
    index: '2dsphere'
  }
});

// Método para definir salt e hash a senha de um usuário
// O método setPassword cria primeiro um salt exclusivo para cada usuário
// então mistura o salt com a senha do usuário e cria um hash
// esse hash é armazenado no banco de dados como senha do usuário
BusinessSchema.methods.setPassword = function(password) { 
     
  // Criando um salt exclusivo para um usuário específico 
  this.salt = crypto.randomBytes(16).toString('hex'); 
   
  // Hashing salt e senha do usuário com 1000 iterações, 
  // 64 length e sha512 digest
  this.hash = crypto.pbkdf2Sync(password, this.salt,  
  1000, 64, `sha512`).toString(`hex`);
  
  const hashing = {
    hash: this.hash,
    salt: this.salt
  }
  
  return hashing;
}; 

// O método para verificar a senha digitada está correto ou não
// método de senha válido verifica se o usuário
// senha está correta ou não
// Leva a senha do usuário da solicitação
// e salt da entrada do banco de dados do usuário
// Em seguida, hashes a senha do usuário e o salt
// verifica se esse hash gerado é igual
// ao hash do usuário no banco de dados ou não
// Se o hash do usuário for igual ao hash gerado
// então a senha está correta, caso contrário não
BusinessSchema.methods.validPassword = function(password) { 
  const hash = crypto.pbkdf2Sync(password,  
  this.salt, 1000, 64, `sha512`).toString(`hex`); 
  return this.hash === hash; 
}; 

module.exports = mongoose.model('Business', BusinessSchema);