import HelpIcon from '@components/Icons/HelpIcon';
import MapIcon from '@components/Icons/MapIcon';
import MyForestsIcon from '@components/Icons/MyForestsIcon';
import ProjectsIcon from '@components/Icons/ProjectsIcon';
import { ClassNameProps } from '@utils/interface/global-interface';

export enum NavItemId {
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
  private: boolean;
}

export const navList: NavItem[] = [
  {
    id: NavItemId.map,
    label: 'Map',
    Icon: MapIcon,
    href: '/',
    private: false,
  },
  {
    id: NavItemId.projects,
    label: 'Projects',
    Icon: ProjectsIcon,
    href: '/projects',
    private: false,
  },
  {
    id: NavItemId.forest,
    label: 'My Forests',
    Icon: MyForestsIcon,
    href: '/forests',
    private: true,
  },
  {
    id: NavItemId.help,
    label: 'Help',
    Icon: HelpIcon,
    href: '/help',
    private: false,
  },
];

Object.freeze(navList);
