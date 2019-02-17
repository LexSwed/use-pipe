import React, { useEffect } from 'react';
import { BooksProvider, useBooks } from '../books';

const Books = () => {
	const books = useBooks(state => state.data.books);

	return (
		<ul>
			{books.map(book => (
				<div key={book.id}>{book.title}</div>
			))}
		</ul>
	);
};

const Bookshelf = () => {
	const { initState, isEmpty } = useBooks((store, actions) => ({
		initState: actions.initState,
		isEmpty: store.data.books.length === 0,
	}));

	useEffect(() => {
		isEmpty && initState();
	}, []);

	return !isEmpty && <Books />;
};

const App = () => {
	return (
		<BooksProvider>
			<Bookshelf />
		</BooksProvider>
	);
};
