import { Action, Actions } from './types';
import { getAvailableBooks, getUserInfo } from 'api';

const actions: Actions = {
	initState: dispatch => async customerId => {
		const books = await getAvailableBooks();
		const userInfo = getUserInfo(customerId);
		dispatch({ type: Action.initState, payload: { data: { books }, state: getDerivedState(userInfo) } });
	},
	setBookmark: (dispatch, store) => (bookId: number) => {
		const book = store.data.books.find(book => book.id === bookId);

		dispatch({ type: Action.updateBookmark, payload: { bookId, ...book.meta } });
	},
	// etc
};

export default actions;
