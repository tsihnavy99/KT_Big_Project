import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import QnANavigation from './QnANavigation';
import NewsNavigator from "./NewsNavigator";

import { LogBox } from "react-native";
LogBox.ignoreAllLogs();
const Tab = createMaterialTopTabNavigator();

function ContentTopNavigator({route, navigation}) {
    const userInfo = route.params.userInfo
    
    // admin이면 Q&A만 출력
    return (
        <Tab.Navigator screenOptions={{tabBarIndicatorStyle: {
                                            borderBottomColor: '#5471FF',
                                            borderBottomWidth: 2,                                            
                                        },
                                        tabBarAndroidRipple: {borderless:true},
                                        tabBarStyle: {backgroundColor:'#f5f7ff'},
                                        tabBarLabelStyle: {fontSize: 18},
                                        swipeEnabled:false}}
                                        >
            
            {userInfo.admin?null:<Tab.Screen name='뉴스' component={NewsNavigator} initialParams={route.params}/>}
            <Tab.Screen name='Q&A' component={QnANavigation} initialParams={{userInfo:userInfo}}/>
        </Tab.Navigator>
    )
}

export default ContentTopNavigator;