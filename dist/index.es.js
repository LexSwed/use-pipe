import React, { createContext, useContext, useReducer } from 'react';

function createStore(reducer, actions, initialState) {
    const context = createContext([initialState, actions ? {} : null]);
    const StoreProvider = ({ children }) => {
        const store = useStoreProvider(reducer, actions, initialState);
        return React.createElement(context.Provider, { value: store }, children);
    };
    const useStore = selector => {
        const [data, actions] = useContext(context);
        const selected = selector(data, actions);
        return selected;
    };
    return [context, StoreProvider, useStore];
}
function useStoreProvider(reducer, actions, initialState) {
    const reducerFn = (state, { type, payload }) => reducer[type](state, payload);
    const [data, dispatch] = useReducer(reducerFn, initialState);
    const actionCreators = bindActionCreators(actions, dispatch, data);
    return [data, actionCreators];
}
function bindActionCreators(actions, dispatch, state) {
    return Object.keys(actions).reduce((res, name) => {
        res[name] = actions[name](dispatch, state);
        return res;
    }, {});
}

export default createStore;
