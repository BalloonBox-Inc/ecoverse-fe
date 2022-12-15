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
  root: 'tooltip tooltip-success tooltip-right text-success flex gap-1 items-center cursor-default sm:tooltip-left',
  icon: 'h-5 w-5 fill-current',
};
