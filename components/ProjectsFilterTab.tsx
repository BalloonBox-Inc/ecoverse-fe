import MenuIconClose from '@components/Icons/MenuIconClose';
import * as Filter from '@components/project-filters/index';

export default function ProjectsFilterTab() {
  return (
    <div className={styles.root}>
      <div className={styles.headerContainer}>
        <h2 className={styles.header}>Filters</h2>
        <label htmlFor="projects-tab" className={styles.button}>
          <MenuIconClose className={styles.icon} />
        </label>
      </div>

      <div className={styles.filters}>
        <Filter.Country />
        <Filter.Resource />
        <Filter.Status />
        <Filter.CertifiedFSC />
      </div>
    </div>
  );
}

const styles = {
  root: 'w-full h-full border-accent/20 rounded-lg lg:py-4 lg:px-2 lg:border-2 lg:shadow-lg bg-white',
  headerContainer: 'flex items-center justify-between',
  header: 'text-xl',
  button: 'btn btn-ghost btn-xs drawer-button lg:hidden hover:bg-transparent',
  icon: 'h-3 w-3 fill-current',
  filters: 'flex flex-col gap-4 w-full mt-4',
};
