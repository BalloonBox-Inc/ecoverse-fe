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
  root: 'py-4 px-2 md:px-4',
  headerContainer: 'flex items-center justify-between',
  button:
    'btn btn-ghost no-animation btn-xs drawer-button lg:hidden hover:bg-transparent',
  icon: 'h-3 w-3 fill-current',
};
