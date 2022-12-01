import HelpIcon from '@components/Icons/HelpIcon';
import MapIcon from '@components/Icons/MapIcon';
import MyForestsIcon from '@components/Icons/MyForestsIcon';
import ProjectsIcon from '@components/Icons/ProjectsIcon';
import SearchIcon from '@components/Icons/SearchIcon';

export const navList = [
  {
    label: 'Map',
    Icon: MapIcon,
    action: 'link',
    href: '/',
  },
  {
    label: 'Projects',
    Icon: ProjectsIcon,
    action: 'link',
    href: '/projects',
  },
  {
    label: 'My Forests',
    Icon: MyForestsIcon,
    action: 'link',
    href: '/forests',
  },
  {
    label: 'Help',
    Icon: HelpIcon,
    href: '/help',
    action: 'link',
  },
];

Object.freeze(navList);

export const navListSecondary = [
  {
    label: 'Search',
    Icon: SearchIcon,
    href: null,
  },
  // {
  //   label: 'Selected Tiles',
  //   Icon: ,
  //   action: 'modal',
  //   href: null,
  // },
];

// export type NavItem = typeof navList[0];
export type NavItem = Omit<typeof navList[0], 'action'> & {
  action: string | Function;
};
