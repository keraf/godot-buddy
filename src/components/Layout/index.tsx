import Navigation from '../Navigation';
import classes from './styles.module.css';

const Layout = ({ children }: { children: React.ReactElement }) => (
  <div className={classes.shell}>
    <Navigation />
    <div className={classes.content}>{children}</div>
  </div>
);

export default Layout;
