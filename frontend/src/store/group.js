import { csrfFetch } from "./csrf.js";

const GROUPS_LIST = "groups/getGroups";

const listGroups = (groups) => ({
    type: GROUPS_LIST,
    groups,
});

export const getGroups = () => async (dispatch) => {
    const res = await csrfFetch("/api/groups");

    const groups = await res.json();

    dispatch(listGroups(groups));
};

const initialState = { Groups: null };

function groupReducer(state = initialState, action) {
    switch (action.type) {
        case GROUPS_LIST:
            return { ...state, Groups: action.groups };
        default:
            return state;
    }
}

export default groupReducer;
