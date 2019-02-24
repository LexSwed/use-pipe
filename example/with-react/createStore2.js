import React from 'react';
import createStore2 from '../src/createStore2';

export const getData = dispatch => async params => {
	const data = await api.getData(params);

	dispatch({ type: 'setData', payload: data });
};

const reducer = {
	setData: (state, data) => ({ ...state, data }),
};

const [context, Provder, useData] = createStore2(reducer, { data: null, otherData: 'not null' });

const DataUser = () => {
	const { data, getData } = useData(state => ({ data: state.data, getData: getData }));

	return (
		<div>
			<p>{data}</p>
			<button onClick={() => getData()}>Get data</button>
		</div>
	);
};

const App = () => (
	<Provder>
		<DataUser />
	</Provder>
);
