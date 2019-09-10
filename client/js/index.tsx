import { createElement, useState, useReducer, useEffect } from 'react';
import { render } from 'react-dom';
import Prompt from './components/Prompt';
import History from './components/History';
import ButtonPad from './components/ButtonPad';

import { createReducer, initialState, Actions } from './reducer';

function App() {
  const [socket, setSocket] = useState();
  const [state, dispatch] = useReducer(createReducer((operations) => {
    socket.send(JSON.stringify({operations}));
  }), initialState);

  useEffect(() => {
    const newSocket = new WebSocket('wss://shared-calculator.herokuapp.com');

    newSocket.addEventListener('message', function (event) {
      const message = JSON.parse(event.data);

      if (message.type === 'sync') {
        dispatch({ type: Actions.LOGIN, data: { username: message.clientId, color: message.color } });
        dispatch({ type: Actions.SYNC_CALCULATIONS, data: { calculations: message.calculations } });
      } else if (message.type === 'append') {
        dispatch({ type: Actions.APPEND_CALCULATION, data: { calculation: message.calculation } })
      }
    });

    setSocket(newSocket);

    document.addEventListener('keydown', e => {
      e.preventDefault();
      if (e.keyCode === 8) {
        handleButton('B');
      } else if (e.keyCode === 13) {
        handleButton('=');
      } else {
        handleButton(e.key);
      }
    });

    return () => {
      socket.close();
    };
  }, []);

  function handleButton(c) {
    if (c === 'B') {
      onClear();
    } else if ('1234567890.'.indexOf(c) >= 0) {
      enterDigit(c);
    } else if ('=+-*/'.indexOf(c) >= 0) {
      selectOperator(c);
    }
  }

  function selectOperator(op) {
    dispatch({ type: Actions.OPERATE, data: { op } })
  }
  
  function onClear() {
    dispatch({ type: Actions.CLEAR })
  }

  function enterDigit(digit) {
    dispatch({ type: Actions.DIGIT, data: { digit } })
  }

  return state.username && (
    <div>
      <History lines={state.history} />
      <Prompt
        username={state.username}
        color={state.color}
        entering={state.entering}
        operations={state.operations}
        allowSubmit={state.allowSubmit}
        selectOperator={selectOperator}
      />
      <ButtonPad onSelect={c => handleButton(c)} />
    </div>
  );
}

const root = document.getElementById('calculator');

render(<App />, root);
