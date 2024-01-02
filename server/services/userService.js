const User = require('../models/userModel');
const Event = require('../models/eventModel');

require('dotenv').config();
const domain = process.env.AUTH0_DOMAIN;
const client_id = process.env.AUTH0_CLIENT_ID;
const client_secret = process.env.AUTH0_CLIENT_SECRET;
const ManagementClient = require("auth0").ManagementClient;

const management = new ManagementClient({
    domain: `${domain}`,
    clientId: `${client_id}`,
    clientSecret: `${client_secret}`
});

// Create user
async function saveUser(user) {
    try {
        const res = await user.save()
        return res;
    } catch (err) {
        throw Error(err)
    };
}
module.exports.saveUser = saveUser;

// Find user by id
async function findOne(userId) {
    try {
        const user = await User.findById(userId).populate('events');
        return user;
    } catch(err) {
        throw Error(err)
    }
}
module.exports.findOne = findOne;

// Find user by guid
async function findOneByGuid(userGuid) {
    try {
        const user = await User.findOne({guid: userGuid}).populate('events');
        return user;
    } catch(err) {
        throw Error(err)
    }
}
module.exports.findOneByGuid = findOneByGuid;

// Delete user
async function deleteUser(guid) {
    try {
        await management.users.delete({ id: guid }, function (err) {
            if (err) {
                throw Error('Auth0 delteing error')
            }
        });
        const res = await User.findOneAndRemove({guid: guid})
        return res;
    } catch(err) {
        throw Error(err)
    }
}
module.exports.deleteUser = deleteUser;

// Reserve ad
async function attendEvent(guid, eventTitle) {
    try {
        const event = await Event.findOne({title: eventTitle})
        const user = await findOneByGuid(guid)
        const query = {
            $push: {
                events: event.id
            },
            keywords: user.keywords + " " + event.keywords
        }

        const result = await User.updateOne({guid:guid}, query)
        if (!result) {
            throw Error('Error attending event')
        }

        return result;
    } catch (err) {
        throw Error(err)
    }
}
module.exports.attendEvent = attendEvent;