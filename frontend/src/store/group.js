import { csrfFetch } from "./csrf.js";

const GROUPS_LIST = "groups/listGroups";
const DISPLAY_GROUP = "groups/displayGroup";
const GROUP_EVENTS = "groups/groupEvents";

const listGroups = (groups) => {
    return {
        type: GROUPS_LIST,
        groups,
    };
};

const displayGroup = (groupDetails) => {
    return {
        type: DISPLAY_GROUP,
        groupDetails,
    };
};

const listGroupEvents = (groupEvents) => {
    return {
        type: GROUP_EVENTS,
        groupEvents,
    };
};

export const getGroups = () => async (dispatch) => {
    const res = await csrfFetch("/api/groups");

    if (res.ok) {
        const groups = await res.json();
        dispatch(listGroups(groups.Groups));
    } else throw res;

    return res;
};

export const getGroupDetails = (groupId) => async (dispatch) => {
    const res = await csrfFetch(`/api/groups/${groupId}`);

    if (res.ok) {
        const groupDetails = await res.json();
        dispatch(displayGroup(groupDetails));
    } else throw res;

    return res;
};

export const getGroupEvents = (groupId) => async (dispatch) => {
    const res = await csrfFetch(`/api/groups/${groupId}/events`);

    if (res.ok) {
        const events = await res.json();
        dispatch(listGroupEvents(events));
    } else throw res;

    return res;
};

const initialState = { Groups: null };

function groupReducer(state = initialState, action) {
    switch (action.type) {
        case GROUPS_LIST:
            return { ...state, Groups: action.groups };
        case DISPLAY_GROUP:
            return { ...state, groupDetails: action.groupDetails };
        case GROUP_EVENTS:
            return { ...state, groupEvents: action.groupEvents };
        default:
            return state;
    }
}

export default groupReducer;