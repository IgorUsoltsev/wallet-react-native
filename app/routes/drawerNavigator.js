import { createDrawerNavigator } from 'react-navigation';

import CustomDrawer from './../components/CustomDrawer';

import HomeScreen from './../screens/main/homeScreen';

import WalletsScreen from '../screens/main/walletsScreen';
import RewardsScreen from '../screens/main/rewardsScreen';

import GetVerifiedScreen from './../screens/settings/getVerified/getVerifiedScreen';
import SettingsScreen from './../screens/settings/settingsScreen';
import About from './../screens/main/aboutScreen';
import LogoutScreen from './../screens/auth/logoutScreen';

const Stack = {
  Home: HomeScreen,
  Wallets: WalletsScreen,
  Rewards: RewardsScreen,
  GetVerified: GetVerifiedScreen,
  Settings: SettingsScreen,
  Logout: LogoutScreen,
};

const drawerNavigator = createDrawerNavigator(Stack, {
  drawerWidth: 270,
  drawerOpenRoute: 'DrawerOpen',
  drawerCloseRoute: 'DrawerClose',
  drawerToggleRoute: 'DrawerToggle',
  contentComponent: CustomDrawer,
});

export default drawerNavigator;
