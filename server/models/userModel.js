const mongoose = require('mongoose');  

const schema = mongoose.Schema(
    {
        guid: {
            type: String
        },
        email: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        nickname: {
            type: String,
            required: true
        },
        picture: {
            type: String,
            required: true
        },
        keywords: {
            type: String,
            required: true
        },
        events: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'event',
            default: []
        }]
    },  
    {
        timestamps: true
    }  
);

schema.index({ guid: 1 }, {unique: true})

schema.method("toJSON", function () {  
    const {__v, _id, ...object} = this.toObject();  
    object.id = _id;  
    return object;  
});  

module.exports = mongoose.model("user", schema);