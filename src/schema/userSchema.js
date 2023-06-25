const mongoose = require('mongoose');

const schema = mongoose.Schema;
const userSchema = new schema({
    name:{
        type: String,
        
    },
    number:{
        type: Number,
        
    },
    email:{
        type: String,
        unique: true,
        
    },
    password:{
        type: String,
        
    },
    status: {
        type: String,
        enum: ['concluído', 'pendente'],
        default: 'pendente'
      }
})
module.exports = mongoose.model('registerusers', userSchema)