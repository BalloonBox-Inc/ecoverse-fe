interface Props {
  label: string;
  value: number;
  desc: string;
}

export default function FarmStatItem({ label, value, desc }: Props) {
  return (
    <div className={styles.root}>
      <p className={styles.title}>{label}</p>
      <div>
        <p className={styles.value}>{Number(value.toFixed(6))}</p>
        <p className={styles.desc}>{desc}</p>
      </div>
    </div>
  );
}

const styles = {
  root: 'stat gap-y-2 content-between border-transparent',
  title: 'stat-title h-max whitespace-normal',
  value: 'stat-value text-base text-primary whitespace-normal',
  desc: 'stat-desc whitespace-normal',
};
