
export let Actions = {
  LOGIN: Symbol('LOGIN'),
  OPERATE: Symbol('OPERATE'),
  CLEAR: Symbol('CLEAR'),
  DIGIT: Symbol('DIGIT'),
  SYNC_CALCULATIONS: Symbol('SYNC_CALCULATIONS'),
  APPEND_CALCULATION: Symbol('APPEND_CALCULATION'),
};

export let initialState = {
  username: null,
  color: null,
  history: [],
  entering: '',
  operations: [],
  allowSubmit: false
};

export function createReducer(updateRemote) {
  return (state, { type, data }) => {
    switch (type) {
      case Actions.LOGIN:
        return {
          ...state,
          username: data.username,
          color: data.color
        };
      case Actions.OPERATE:
        if (state.entering !== '' && state.entering !== '-') {
          const operations = [...state.operations, { value: state.entering, op: data.op }];
          if (data.op === '=') {
            updateRemote(operations);
            return {
              ...state,
              entering: '',
              operations: [],
              allowSubmit: false
            };
          } else {
            return {
              ...state,
              entering: '',
              operations: operations,
              allowSubmit: false
            };
          }
        } else if (data.op === '-') {
          return {
            ...state,
            entering: '-',
            allowSubmit: false
          };
        } else {
          return state;
        }

      case Actions.CLEAR:
        if (state.entering === '') {
          const last = state.operations.slice(-1).pop() || { value: '' };
          return {
            ...state,
            allowSubmit: false,
            entering: last.value,
            operations: state.operations.slice(0, -1)
          };
        } else {
          const entering = state.entering.slice(0, -1);
          return {
            ...state,
            allowSubmit: entering !== '',
            entering: entering
          };
        }

      case Actions.DIGIT:
        if (data.digit !== '.' || state.entering.indexOf('.') < 0) {
          return {
            ...state,
            entering: `${state.entering}${data.digit}`,
            allowSubmit: true
          };
        } else {
          return state;
        }

      case Actions.SYNC_CALCULATIONS:
        return {
          ...state,
          history: data.calculations
        };

      case Actions.APPEND_CALCULATION:
        return {
          ...state,
          history: [...state.history, data.calculation].slice(-10)
        };
    }
  };
}
