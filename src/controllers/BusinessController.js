const axios = require('axios');
const Business = require('../models/Business');
const parseStringAsArray = require('../utils/parseStringAsArray');
const sendEmailRegister = require('../utils/sendEmailRegister');
const { findConnections, sendMessage } = require('../websocket');

module.exports = {
  async index(request, response) {
    const business = await Business.find();

    return response.json(business);
  },
  
  async store(request, response) {
    const { instagram_username, services, whatsapp, delivery, email, password, latitude, longitude } = request.body;

    console.log(request.body);

    let business = await Business.findOne({ instagram_username, email });

    if (!business) {

      let bus = new Business();

      const { data } = await axios.get(`https://www.instagram.com/${instagram_username}/?__a=1`);
      
      user = data.graphql.user;

      const { name = user.full_name, avatar_url = user.profile_pic_url, bio = user.biography } = user;
    
      // // console.log(data);
      // // let followers = user.edge_followed_by.count
      // // let following = user.edge_follow.count
      // // let fullname = user.full_name
      // // let user_name = user.username
      // // let profile_pic = user.profile_pic_url_hd
      // // console.log(`${user_name} has ${followers} and follows ${following}. His full name is ${fullname}. His pic is ${profile_pic}`)

      
      const servicesArray = parseStringAsArray(services);

      const { hash, salt } = bus.setPassword(password);

      const location = {
        type: 'Point',
        coordinates: [longitude, latitude],
      };
    
      business = await Business.create({
        instagram_username,
        name,
        avatar_url,
        bio,
        services,
        whatsapp,
        delivery,
        email,
        hash,
        salt,
        location,
      })

      if(business) {

        sendEmailRegister(business.email);

        // Filtrar as conexões que estão há no máximo 10km de distância
        // e que o novo dev tenha pelo menos uma das tecnologias filtradas

        const sendSocketMessageTo = findConnections(
          { latitude, longitude },
          servicesArray,
        )

        sendMessage(sendSocketMessageTo, 'new-business', business);
      
        return response.json({
          message: `${business.name}, seu cadastro foi realizado com sucesso!`,
          name: business.name
        });
      } else {
        return response.status(400).json({ 
          message : "Ocorreu um problema no cadastro. Tente novamente!"
        });
      }
    } else {

      return response.status(400).json({ 
        message : "Usuário já existente!"
      });
    }
  
    
  },

  async delete(request,response) {
    //const { _id } = request.params;
    const _id = request.headers.authorization;

    let business = await Business.findOne({ _id });

    console.log(business);

    if(!business){
        return response.status(401).json({ error: 'Operation not permitted' });
    }

    await business.deleteOne({ _id });

    return response.status(204).json({ 
      message : "Seu usuário foi deletado do sistema!"
    });
  },
};