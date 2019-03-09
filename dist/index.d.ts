import { Context, Dispatch, FunctionComponent } from 'react';
declare function createStore<S = any, A extends StoreActions = any>(reducer: StoreReducer<any, S>, actions: A, initialState?: S): Store<S, A>;
export default createStore;
export declare type StoreReducer<ActionTypes extends string = string, S = any> = Readonly<Record<ActionTypes, (state: S, payload: any) => S>>;
export declare type StoreAction<ActionTypes extends string, S, R = void | Promise<void>> = (dispatch: Dispatch<Action<ActionTypes>>, state: S) => R;
declare type StoreActions<ActionTypes extends string = string, S = any, T extends Record<string, (...args: any[]) => StoreAction<ActionTypes, S>> = any> = {
    [K in keyof T]: (...args: Parameters<T[K]>) => ReturnType<T[K]>;
};
export declare type ContextValue<S, A extends StoreActions> = [S, StoreThunks<A>];
declare type StoreThunks<A extends StoreActions> = {
    [K in keyof A]: (...args: Parameters<A[K]>) => ReturnType<ReturnType<A[K]>>;
};
declare type Action<ActionTypes extends string = string> = {
    type: ActionTypes;
    payload: any;
};
declare type useStore<S, A extends StoreActions> = <R = any>(selector: (state: S, actions: StoreThunks<A>) => R) => R;
declare type Store<S, A extends StoreActions> = [Context<ContextValue<S, A>>, FunctionComponent, useStore<S, A>];
