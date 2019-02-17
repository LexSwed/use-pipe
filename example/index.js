import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useBooks, BooksProvider } from './books';

const BooksList = () => {
	const books = useBooks(state => state.books);

	return books.map(book => <Book key={book.id} title={book.title} author={book.author} />);
};

const Library = () => {
	const { loading, getBooks } = useBooks((state, actions) => ({
		loading: state.loading,
		getBooks: actions.getBooks,
	}));

	useEffect(() => {
		getBooks({ first: 20 });
	}, []);

	return loading ? <Loader /> : <BooksList />;
};

ReactDOM.render(
	<BooksProvider>
		<Library />
	</BooksProvider>,
	document.getElementById('app'),
);
