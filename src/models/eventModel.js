import { Event } from "./index.js";

const getAllEvents = async () => {
    return await Event.findAll({
        order: [["date", "ASC"], ["time", "ASC"]],
    });
};

const createEvent = async (data) => {
    return await Event.create(data);
};

const updateEvent = async (id, data) => {
    const [updatedRowsCount, updatedRows] = await Event.update(data, {
        where: { id },
        returning: true,
    });
    if (updatedRowsCount === 0) return null;
    return updatedRows[0];
};

const deleteEvent = async (id) => {
    const deletedRowsCount = await Event.destroy({ where: { id } });
    return deletedRowsCount > 0;
};

const getEventById = async (id) => {
    return await Event.findByPk(id);
};

export default {
    getAllEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventById,
};