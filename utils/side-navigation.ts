import HelpIcon from '@components/Icons/HelpIcon';
import MapIcon from '@components/Icons/MapIcon';
import MyForestsIcon from '@components/Icons/MyForestsIcon';
import ProjectsIcon from '@components/Icons/ProjectsIcon';
import { ClassNameProps } from '@utils/interface/global-interface';

enum NavItemId {
  map = 'map',
  projects = 'projects',
  forest = 'myForest',
  help = 'help',
}

export type VoidFunction = () => void;
export interface NavItem {
  id: string;
  label: string;
  Icon: ({ className }: ClassNameProps) => JSX.Element;
  href: string;
}

export const navList: NavItem[] = [
  {
    id: NavItemId.map,
    label: 'Map',
    Icon: MapIcon,
    href: '/',
  },
  {
    id: NavItemId.projects,
    label: 'Projects',
    Icon: ProjectsIcon,
    href: '/projects',
  },
  {
    id: NavItemId.forest,
    label: 'My Forests',
    Icon: MyForestsIcon,
    href: '/forests',
  },
  {
    id: NavItemId.help,
    label: 'Help',
    Icon: HelpIcon,
    href: '/help',
  },
];

Object.freeze(navList);
