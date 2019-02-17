import { StoreActions, StoreReducer, ContextValue } from '../../src';

export enum Action {
	initState = 'initState',
	updateBookmark = 'updateBookmark',
}

export type Data = {
	books?: Book[];
};

export type State = {
	orderedBooks: Book[];
	bookmarks: Bookmarks;
};

export type Value = {
	data: Data;
	state: State;
};

export type Actions = StoreActions<Action, Value>;
export type Reducer = StoreReducer<Value, Action>;

export type Context = ContextValue<Value, Actions>;
