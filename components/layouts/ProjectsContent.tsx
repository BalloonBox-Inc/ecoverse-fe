import FilterIcon from '@components/Icons/FilterIcon';

export default function ProjectsContent() {
  return (
    <div className={styles.root}>
      <div className={styles.headerContainer}>
        <label htmlFor="projects-tab" className={styles.button}>
          <FilterIcon className={styles.icon} />
        </label>
        <h1>Projects</h1>
      </div>
    </div>
  );
}

const styles = {
  root: 'py-4 px-2 h-screen md:px-4',
  headerContainer: 'flex items-center',
  button:
    'btn btn-ghost no-animation btn-xs drawer-button lg:hidden hover:bg-transparent',
  icon: 'h-4 w-4 fill-current',
};
