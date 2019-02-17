# use-pipe

Global state management using React Context and Hooks API.

## Description

This small helper was built to solve one particluar problem - global state management that can be extended in features, if needed, added better debugging experience, if needed, have reliability of Redux with less boilerplate. And use Hooks of course.

## API

```js
// src/modules/books.js
import api from './api';
import createStore from 'use-pipe';

const actions = {
	getBooks: dispatch => async filters => {
		dispatch({ type: 'setLoading', payload: true });

		const books = await api.getBooks();
		dispatch({ type: 'setLoading', payload: false });
		dispatch({ type: 'setBooks', payload: books });
	}
};

const reducer = {
	setLoading: (state, loading) => ({ ...state, loading }),
	setBooks: (state, books) => ({ ...state, books })
};

export const [BooksContext, BooksProvider, useBooks] = createStore(reducer, actions, {
	loading: false,
	books: []
});

BooksContext.displayName = 'Books';

export default BooksContext;
```

```js
// src/index
import React from 'react';
import ReactDOM from 'react-dom';

import { BooksProvider } from 'modules/books';
import Library from 'lib/Library';

const App = () => {
	return (
		<BooksProvider>
			<Library />
		</BooksProvider>
	);
};

ReactDOM.render(<App />, document.getElementById('app'));
```

```js
// src/lib/Book

const Library = () => {
	const { loading, getBooks } = useBooks((state, actions) => ({
		loading: state.loading,
		getBooks: actions.getBooks
	})); // selecting what we want

	useEffect(() => {
		getBooks();
	}, []);

	return loading ? <Loader /> : <BooksList />;
};
```

```js
// src/lib/BooksList
const BooksList = () => {
	const books = useBooks(state => state.books); // can return anything

	return books.map(book => <Book key={book.id} title={book.title} author={book.author} />);
};
```
