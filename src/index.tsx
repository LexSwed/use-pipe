import React, {
	Context,
	useReducer,
	Dispatch,
	createContext,
	FunctionComponent,
	useContext,
	Reducer,
	useRef,
} from 'react';

function createStore<S = any, A extends StoreActions = any>(
	reducer: StoreReducer<any, S>,
	actions: A,
	initialState?: S,
): Store<S, A> {
	const context = createContext<ContextValue<S, A>>([initialState, {} as StoreThunks<A>]);
	const reducerFn: Reducer<S, Action> = (state: S, { type, payload }): S => reducer[type](state, payload);

	const StoreProvider: FunctionComponent = ({ children }) => {
		const [state, dispatch] = useReducer(reducerFn, initialState);
		const thunks = useRef(createThunks(actions, dispatch, state));

		return <context.Provider value={[state, thunks.current]}>{children}</context.Provider>;
	};

	const useStore: useStore<S, A> = selector => {
		const [state, actions] = useContext(context);
		const selected = selector(state, actions);

		return selected;
	};

	return [context, StoreProvider, useStore];
}

export default createStore;

function createThunks<A extends StoreActions, S>(actions: A, dispatch: Dispatch<Action>, state: S): StoreThunks<A> {
	return Object.keys(actions).reduce(
		(res, name) => {
			res[name] = (...args) => actions[name](...args)(dispatch, state);
			return res;
		},
		{} as StoreThunks<A>,
	);
}

export type StoreReducer<ActionTypes extends string = string, S = any> = Readonly<
	Record<ActionTypes, (state: S, payload: any) => S>
>;

export type StoreAction<ActionTypes extends string, S, R = void | Promise<void>> = (
	dispatch: Dispatch<Action<ActionTypes>>,
	state: S,
) => R;

type StoreActions<
	ActionTypes extends string = string,
	S = any,
	T extends Record<string, (...args: any[]) => StoreAction<ActionTypes, S>> = any
> = { [K in keyof T]: (...args: Parameters<T[K]>) => ReturnType<T[K]> };

export type ContextValue<S, A extends StoreActions> = [S, StoreThunks<A>];

type StoreThunks<A extends StoreActions> = {
	[K in keyof A]: (...args: Parameters<A[K]>) => ReturnType<ReturnType<A[K]>>
};

type Action<ActionTypes extends string = string> = {
	type: ActionTypes;
	payload: any;
};

type useStore<S, A extends StoreActions> = <R = any>(selector: (state: S, actions: StoreThunks<A>) => R) => R;

type Store<S, A extends StoreActions> = [Context<ContextValue<S, A>>, FunctionComponent, useStore<S, A>];
