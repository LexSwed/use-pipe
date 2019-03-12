import React, { useState } from "react";

import { useStore } from "./store";

const Counter = () => {
  const [counter, changeCounter] = useStore((state, actions) => {
    return [state.count, actions.changeCounter];
  });
  const [value, setValue] = useState(0);
  const onInput = e => setValue(e.target.value);
  const onSubmit = e => {
    e.preventDefault();
    changeCounter(value);
  };
  return (
    <div className="App">
      <h1>Hello use-pipe user!</h1>
      <form onSubmit={onSubmit}>
        <input type="number" value={value} onChange={onInput} />
        <button type="submit">Submit</button>
      </form>
      <h1>{counter}</h1>
    </div>
  );
};

export default Counter;
