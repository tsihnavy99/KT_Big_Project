import React, { useState, useEffect, useRef } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import MainScreenNavigator from './MainScreenNavigator';
import ContentTopNavigator from './ContentTopNavigator';
import MenuScreenNavigator from "./MenuScreenNavigator";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { LogBox } from "react-native";
LogBox.ignoreAllLogs();

// 하단 메뉴 애니메이션
const TabArr = [
    {route: 'Home', label: 'Home', icon: 'home-outline', component:MainScreenNavigator},
    {route: 'Content', label: 'Content', icon: 'post-outline', component:ContentTopNavigator},
    {route: 'Menu', label: 'Menu', icon: 'menu', component:MenuScreenNavigator},
]

const animate1 = {0:{scale:0.5, translateY:10}, 0.7:{scale:1.2, translateY:-12}, 1:{scale:1.1, translateY:-10}}
const animate2 = {0:{scale:1.2, translateY:-10}, 1:{scale:1, translateY:0}}

const circle1 = {0:{scale:0}, 0.7:{scale:1.1}, 1:{scale:1.05}}
const circle2 = {0:{scale:1}, 1:{scale:0}}

const TabButton = (props) => {
    const {item, onPress, accessibilityState} = props;
    const focused = accessibilityState.selected;
    const viewRef = useRef(null);
    const circleRef = useRef(null)

    useEffect(() => {
        if(focused) {
            viewRef.current.animate(animate1)
            circleRef.current.animate(circle1)
        } else {
            viewRef.current.animate(animate2)
            circleRef.current.animate(circle2)
        }
    }, [focused])

    return (
        <TouchableOpacity onPress={onPress}
                        activeOpacity={1}
                        style={styles.container}>
            <Animatable.View ref={viewRef}
                            duration={500}
                            style={styles.btn}>
                <Animatable.View 
                        ref={circleRef}
                        duration={500}
                        style={{...StyleSheet.absoluteFillObject, backgroundColor:'#5471ff', borderRadius:25
                                    ,borderWidth: 6, borderColor: 'white',}}/>
                <MaterialCommunityIcons name={item.icon} color={focused?'white':'#e6ebff'} size={26}/>
                
            </Animatable.View>
        </TouchableOpacity>
    )
}

function BottomTabNavigation({route, navigation}) {
    // const userInfo = route.params.userInfo;
    const [userInfo, setUserInfo] = useState(null)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUser = async() => {
            const storageData = JSON.parse(await AsyncStorage.getItem('userInfo'))
            
            navigation.setOptions({headerRight: ()=>
                (!storageData.admin?
                    <View style={{height:40, justifyContent:'center'}}>
                      <TouchableOpacity style={{backgroundColor:'#e6ebff',
                                                borderColor:'#5471ff', 
                                                borderWidth:2,
                                                borderRadius:30, 
                                                paddingHorizontal:14, 
                                                paddingVertical:6}}
                                        onPress={()=>navigation.navigate('ChatNavigator')}
                                        >
                        <Text style={{color:'#5471ff'}}>상담하기</Text>
                      </TouchableOpacity>
                    </View>:null)
                  })
            setUserInfo(storageData)
            setLoading(false)
        };
        getUser();
    }, [])
    
    const Tab = createBottomTabNavigator();

    return (
        <View style={{flex:1}}>
        {loading?null:
            <Tab.Navigator initialRouteName="Home" screenOptions={{tabBarActiveTintColor:'#5471ff', tabBarShowLabel:false, headerShown:false, tabBarStyle:{height:56}}}>
                {TabArr.map((item, index) => {
                    return (
                        <Tab.Screen key={index} name={item.route} component={item.component}
                                    options={{
                                        unmountOnBlur: true,
                                        tabBarStyle:'flex',
                                        tabBarShowLabel: false,
                                        tabBarButton: (props) => <TabButton {...props} item={item} />
                                    }}
                                    initialParams={{userInfo}}
                            />
                    )
                })}
            </Tab.Navigator>
        }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn: {
        width: 64,
        height: 64,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default BottomTabNavigation;