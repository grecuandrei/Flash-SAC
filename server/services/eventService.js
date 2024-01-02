const Event = require('../models/eventModel');

// Create user
async function saveEvent(event) {
}
module.exports.saveEvent = saveEvent;

// Find ad by id
async function findOne(title) {
    try {
        const event = await Event.findOne({title:title})
        return event;
    } catch(err) {
        throw Error(err)
    }
}
module.exports.findOne = findOne;

// Find all events by keywords list
async function findAll(keywords, events_list) {
    try {
        const finalEvents = await extra(events_list)
        .then(async (result) => {
            result = [...new Set(result)];
            const events = events_list.length > 0 ? await Event.find({_id: {$in: result}}) : await Event.find();
            if (keywords === '[]' || keywords === undefined) {
                return events;
            }
            const keywordsName = JSON.parse(keywords)
            let finalEvents = []
            for (let event of events) {
                if (keywordsName.every(element => {return event.keywords.toLowerCase().includes(element) || event.title.toLowerCase().includes(element) || event.description.toLowerCase().includes(element);})) {
                    finalEvents.push(event)
                }
            }
            return finalEvents;
        })
        return finalEvents;
    } catch(err) {
        throw Error(err)
    }
}
module.exports.findAll = findAll;

async function extra(events) {
    if (events.length == 0) {
        return []
    } else {
        let events_list = []
        if (events.length == 1) {
            await callEngine(events[0]._id).then((res)=>{
                events_list = events_list.concat(res.split(',').slice(0,10))
            })
            return events_list
        } else {
            await callEngine(events.slice(-1)[0]._id).then((res)=>{
                events_list = events_list.concat(res.split(',').slice(0,10))
            })
            return events_list
        }
    }
}

function callEngine(id) {
    return new Promise(resolve => {
        const spawn = require('child_process').spawn;
        const process = spawn('python3', ['-u', __dirname.replace('server/services','engine/event_recomandation_6.py'), id])
        process.stdout.on('data', function (data) {
            resolve(data.toString())
        })
        process.stderr.on('data', (data) => {
            console.log(`error:${data}`);
        });
        process.on('close', () => {
            console.log("Closed");
        });
    })
}

// Update event by id
async function updateEvent(id, query) {
    try {
        const res = await Event.findByIdAndUpdate(id, {...query}, {useFindAndModify: false})
        return res;
    } catch(err) {
        throw Error(err)
    }
}
module.exports.updateEvent = updateEvent;