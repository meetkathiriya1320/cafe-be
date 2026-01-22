import eventModel from "../models/eventModel.js";
import { RESPONSE } from "../helper/response/response.js";

const { getAllEvents, createEvent, updateEvent, deleteEvent } = eventModel;

const getEvents = async (req, res) => {
    try {
        const events = await getAllEvents();
        return RESPONSE.success(res, null, events);
    } catch (err) {
        console.error(err);
        return RESPONSE.error(res, 9999, 500, err);
    }
};

const addEvent = async (req, res) => {
    const { name, description, date, time, image_url } = req.body;
    try {
        const newEvent = await createEvent({
            name,
            description,
            date,
            time,
            image_url,
        });
        return RESPONSE.success(res, null, newEvent, 201);
    } catch (err) {
        console.error(err);
        return RESPONSE.error(res, 9999, 500, err);
    }
};

const updateEventController = async (req, res) => {
    const { id } = req.params;
    const { name, description, date, time, image_url } = req.body;
    try {
        const updatedEvent = await updateEvent(id, {
            name,
            description,
            date,
            time,
            image_url,
        });
        if (!updatedEvent) {
            return RESPONSE.error(res, 2003, 404);
        }
        return RESPONSE.success(res, null, updatedEvent);
    } catch (err) {
        console.error(err);
        return RESPONSE.error(res, 9999, 500, err);
    }
};

const deleteEventController = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await deleteEvent(id);
        if (!deleted) {
            return RESPONSE.error(res, 2003, 404);
        }
        return RESPONSE.success(res, "Event deleted successfully");
    } catch (err) {
        console.error(err);
        return RESPONSE.error(res, 9999, 500, err);
    }
};

export default {
    getEvents,
    addEvent,
    updateEventController,
    deleteEventController,
};