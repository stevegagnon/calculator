import { createElement } from 'react';

interface Props {
  onSelect: (c: string) => unknown;
}

export default function ButtonPad({ onSelect }: Props) {
  const buttons = Array.from("789*456-123+0.=/");
  return (
    <div>
      <div className="button-pad " >
        {buttons.map(c => <button onClick={() => onSelect(c)}>{c}</button>)}
      </div>
    </div>
  );
}
