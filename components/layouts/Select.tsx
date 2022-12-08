import React, { ChangeEventHandler, useMemo } from 'react';

export interface SelectAttributes {
  options: string[];
  name: string;
  onChange: ChangeEventHandler<HTMLSelectElement>;
  defaultSelected: string | undefined;
  label: string;
  onClearSelected?: () => void;
}

Select.defaultProps = { className: '', onClearSelected: () => {} };

export default function Select({
  options,
  onChange,
  name,
  defaultSelected,
  label,
  onClearSelected,
}: SelectAttributes) {
  const displayOptions = useMemo(
    () =>
      options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      )),
    [options]
  );

  return (
    <div className={styles.root}>
      <div className={styles.labelContainer}>
        <label htmlFor={name} className={styles.label}>
          {label}
        </label>
        {defaultSelected && (
          <button className={styles.clearButton} onClick={onClearSelected}>
            Clear
          </button>
        )}
      </div>

      <select
        id={name}
        name={name}
        className={styles.select}
        onChange={onChange}
        value={defaultSelected ?? `--Select ${label}--`}
        disabled={options.length < 2}
      >
        {options.length > 1 && (
          <option disabled className={styles.option}>
            --Select {label}--
          </option>
        )}
        <>{displayOptions}</>
      </select>
    </div>
  );
}

const styles = {
  root: 'flex flex-col gap-1 w-full',
  labelContainer: 'flex justify-between items-center',
  label: 'capitalize text-sm',
  clearButton: 'btn btn-link btn-xs btn-info',
  select: 'select select-accent select-sm w-full',
  option: 'capitalize',
};
