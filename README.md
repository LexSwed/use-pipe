# use-pipe
[![build](https://travis-ci.com/LexSwed/use-pipe.svg?branch=master)](https://travis-ci.com/LexSwed/use-pipe)
[![npm package](https://img.shields.io/npm/v/use-pipe.svg?style=flat-square)](https://www.npmjs.com/package/use-pipe)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Global state management using React Context and Hooks API.

[Sandbox to Counter example](https://codesandbox.io/s/wyyj8rr1pk)

## Description

This small helper was built to solve one particluar problem - global state management that can be extended in features, if needed, added better debugging experience, if needed, have reliability of Redux with less boilerplate. And use Hooks of course.

## Content

* [Which problem it solves](#which-problem-it-solves)
* [FAQ](#faq)
* [API](#api)
* [Example of usage](#example-of-usage)

## Which problem it solves?

This lib allows easier store creation and usage. Let's take a look at redux example:

You define your action creators and functions that make use of redux-thunk middleware somewhere:
```js
// actions.js
function fetchBooks() {
  // maybe do smth
  return (dispatch) => {
    // dispatch actions
  }
}

function getBook(id) {
  // maybe do smth
  return (dispatch) => {
    // dispatch actions
  }
}
```
Then you create your store and use functions to connect them to the store and component:
```jsx
// BooksPage.jsx
// import Loader and BooksList
import { Component } from 'react';
import { connect } from 'react-redux'

import { fetchBooks } from './actions'; // import

class BooksPage extends Component {
  componentDidMount() {
    this.props.fetchBooks();
  }

  render() {
    const { isLoading, books = [] } = this.props;

    return isLoading ? <Loader /> : books.map(book => <BookItem key={book.id} book={book} />)
  }
}

const mapStateToProps = state => ({
  books: state.books,
  isLoading: state.loading
})

const mapDispatchToProps = dispatch => {
  return {
    fetchBooks: () => dispatch(fetchBooks()) // create dispatcher
  }
} // map

connect(mapStateToProps, mapDispatchToProps)(BooksList); // connect
```

It just seems like a lot of steps to do. With proposed API, what you do is:

```jsx
// import Loader and BooksList
import { useBooks } from './books';

const BooksPage = () => {
  const { books, isLoading, fetchBooks } = useBooks((store, {fetchBooks}) => ({
    isLoading: state.loading,
    books: state.books,
    fetchBooks,
  })); // just map

  useEffect(() => {
    fetchBooks({ first: 20 }); // and use
  }, []);

  return isLoading ? <Loader /> : <BooksList />;
}
```

## FAQ

> What is the simpliest store I can make?

Let's imagine we're building a UI for user profile where user can, for example, set his email:

```js
import createStore from 'use-pipe';

const reducer = {
  setEmail: (state, payload) => ({...state, email: payload});
}; // create reducer

export const [context, Provider, useStore] = createStore(reducer, null, { email: '' }); // create store with reducer and initial state

// Since we didn't provide actions map, we can dispatch actions directly:
// YourComponent, descendant of Provider:
import { useStore } from './store';
const Component = () => {
  const { email, dispatch } = useStore((state, _, dispatch) => ({ // second argument is null
    email: state.email,
    dispatch
  }))

  const onSubmit = (email) => dispatch({ type: 'setEmail', payload: email }); // create submit handler

  return <EmailForm onSubmit={onSubmit} />; // some input which handles form
}
```
But you usually would want to decouple your action creators from components:

```js
const actions = {
  setEmail: email => dispatch => ({ type: 'setEmail', payload: email })
};

export const [context, Provider, useStore] = createStore(reducer, actions, { email: '' }); // now with actions in place
```
Now you can use it in your component:
```js
const Component = () => {
  const { email, setData } = useStore((state, actions) => ({
    email: state.email,
    setEmail: actions.setData;
  }))

  // use it
  return <EmailInputForm onSubmit={setData} />
}
```

## API

### - Reducer
It's an object with a key as `action.type` and value as a function that takes current `state` value and passed data as `payload` and **returns a new state**.
```js
// action types
const SET_DATA = 'SET_DATA';

const reducer = {
  [SET_DATA]: (state, payload) => ({...state, data: payload })
};
```
Same example with redux:
```js
const SET_DATA = 'SET_DATA';

function reducer(state, { type, payload }) {
  switch type {
    case [SET_DATA]:
      return {...state, data: payload }
    default:
      return state; // don't forget to write default
  }
}
```

### - Actions
It's an object with function name as a key, and as a value a function which takes `dispatch` to dispatch actions and `state` to get access to current module state and returns a function to operate on store.
Example:
```js
const fetchBookById = (dispatch, state) => (bookId) => {
  dispatch({ type: 'setLoading', loading: true });
  const { iamge, title } = state.books.find(book => book.id === bookId); // use state to get book info which we already have
  dispatch({ type: 'setImageAndTitle', payload: { id: bookId, image, title }}); // and set it to state to show some initial data while loading all information
  const book = await fetch(`${booksUrl}/?book=${bookId}`); // some API to get book info
  dispatch({ type: 'setLoading', loading: false });
  dispatch({ type: 'setBookData', book });
};

const actions = { // create actions object to use in store
  fetchBookById
};
```

### - createStore

Function which takes your [Reducer](#reducer), [Actions](#actions) and initial state and returns a tuple of three elements: created `context`, `Provider` and `useStore` functions.

```ts
const store = createStore(reducer, actions, { name: '' });
// Just an array:
const context = store[0];
const Provider = store[1];
const useStore = store[2];
```

Why tuple? Because you want to name returned elements by yourself, based on the context:

```js
const [UserInfo, UserInfoProvider, useUserInfo] = createStore(reducer, actions, { user: null, friends: [] }); // null by default
```

### - context, Provider, useStore

[`createStore`](#createstore) returns `context`, `Provider` and `useStore`. What are these?

- `context`: just regular [`React.Context`](https://reactjs.org/docs/context.html) which you get from `React.createContext()`. `createStore` returns it for easier use of all context value using [`useContext` hook](https://reactjs.org/docs/hooks-reference.html#usecontext). Context value is `[state, actions]` where `state` is the current `state` and `actions` is a map of actions passed when store was created, but already bound to a store.
```js
// stores/user.js
const [UserInfo] = createStore(reducer, actions, { email: '' });
// component.js
import React, { useContext } from 'react';
import { UserInfo } from 'stores/user';

const Component = () => {
  const [userState, userActions] = useContext(UserInfo);

  // use all state
}
```

- `Provider` - just a `React` component which uses created context provider with `value={[state, actions]}`, so passes current `state` and bound `action`s to context consumers. Use it to place global store in your React tree (so all descedants will have access to the store through React context).

```js
// stores/user.js
const [UserInfo, UserProvider] = createStore(reducer, actions, { email: '' });
// App.jsx
import { UserProvider } from 'stores/user';
import Routes from './Routes';

const App = () => {
  return (<UserProvider><Routes /></UserProvider>);
}
```

- `useX` is a third returned value from [`createStore`](#createstore). It is a React hook which takes a selector function as a parameter. Selector function takes current `state` and `actions` as parameters and returns anything, but usually you would want it to return what you need from store.

```js
// stores/user.js
const [UserInfo, UserInfoProvider, useUserInfo] = createStore(reducer, actions, { email: '' });

// component.js
import { useUserInfo } from 'stores/user';

const Component = () => {
  // take only one field;
  const email = useUserInfo(state => state.email);
  // select with action and return a tuple
  const [ email, setEmail ] = useUserInfo((state, actions) => [state.email, actions.setEmail]);
  // map state
  const { email, fetchInfo, setEmail } = useUserInfo((state, actions) => ({
    email: state.email, 
    setEmail: actions.setEmail,
    fetchInfo: actions.fetchInfo
    }
  ));

  // use it
}
```

## Example of usage

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
