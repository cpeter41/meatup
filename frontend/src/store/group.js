import { csrfFetch } from "./csrf.js";

const GROUPS_LIST = "groups/listGroups";
const DISPLAY_GROUP = "groups/displayGroup";
const CREATE_GROUP = "groups/createGroup";

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

const submitGroup = (groupId) => {
    return {
        type: CREATE_GROUP,
        groupId,
    };
};

export const getGroups = () => async (dispatch) => {
    const res = await csrfFetch("/api/groups");

    const groups = await res.json();

    if (res.ok) dispatch(listGroups(groups.Groups));
    else throw res;

    return res;
};

export const getGroupDetails = (groupId) => async (dispatch) => {
    const res = await csrfFetch(`/api/groups/${groupId}`);

    const groupDetails = await res.json();

    if (res.ok) dispatch(displayGroup(groupDetails));
    else throw res;

    return res;
};

export const createGroup = (group) => async (dispatch) => {
    const res = await csrfFetch("/api/groups", {
        method: "POST",
        body: JSON.stringify(group),
    });
    const group = await res.json();
    console.log("newgroup: ", group);
    
    // if (res.ok) {
    //     dispatch(submitGroup(groupId))
    // }
};

const initialState = { Groups: null };

function groupReducer(state = initialState, action) {
    switch (action.type) {
        case GROUPS_LIST:
            return { ...state, Groups: action.groups };
        case DISPLAY_GROUP:
            return { ...state, groupDetails: action.groupDetails };
        case CREATE_GROUP:
            return { ...state, newGroupId: action.groupId };
        default:
            return state;
    }
}

export default groupReducer;
