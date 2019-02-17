import createStore from '../../src';
import actions from './actions';
import { Action, Actions, Reducer, Value } from './types';

const reducer: Reducer = {
	[Action.initState]: (store, newState) => newState,
	[Action.updateBookmark]: (store, bookmark) => {
		const state = { ...store.state, bookmarks: [...store.state.bookmarks, bookmark] };

		return {
			data: store.data,
			state,
		};
	},
};

export const [BooksContext, BooksProvider, useBooks] = createStore<Value, Actions>(reducer, actions, {
	data: {},
	state: null,
});

BooksContext.displayName = 'Books';

export default BooksContext;
