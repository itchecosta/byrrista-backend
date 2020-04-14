const Business = require('../models/Business');
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
  async index(request, response) {
    const { latitude, longitude, services } = request.query;
  
    const servicesArray = parseStringAsArray(services);

    const business = await Business.find({
      services: {
        $in: servicesArray,
      },
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: 5000,
        },
      },
    });

    return response.json({ business });
  }
}