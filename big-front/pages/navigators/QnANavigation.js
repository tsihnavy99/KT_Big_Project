import {createNativeStackNavigator} from '@react-navigation/native-stack';
import QnAScreen from '../content/QnAScreen';
import QnADetailScreen from '../content/QnADetailScreen';
import QnAAddScreen from '../content/QnAAddScreen';
import { LogBox } from "react-native";
LogBox.ignoreAllLogs();
const Stack = createNativeStackNavigator();

const QnANavigation = ({route, navigation}) => {

  return (
      <Stack.Navigator initialRouteName='QnAScreen' screenOptions={{headerShown:false, animation:'fade_from_bottom'}}>
        <Stack.Screen name='QnAScreen' component={QnAScreen} initialParams={route.params}/>
        <Stack.Screen name='QnADetailScreen' component={QnADetailScreen} />
        <Stack.Screen name='QnAAddScreen' component={QnAAddScreen} />
      </Stack.Navigator>
  )
}

export default QnANavigation;