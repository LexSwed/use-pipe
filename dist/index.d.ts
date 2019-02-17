import { Context, Dispatch, FunctionComponent } from 'react';
declare function createStore<D, A extends StoreActions>(reducer: StoreReducer<D, any>, actions: A, initialState?: D): Store<D, A>;
export default createStore;
export declare type StoreReducer<D = any, ActionTypes extends string = string> = Readonly<Record<ActionTypes, (state: D, payload: any) => D>>;
export declare type StoreAction<ActionTypes extends string, D> = (dispatch: Dispatch<Action<ActionTypes>>, state: D) => (...args: any[]) => any;
export declare type StoreActions<ActionTypes extends string = string, D = any> = {
    [name: string]: StoreAction<ActionTypes, D>;
};
export declare type ContextValue<D, A extends StoreActions> = [D, BoundStoreActions<A>];
declare type BoundStoreActions<A extends StoreActions> = {
    [K in keyof A]: (...args: Parameters<ReturnType<A[K]>>) => ReturnType<ReturnType<A[K]>>;
};
declare type Action<ActionTypes extends string = string> = {
    type: ActionTypes;
    payload: any;
};
declare type useStore<D, A extends StoreActions> = <R = any>(selector?: (state: D, actions: BoundStoreActions<A>) => R) => R;
declare type Store<D, A extends StoreActions> = [Context<ContextValue<D, A>>, FunctionComponent, useStore<D, A>];
