// component
import SvgColor from "../../../components/svg-color";

// ----------------------------------------------------------------------

const icon = (name) => (
    <SvgColor
        src={`/assets/icons/navbar/${name}.svg`}
        sx={{ width: 1, height: 1 }}
    />
);

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard',
    icon: icon('ic_analytics'),
  },
  {
    title: 'videos',
    path: '/videos',
    icon: icon('ic_videos'),
  },
  {
    title: 'video list',
    path: '/video-list',
    icon: icon('ic_videos'),
  },
  {
    title: 'video upload',
    path: '/video-upload',
    icon: icon('ic_blog'),
  },
  {
    title: 'user',
    path: '/user',
    icon: icon('ic_user'),
  },
  {
    title: 'products',
    path: '/products',
    icon: icon('ic_cart'),
  },
  {
    title: 'blog',
    path: '/blog',
    icon: icon('ic_blog'),
  },
  {
    title: 'login',
    path: '/login',
    icon: icon('ic_lock'),
  },
];

export default navConfig;
