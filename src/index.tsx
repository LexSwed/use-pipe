import React, { Context, useReducer, Dispatch, createContext, FunctionComponent, useContext } from 'react';

function createStore<D, A extends StoreActions>(
	reducer: StoreReducer<D, any>,
	actions: A,
	initialState?: D,
): Store<D, A> {
	const context = createContext<ContextValue<D, A>>([initialState, actions ? ({} as BoundStoreActions<A>) : null]);

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
): [D, BoundStoreActions<A>] {
	const reducerFn = (state: D, { type, payload }: Action): D => reducer[type](state, payload);

	const [data, dispatch] = useReducer(reducerFn, initialState);

	const actionCreators = bindActionCreators(actions, dispatch, data);

	return [data, actionCreators];
}

function bindActionCreators<A extends StoreActions, D>(
	actions: A,
	dispatch: Dispatch<Action>,
	state: D,
): BoundStoreActions<A> {
	return Object.keys(actions).reduce(
		(res, name) => {
			res[name] = actions[name](dispatch, state);
			return res;
		},
		{} as BoundStoreActions<A>,
	);
}

export type StoreReducer<D = any, ActionTypes extends string = string> = Readonly<
	Record<ActionTypes, (state: D, payload: any) => D>
>;

export type StoreAction<ActionTypes extends string, D> = (
	dispatch: Dispatch<Action<ActionTypes>>,
	state: D,
) => (...args: any[]) => any;

export type StoreActions<ActionTypes extends string = string, D = any> = {
	[name: string]: StoreAction<ActionTypes, D>;
};

export type ContextValue<D, A extends StoreActions> = [D, BoundStoreActions<A>];

type BoundStoreActions<A extends StoreActions> = {
	[K in keyof A]: (...args: Parameters<ReturnType<A[K]>>) => ReturnType<ReturnType<A[K]>>
};

type Action<ActionTypes extends string = string> = {
	type: ActionTypes;
	payload: any;
};

type useStore<D, A extends StoreActions> = <R = any>(selector?: (state: D, actions: BoundStoreActions<A>) => R) => R;

type Store<D, A extends StoreActions> = [Context<ContextValue<D, A>>, FunctionComponent, useStore<D, A>];
