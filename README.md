# use-pipe

[![build](https://travis-ci.com/LexSwed/use-pipe.svg?branch=master)](https://travis-ci.com/LexSwed/use-pipe)
[![npm package](https://img.shields.io/npm/v/use-pipe.svg?style=flat-square)](https://www.npmjs.com/package/use-pipe)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Global state management using React Context and Hooks API.

[Sandbox to Counter example](https://codesandbox.io/s/wyyj8rr1pk)

## Description

This small helper was built to solve one particluar problem - global state management that can be extended in features, if needed, added better debugging experience, if needed, have reliability of Redux with less boilerplate. And use Hooks of course.

## Content

- [Which problem it solves](#which-problem-it-solves)
- [FAQ](#faq)
- [API](#api)
- [Example of usage](#example-of-usage)

## Which problem it solves?

This lib allows easier store creation and usage. Let's take a look at redux example:

You define your action creators and functions that make use of redux-thunk middleware somewhere:

```js
// actions.js
function fetchBooks() {
	// maybe do smth
	return dispatch => {
		// dispatch actions
	};
}

function getBook(id) {
	// maybe do smth
	return dispatch => {
		// dispatch actions
	};
}
```

Then you create your store and use functions to connect them to the store and component:

```jsx
// BooksPage.jsx
// import Loader and BooksList
import { Component } from 'react';
import { connect } from 'react-redux';

import { fetchBooks } from './actions'; // import

class BooksPage extends Component {
	componentDidMount() {
		this.props.fetchBooks();
	}

	render() {
		const { isLoading, books = [] } = this.props;

		return isLoading ? <Loader /> : books.map(book => <BookItem key={book.id} book={book} />);
	}
}

const mapStateToProps = state => ({
	books: state.books,
	isLoading: state.loading,
});

const mapDispatchToProps = dispatch => {
	return {
		fetchBooks: () => dispatch(fetchBooks()), // create dispatcher
	};
}; // map

connect(
	mapStateToProps,
	mapDispatchToProps,
)(BooksList); // connect
```

It just seems like a lot of steps to do. With proposed API, what you do is:

```jsx
// import Loader and BooksList
import { useBooks } from './books';

const BooksPage = () => {
	const { books, isLoading, fetchBooks } = useBooks((store, { fetchBooks }) => ({
		isLoading: state.loading,
		books: state.books,
		fetchBooks,
	})); // just map

	useEffect(() => {
		fetchBooks({ first: 20 }); // and use
	}, []);

	return isLoading ? <Loader /> : <BooksList />;
};
```

## Global store creation and usage

Knowing that billing pages doesn't have complicated business logic we developed a small `~600b` typesafe library for global state management and business logic decoupling. It uses React's [Context API](https://reactjs.org/docs/context.html) and React's [Hooks](https://reactjs.org/docs/hooks-intro.html) (`useContext` and `useReducer` specifically). API was developed to resemble Redux for easier adoption.

Simple steps this helper lib does for you:

- create context using `React.createContext(initialState)`;
- create `Provider` component which uses `React.useReducer` hook to have the latest state which is passed to created `context.Provider`;
- create `useStore` hook to select needed values/actions from context;

### Context creation

To create simple a store you need `reducer` and `actions`. Let's start from `reducer`:

```ts
const reducer = {
  setUsers: (state, users) => ({ ...state, users })
  addUser: (state, user) => ({ ...state, users: [...state.users, user]})
};
```

A reducer is just an object that has `key` as [`action type`](https://redux.js.org/basics/actions#actions) and reducer function as value. Reducer function takes two arguments: current `state` and passed `payload`, if any. In example `payload`s are called `users` and `user`. Reducer function should [always return a new state](https://redux.js.org/basics/reducers#handling-actions). With this structure you don't have to write `switch-case` and `switch` and `case` on action types.

Next, we need a way to change the store:

```ts
const actions = {
	fetchUsers: (first = 20) => async (dispatch, state) => {
		const people = await get(`/users?first=${first}`);

		dispatch({ type: 'setUsers', payload: people });
	},
};
```

Actions might resemble you [redux-thunk](https://github.com/reduxjs/redux-thunk#whats-a-thunk). For now, we should always dispatch an object with `type` as action type and, if we need to pass some data to reducer, `payload` field.

Now we can create store itself:

```ts
import { createStore } from 'utils/createStore';

const [UsersContext, UsersProvider, useUsers] = createStore(reducer, actions);
```

We can also pass initial state:

```ts
import { createStore } from 'utils/createStore';

const [UsersContext, UsersProvider, useUsers] = createStore(reducer, actions, {
	users: [],
	isLoading: true,
});

// Recommended to export default context object
export default UsersContext;
```

`createStore` returns a tuple of three elements: created [`context` object](https://reactjs.org/docs/context.html#reactcreatecontext), [context.Provider](https://reactjs.org/docs/context.html#contextprovider) with `value` prop bound to the reducer state, and `useX` hook.

- `context` object is needed when you want to define debugging name of context or use it when you need access to the whole state (`value`);
- `context.Provider` should be placed somewhere on top of the tree for its children to have access to state;
- `useX` hook can be used to select specific items from the store: hook takes selector function that allows selecting needed items from context.

### Context value and usage

Context value is a tuple of `[state, actions]`, where `state` is the latest state and `actions` - is a map of passed `actions` but bound to the state. So if you want to fetch users, you can simply run:

```ts
import React, { useContext } from 'react';
import UsersContext from 'context/Users';

const UsersList = () => {
	const [state, actions] = useContext(UsersContext);

	useEffect(() => {
		actions.fetchUsers(10); // first 10, from defined actions on top
	}, []);

	return state.users.map(user => <Usersr key={user.id} user={user} />);
};
```

You can also use `useX` hook returned by `createStore` to select needed values, from the example above we defined its name as `useUsers`:

```tsx
import React from 'react';
import { useUsers } from 'context/Users';

const UsersList = () => {
	const [users, fetchUsers] = useUsers((state, actions) => [state.users, actions.fetchUsers]);

	useEffect(() => {
		fetchUsers(10);
	}, []);

	return users.map(user => <User key={user.id} user={user} />);
};
```

Or when we need only one field:

```tsx
import React from 'react';
import { useUsers } from 'context/Users';

const Usersr = id => {
	const user = useUsers(state => state.users.find(user => user.id === id));

	// render some info about this Usersr
};
```

We can await for actions to resolve:

```tsx
import React, { useState } from 'react';
import { useUsers } from 'context/Users';

const UsersListWrapper = () => {
	const fetchUsers = useUsers((_, actions) => actions.fetchUsers);
	const [isReady, setReady] = useState(false);

	useEffect(() => {
		fetchUsers(10).then(() => setReady(true));
	}, []);

	return isReady && <UsersList />;
};
```
