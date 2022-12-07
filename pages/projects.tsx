import Layout from '@components/layouts/Layout';
import ProjectsContent from '@components/ProjectsContent';
import ProjectsFilterTab from '@components/ProjectsFilterTab';

export default function Projects() {
  return (
    <Layout>
      <div className={styles.root}>
        <input id="projects-tab" type="checkbox" className={styles.toggler} />
        <div className={styles.drawerContent}>
          <ProjectsContent />
        </div>
        <div className={styles.drawerSide}>
          <label
            htmlFor="projects-tab"
            className={styles.drawerOverlay}
          ></label>
          <div className={styles.drawerSideContent}>
            <ProjectsFilterTab />
          </div>
        </div>
      </div>
    </Layout>
  );
}

const styles = {
  root: 'drawer drawer-mobile h-custom-y-screen',
  toggler: 'drawer-toggle',
  drawerContent: 'drawer-content h-custom-y-screen',
  drawerSide: 'drawer-side',
  drawerOverlay: 'drawer-overlay',
  drawerSideContent:
    'menu bg-base-100 max-w-xs w-custom-x-screen p-2 rounded-r-lg border-2 shadow-inner lg:border-none lg:shadow-none lg:rounded-tl-lg lg:border-2',
};
