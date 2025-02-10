import { useState } from 'react';
import { Button } from '@/shared/ui/shadcn/button';
import { Field } from '@/shared/types/sharedTypes';

const fields: Field[] = ['WEB', 'AND', 'IOS'];

type FieldFilterProps = Readonly<{
  onClickFilterButton: (field: Field) => void;
}>;

export function FieldFilter({ onClickFilterButton }: FieldFilterProps) {
  const [selected, setSelected] = useState<Field>('');

  const handleClick = (field: Field) => {
    const newField = selected === field ? '' : field;
    setSelected(newField);
    onClickFilterButton(newField);
  };

  return (
    <div className="flex flex-row justify-between gap-4">
      {fields.map((field: Field) => (
        <Button
          key={field}
          onClick={() => handleClick(field)}
          className={`${
            selected === field
              ? 'bg-surface-brand-default hover:bg-surface-point-alt'
              : 'bg-transparent border border-border-default hover:bg-surface-alt text-text-strong'
          }`}
        >
          {field}
        </Button>
      ))}
    </div>
  );
}
