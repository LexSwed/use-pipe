import createStore from 'use-pipe';
import api from './api';

const actions = {
	getBooks: dispatch => async filters => {
		dispatch({ type: 'setLoading', payload: true });

		const books = await api.getBooks(filters);
		dispatch({ type: 'setLoading', payload: false });
		dispatch({ type: 'setBooks', payload: books });
	},
};

const reducer = {
	setLoading: (state, loading) => ({ ...state, loading }),
	setBooks: (state, books) => ({ ...state, books }),
};

export const [BooksContext, BooksProvider, useBooks] = createStore(reducer, actions, {
	loading: false,
	books: [],
});

BooksContext.displayName = 'Books';

export default BooksContext;
