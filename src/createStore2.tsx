import React, { createContext, useReducer, useContext, useMemo, Context, FunctionComponent, Dispatch } from 'react';

function createStore<D = any>(reducer: StoreReducer<D>, initialState: D): CreatedStore<D> {
	const context = createContext<[D, Dispatch<Action>]>([initialState, null]);

	const reducerFn = (state: D, { type, payload }: Action) => reducer[type](state, payload);

	const Provider: FunctionComponent = ({ children }) => {
		const value = useReducer(reducerFn, initialState);

		return <context.Provider value={value}>{children} </context.Provider>;
	};

	const useStore: useStore<D> = selector => {
		const [state, dispatch] = useContext(context);

		const selected = Object.keys(selector(state)).reduce(
			(res, k) => {
				if (typeof selected[k] === 'function') {
					res[k] = selected[k](dispatch, state);
				} else {
					res[k] = selected[k];
				}
				return res;
			},
			{} as UsedStore,
		);

		return selected;
	};

	return [context, Provider, useStore];
}

export default createStore;

type Action<ActionTypes extends string = string> = {
	type: ActionTypes;
	payload: any;
};

export type StoreReducer<D = any, ActionTypes extends string = string> = Readonly<
	Record<ActionTypes, (state: D, payload: any) => D>
>;

export type StoreAction<ActionTypes extends string, D> = (
	dispatch: Dispatch<Action<ActionTypes>>,
	state: D,
) => (...args: any[]) => any;

type useStore<D> = <R = any>(selector: (state: D) => R) => UsedStore<R>;

type createStore<D> = (reducer: StoreReducer<D>, initialState: D) => CreatedStore<D>;

type CreatedStore<D = any> = [Context<[D, Dispatch<Action>]>, FunctionComponent, useStore<D>];

type UsedStore<R = any> = R extends { [key: string]: any }
	? { [K in keyof R]: R[K] extends StoreAction<any, any> ? ReturnType<R[K]> : R[K] }
	: R;
