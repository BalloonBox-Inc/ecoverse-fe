interface Props {
  label: string;
  value: number;
}

export default function FarmStats({ label, value }: Props) {
  return (
    <div className={styles.root}>
      <p>{label}</p>
      <p className={styles.value}>{value}</p>
    </div>
  );
}

const styles = {
  root: 'flex flex-col gap-1 items-start justify-between w-full',
  value: 'text-sm',
};
