import MenuIconClose from './Icons/MenuIconClose';

export default function ProjectsFilterTab() {
  return (
    <div className={styles.root}>
      <div className={styles.headerContainer}>
        <h2>Filters</h2>
        <label htmlFor="projects-tab" className={styles.button}>
          <MenuIconClose className={styles.icon} />
        </label>
      </div>
    </div>
  );
}

const styles = {
  root: 'w-full h-full border-info/60 rounded-lg lg:py-4 lg:px-2 lg:border-2 lg:shadow-lg',
  headerContainer: 'flex items-center justify-between',
  button: 'btn btn-ghost btn-xs drawer-button lg:hidden hover:bg-transparent',
  icon: 'h-3 w-3 fill-current',
};
