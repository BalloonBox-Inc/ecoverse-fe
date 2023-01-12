import CertifiedIcon from './Icons/CertifiedIcon';

export default function ProjectsFscBadge() {
  return (
    <div className={styles.root} data-tip="FSC Certified">
      <CertifiedIcon className={styles.icon} />
      FSC
    </div>
  );
}

const styles = {
  root: 'tooltip tooltip-success tooltip-right text-success flex gap-1 items-center cursor-default sm:tooltip-bottom',
  icon: 'h-4 w-4 fill-current',
};
