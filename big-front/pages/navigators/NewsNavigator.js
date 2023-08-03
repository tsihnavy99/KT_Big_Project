
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import NewsScreen from '../content/NewsScreen';
import NewsDetailScreen from '../content/NewsDetailScreen';
import { LogBox } from "react-native";
LogBox.ignoreAllLogs();
const Stack = createNativeStackNavigator();

const NewsNavigator = ({route, navigation}) => {

  return (
      <Stack.Navigator initialRouteName='NewsScreen' screenOptions={{headerShown:false, animation:'fade_from_bottom'}}>
        <Stack.Screen name='NewsScreen' component={NewsScreen} initialParams={route.params} />
        <Stack.Screen name='NewsDetailScreen' component={NewsDetailScreen} />
      </Stack.Navigator>
  )
}

export default NewsNavigator;