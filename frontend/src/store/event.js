import { csrfFetch } from "./csrf.js";

const EVENTS_LIST = "events/listEvents";
const DISPLAY_EVENT = "events/displayEvent";

const listEvents = (events) => {
    return {
        type: EVENTS_LIST,
        events,
    };
};

const displayEvent = (eventDetails) => {
    return {
        type: DISPLAY_EVENT,
        eventDetails,
    };
};

export const getEvents = () => async (dispatch) => {
    const res = await csrfFetch("/api/events");

    const events = await res.json();

    if (res.ok) dispatch(listEvents(events.Events));
    else throw res;

    return res;
};

export const getEventDetails = (eventId) => async (dispatch) => {
    const res = await csrfFetch(`/api/events/${eventId}`);

    const eventDetails = await res.json();

    if (res.ok) dispatch(displayEvent(eventDetails));
    else throw res;

    return res;
};

const initialState = { Events: null };

function eventReducer(state = initialState, action) {
    switch (action.type) {
        case EVENTS_LIST:
            return { ...state, Events: action.events };
        case DISPLAY_EVENT:
            return { ...state, eventDetails: action.eventDetails };
        default:
            return state;
    }
}

export default eventReducer;
