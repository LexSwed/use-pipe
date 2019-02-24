import React, { Context, useReducer, Dispatch, createContext, FunctionComponent, useContext } from 'react';

function createStore<D = any, A extends StoreActions = any>(
	reducer: StoreReducer<D, any>,
	actions: A,
	initialState?: D,
): Store<D, A> {
	const context = createContext<ContextValue<D, A>>([initialState, {} as StoreThunks<A>]);

	const StoreProvider: FunctionComponent = ({ children }) => {
		const store = useStoreProvider(reducer, actions, initialState);

		return <context.Provider value={store}>{children}</context.Provider>;
	};

	const useStore: useStore<D, A> = selector => {
		const [data, actions] = useContext(context);
		const selected = selector(data, actions);

		return selected;
	};

	return [context, StoreProvider, useStore];
}

export default createStore;

function useStoreProvider<D, A extends StoreActions>(
	reducer: StoreReducer,
	actions: A,
	initialState: D,
): [D, StoreThunks<A>] {
	const reducerFn = (state: D, { type, payload }: Action): D => reducer[type](state, payload);

	const [data, dispatch] = useReducer(reducerFn, initialState);

	const thunks = createThunks(actions, dispatch, data);

	return [data, thunks];
}

function createThunks<A extends StoreActions, D>(actions: A, dispatch: Dispatch<Action>, state: D): StoreThunks<A> {
	return Object.keys(actions).reduce(
		(res, name) => {
			res[name] = (...args) => actions[name](...args)(dispatch, state);
			return res;
		},
		{} as StoreThunks<A>,
	);
}

export type StoreReducer<D = any, ActionTypes extends string = string> = Readonly<
	Record<ActionTypes, (state: D, ...payload: any[]) => D>
>;

export type StoreAction<ActionTypes extends string, D> = (
	dispatch: Dispatch<Action<ActionTypes>>,
	state: D,
) => void | Promise<void>;

type StoreActions<
	ActionTypes extends string = string,
	D = any,
	T extends Record<string, (...args: any[]) => any> = any
> = { [K in keyof T]: (...args: Parameters<T[K]>) => StoreAction<ActionTypes, D> };

export type ContextValue<D, A extends StoreActions> = [D, StoreThunks<A>];

type StoreThunks<A extends StoreActions> = { [K in keyof A]: (...args: Parameters<A[K]>) => void | Promise<void> };

type Action<ActionTypes extends string = string> = {
	type: ActionTypes;
	payload: any;
};

type useStore<D, A extends StoreActions> = <R = any>(selector?: (state: D, actions: StoreThunks<A>) => R) => R;

type Store<D, A extends StoreActions> = [Context<ContextValue<D, A>>, FunctionComponent, useStore<D, A>];
