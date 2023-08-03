import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MenuScreen from '../menu/MenuScreen';
import UserInfoScreen from '../menu/UserInfoScreen';
import MyPostScreen from '../menu/MyPostScreen';
import QnADetailScreen from '../content/QnADetailScreen'
import GuideScreen from '../menu/GuideScreen'
import { LogBox } from "react-native";
LogBox.ignoreAllLogs();
const Stack = createNativeStackNavigator();

const MenuScreenNavigator = ({route, navigation}) => {
  return (
      <Stack.Navigator screenOptions={{headerShown:false, animation:'fade_from_bottom'}}>
        <Stack.Screen name='MenuScreen' component={MenuScreen} initialParams={route.params}/>
        <Stack.Screen name='UserInfoScreen' component={UserInfoScreen} initialParams={route.params}/>
        <Stack.Screen name='MyPostScreen' component={MyPostScreen} initialParams={route.params} />
        <Stack.Screen name='QnADetailScreen' component={QnADetailScreen} />
        <Stack.Screen name='GuideScreen' component={GuideScreen}/>
      </Stack.Navigator>
  )
}

export default MenuScreenNavigator;