import { createElement } from 'react';
import Operator from './Operator';

interface Operation {
  value: string;
  op: string;
}

interface Props {
  username: string;
  color: string;
  entering: string;
  operations: Operation[];
  selectOperator: (operator: string) => unknown;
  allowSubmit: boolean;
}

export default function Prompt({ username, color, entering, operations, selectOperator, allowSubmit }: Props) {
  return (
    <div>
      <span className="username" style={{color}}>{username}$ </span>

      {operations.map(({ value, op }) => {
        return (
          <span>  {value} <Operator op={op} /> </span>
        )
      })}

      <span className="entering">{entering}</span>
    </div>
  );
}
