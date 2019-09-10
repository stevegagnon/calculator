import { createElement } from 'react';

interface Props {
  onSelect: (operator: string) => unknown;
}

export default function OperatorSelector({ onSelect }: Props) {
  return (
    <span>
      <button onClick={() => onSelect('=')}>=</button>
      <button onClick={() => onSelect('+')}>+</button>
      <button onClick={() => onSelect('-')}>-</button>
      <button onClick={() => onSelect('*')}>*</button>
      <button onClick={() => onSelect('/')}>/</button>
    </span>
  );
}
