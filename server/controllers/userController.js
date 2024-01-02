const UserService = require('../services/userService');
const User = require('../models/userModel');

// Create and Save a new User
exports.create = async (req, res) => {
    //  Validate request
    let message;
    if (!req.body.guid) {
        message = "guid can not be empty!";
    } else if (!req.body.email) {
        message =  "email can not be empty!";
    } else if (!req.body.name) {
        message = "name can not be empty!";
    } else if (!req.body.nickname) {
        message = "nickname can not be empty!";
    } else if (!req.body.keywords) {
        message = "keywords can not be empty!";
    } else if (!req.body.picture) {
        message = "picture can not be empty!";
    }

    if (message) {
        console.log('[UserController][Create][ERROR]:' + ' ' + message);
        res.status(400).send({message: message});
        return;
    }

    // Create a user
    const user = new User({
        guid: req.body.guid,
        email: req.body.email,
        name: req.body.name,
        nickname: req.body.nickname,
        keywords: req.body.keywords,
        picture: req.body.picture,
        events: []
    });

    // Save user in the database
    try {
        const result = await UserService.saveUser(user)
        console.log('[UserController][Create][INFO]:' + ' ' + 'User was sucessfully added!');
        res.status(201).send(result);
    } catch(err) {
        console.log(err)
        console.log('[UserController][Create][ERROR]:' + ' ' + "Some error occurred while creating the user.");
        res.status(500).send({
            message:
                err.message
                || "Some error occurred while creating the user."
        });
    }
}

// Find a single user with an id
exports.findOne = async (req, res) => {
    const {id} = req.params;

    try {
        const user = await UserService.findOne(id)
        if (!user) {
            console.log('[UserController][FindOne][ERROR]:' + ' ' + "Not found user with id: " + id);
            res.status(404).send({
                message: "Not found user with id " + id
            });
        }
        else {
            console.log('[UserController][FindOne][INFO]:' + ' ' + 'User was suvessfully returned!');
            res.status(200).send(user);
        }
    } catch(err) {
        console.log('[UserController][FindOne][ERROR]:' + ' ' + "Error retrieving user with id: " + id);
        res.status(500)
            .send({
                message:
                    err.message
                    || "Error retrieving user with id=" + id
            });
    }
};

// Find a single user with an guid
exports.findByGuid = async (req, res) => {
    const {guid} = req.params;

    if (!guid) {
        console.log('[UserController][FindByGuid][ERROR]:' + ' ' + "req.params cannot be empty");
        res.status(400).send({
            message: "Bad request"
        });
    }

    try {
        const user = await UserService.findOneByGuid(guid)
        if (!user) {
            console.log('[UserController][FindByGuid][ERROR]:' + ' ' + "Not found user with guid: " + guid);
            res.status(404).send({
                message: "Not found user with guid " + guid
            });
        }
        else {
            console.log('[UserController][FindByGuid][INFO]:' + ' ' + 'User was suvessfully returned!');
            res.status(200).send(user);
        }
    } catch(err) {
        console.log('[UserController][FindByGuid][ERROR]:' + ' ' + "Error retrieving user with guid: " + guid);
        res.status(500)
            .send({
                message:
                    err.message
                    || "Error retrieving user with guid=" + guid
            });
    }
};

// exports.update = async (req, res) => {
// }

// Delete a user with the specified id in the request
exports.delete = async (req, res) => {
    const {guid} = req.params;

    if (!guid) {
        console.log('[UserController][Delete][ERROR]:' + ' ' + "req.params.guid cannot be empty");
        res.status(400).send({
            message: "Bad request"
        });
    }

    try {
        const result = await UserService.deleteUser(guid)
        if (!result) {
            console.log('[UserController][Delete][ERROR]:' + ' ' + `Cannot delete user with guid=${guid}. Maybe user was not found!`);
            res.status(404).send({
                message: `Cannot delete user with guid=${guid}. Maybe user was not found!`
            });
        } else {
            console.log('[UserController][Delete][INFO]:' + ' ' + "User was deleted successfully!");
            res.status(200).send({
                message: "User was deleted successfully!"
            });
        }
    } catch(err) {
        console.log('[UserController][Delete][ERROR]:' + ' ' + "Could not delete user with guid: " + guid);
        res.status(500).send({
            message:
                err.message
                || "Could not delete user with guid: " + guid
        });
    }
};


// Attend event
exports.attendEvent = async (req, res) => {
    let message;
    if (!req.params.guid) {
        message = "req.params.guid can not be empty!"
    } else if (!req.params.eventTitle) {
        message = "req.params.adId can not be empty!"
    }

    if (message) {
        console.log('[UserController][attendEvent][ERROR]:' + ' ' + message);
        return res.status(400).send({
            message: message
        });
    }

    const {guid, eventTitle} = req.params;

    try {
        const result = await UserService.attendEvent(guid, eventTitle)
        if (!result) {
            console.log('[UserController][attendEvent][ERROR]:' + ' ' + `Cannot reserve event. Maybe ad was not found!`);
            res.status(404).send({
                message: `Cannot reserve event. Maybe ad was not found!`
            });
        } else {
            console.log('[UserController][attendEvent][INFO]:' + ' ' + "Event was attended successfully.");
            res.status(200).send({
                message: "Event was attended successfully."
            });
        }
    } catch(err) {
        console.log('[UserController][attendEvent][ERROR]:' + ' ' + "Could not attend event" + err);
        res.status(500).send({
            message:
                err.message
                || "Could not attend event"
        });
    }
};