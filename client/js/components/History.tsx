import { createElement, Fragment } from 'react';
import Operator from './Operator';

interface Props {
  lines: any[];
}

export default function History({ lines }: Props) {
  function resolve(operation) {
    try {
      let result = +operation[0].value;
      for (let i = 1; i < operation.length; ++i) {
        const value = +operation[i].value;
        switch (operation[i - 1].op) {
          case '+': result += value; break;
          case '-': result -= value; break;
          case '*': result *= value; break;
          case '/': result /= value; break;
          case '=': break;
          default: throw 'what?'
        }
      }
      return result;
    } catch (error) {
      return error;
    }
  }

  return (
    <div>
      {lines.map(({ id, color, username, operations }) => {
        return (
          <div key={id}>
            <span className="username" style={{ color }}>{username}: </span>
            {operations.map(({ value, op }, i) => {
              return (
                <Fragment key={`${id}:${i}`}>
                  <span> {value} </span>
                  <Operator op={op} />
                </Fragment>
              )
            })}
            <span> {resolve(operations)} </span>
          </div>
        );
      })}
    </div>
  );
}
