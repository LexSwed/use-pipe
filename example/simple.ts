import createStore, { StoreAction, StoreReducer } from '../src/index';

enum Action {
	setDetails = 'setDetails',
	setInfo = 'setInfo',
}

type Data = {
	info?: string;
	details?: string;
};

const fetchDetails = (id: number): StoreAction<Action, Data> => async (dispatch, state) => {
	const res = await Promise.resolve({ data: 'Hello details!' });

	dispatch({ type: Action.setDetails, payload: res.data });
};

const fetchInfo = (): StoreAction<Action, Data> => async (dispatch, state) => {
	const res = await Promise.resolve({ data: 'Hello info' });

	dispatch({ type: Action.setInfo, payload: res.data });
};

const actions = {
	fetchDetails,
	fetchInfo,
};

const reducer: StoreReducer<Data, Action> = {
	[Action.setDetails]: (state, details) => ({ ...state, details }),
	[Action.setInfo]: (state, info) => ({ ...state, info }),
};

const initialState: Data = {
	info: null,
	details: null,
};

export const [context, Provider, useStore] = createStore(reducer, actions, initialState);

export default context;
