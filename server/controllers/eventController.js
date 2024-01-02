const EventService = require('../services/eventService');
const UserService = require('../services/userService');

// Create and Save a new Event
exports.create = async (req, res) => {
}

// Find a single Event with an id
exports.findOneByTitle = async (req, res) => {
    if (!req.params.title) {
        console.log( '[EventController][FindOne][ERROR]:' + 'Params can not be empty!');
        res.status(400).send({message: "Params can not be empty!"});
        return;
    }

    const {title} = req.params;

    try {
        const event = await EventService.findOne(title)
        if (!event) {
            res.status(404).send({
                message: "Not found event with title " + title
            });
            console.log('[EventController][FindOne][ERROR]:' + " invalid event title (%s).", title);
        }
        else {
            console.log('[EventController][FindOne][INFO]:' + " event with title (%s) was returned.", title);
            res.status(200).send(event);
        }
    } catch(err) {
        console.log('[EventController][FindOne][ERROR]:' + " Error retrieving event with title: " + title);
        res.status(500)
            .send({
                message: "Error retrieving event with title=" + title
            });
    }
};

// Find all events by keywords list
exports.findAll = async (req, res) => {
    const {keywords} = req.query;

    let message;
    if (!req.params.guid) {
        message = "guid can not be empty!";
    }

    if (message) {
        console.log('[EventController][FindAll][ERROR]:' + ' ' + message);
        res.status(400).send({message: message});
        return;
    }

    try {
        const user = await UserService.findOneByGuid(req.params.guid)

        const events = await EventService.findAll(keywords, user.events)

        console.log('[EventController][FindAll][INFO]:' + " Events were succesfully returned");
        res.status(200).send(events);
        
    } catch (err) {
        console.log('[EventController][FindAll][ERROR]:' + " Error retrieving events");
        res.status(500).send({
            message:
                err.message
                || "Error retrieving events"
        });
    }
}

// Update an event by the id in the request
exports.update = async (req, res) => {
    let message;
    if (!req.body) {
        message = "[EventController][Update][ERROR]: Data to update can not be empty!"
    } else if (!req.params.id) {
        message = "[EventController][Update][ERROR]: Params can not be empty!"
    }

    if (message) {
        console.log('[EventController][Update][ERROR]:' + ' ' + message);
        res.status(400).send({message: message});
        return;
    }

    const {id} = req.params;

    let keywords = []
    for (const keyword of req.body.keywords) {
        try {
            const result = await KeywordService.saveKeyword(keyword)
            if (result) {
                keywords.push(result._id)
                console.log('[EventController][Update][INFO]:' + ' keyword: ' + keyword + ' was sucessfully added');
            }
        } catch (err) {
            console.log('[EventController][Update][ERROR]:' + " Some error occurred while creating the keyword.");
            res.status(500).send({
                message:
                    err.message
                    || "Some error occurred while creating the keyword."
            });
        }
    }
    req.body.keywords = keywords

    try {
        const result = await EventService.updateEvent(id, req.body)
        if (!result) {
            console.log('[EventController][Update][ERROR]: ' + `Cannot update Event with id=${id}. Maybe Event was not found!`);
            res.status(404).send({
                message: `Cannot update Event with id=${id}. Maybe Event was not found!`
            });
        } else {
            console.log('[EventController][Update][INFO]: ' + "Event was updated successfully.");
            res.status(200).send({
                message: "Event was updated successfully."
            });
        }
    } catch(err) {
        console.log('[EventController][Update][ERROR]: ' + "Error updating Event with id: " + id);
        res.status(500).send({
            message:
                err.message
                || "Error updating Event with id=" + id
        });
    }
};