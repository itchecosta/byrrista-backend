const Business = require('../models/Business');

module.exports = {
    async create(request, response) {
        const { login, password } = request.body;

        let business = await Business.findOne({ 
            $or:[
                {
                    "instagram_username":login
                },
                {
                    "email":login
                }
            ]
         });

        if(!business) {
            return response.status(400).json({ 
                message : "business not found."
            }); 
        } else {

            if (business.validPassword(password)) { 
                return response.status(201).json({ 
                    message : "business Logged In",
                    business
                }) 
            } 
            else { 
                return response.status(400).json({ 
                    message : "Wrong Password"
                }); 
            } 

        }

    }
}