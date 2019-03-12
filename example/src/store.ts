import createStore, { StoreAction, StoreReducer } from "../../src/index";

enum Action {
  setDetails = "setDetails",
  setInfo = "setInfo",
  changeCounter = "changeCounter"
}

type Data = {
  info?: string;
  details?: string;
  count: number;
};

const fetchDetails = (id: number): StoreAction<Action, Data> => async (
  dispatch,
  state
) => {
  const res = await Promise.resolve({ data: `Hello details! with id ${id}` });

  dispatch({ type: Action.setDetails, payload: res.data });
};

const fetchInfo = (): StoreAction<Action, Data> => async (dispatch, state) => {
  const res = await Promise.resolve({ data: "Hello info" });

  dispatch({ type: Action.setInfo, payload: res.data });
};

const changeCounter = (diff: string): StoreAction<Action, Data> => (
  dispatch,
  state
) => {
  dispatch({ type: Action.changeCounter, payload: parseInt(diff, 10) });
};

const actions = {
  fetchDetails,
  fetchInfo,
  changeCounter
};

const reducer: StoreReducer<Action, Data> = {
  [Action.setDetails]: (state, details) => ({ ...state, details }),
  [Action.setInfo]: (state, info) => ({ ...state, info }),
  [Action.changeCounter]: (state, diff) => ({
    ...state,
    count: state.count + diff
  })
};

const initialState: Data = {
  info: null,
  details: null,
  count: 0
};

export const [context, Provider, useStore] = createStore(
  reducer,
  actions,
  initialState
);

export default context;
