const mongoose = require('mongoose');  

const schema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        keywords: {
            type: String
        },
        start_time: {
            type: Date,
            required: true
        },
        location: {
            type: String
        },
        image_link: {
            type: String
        }
    },  
    {
        timestamps: true
    }  
);

schema.method("toJSON", function () {  
    const {__v, _id, ...object} = this.toObject();  
    object.id = _id;  
    return object;  
});  

module.exports = mongoose.model("event", schema);