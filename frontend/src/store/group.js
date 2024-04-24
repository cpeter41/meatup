import { csrfFetch } from "./csrf.js";

const GROUPS_LIST = "groups/listGroups";
const DISPLAY_GROUP = "groups/displayGroup"

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
    }
}

export const getGroups = () => async (dispatch) => {
    const res = await csrfFetch("/api/groups");

    const groups = await res.json();

    if (res.ok) dispatch(listGroups(groups.Groups));
    else throw res;
};

export const getGroupDetails = (groupId) => async (dispatch) => {
    const res = await csrfFetch(`/api/groups/${groupId}`);

    const groupDetails = await res.json();

    if (res.ok) dispatch(displayGroup(groupDetails));
    else throw res;
}

const initialState = { Groups: null };

function groupReducer(state = initialState, action) {
    switch (action.type) {
        case GROUPS_LIST:
            return { ...state, Groups: action.groups };
        case DISPLAY_GROUP:
            return {...state, groupDetails: action.groupDetails}
        default:
            return state;
    }
}

export default groupReducer;
