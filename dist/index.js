'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);

function createStore(reducer, actions, initialState) {
    const context = React.createContext([initialState, actions ? {} : null]);
    const StoreProvider = ({ children }) => {
        const store = useStoreProvider(reducer, actions, initialState);
        return React__default.createElement(context.Provider, { value: store }, children);
    };
    const useStore = selector => {
        const [data, actions] = React.useContext(context);
        const selected = selector(data, actions);
        return selected;
    };
    return [context, StoreProvider, useStore];
}
function useStoreProvider(reducer, actions, initialState) {
    const reducerFn = (state, { type, payload }) => reducer[type](state, payload);
    const [data, dispatch] = React.useReducer(reducerFn, initialState);
    const actionCreators = bindActionCreators(actions, dispatch, data);
    return [data, actionCreators];
}
function bindActionCreators(actions, dispatch, state) {
    return Object.keys(actions).reduce((res, name) => {
        res[name] = actions[name](dispatch, state);
        return res;
    }, {});
}

module.exports = createStore;
