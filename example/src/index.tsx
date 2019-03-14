import React from 'react';
import { render } from 'react-dom';
import { Provider } from './store';
import Counter from './Counter';
import './styles.css';

function App() {
	return (
		<Provider>
			<Counter />
		</Provider>
	);
}

const rootElement = document.getElementById('root');
render(<App />, rootElement);
