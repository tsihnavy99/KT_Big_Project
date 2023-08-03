import { useState, useEffect } from 'react';
import { StatusBar, TouchableOpacity, Text, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FirstScreen from './pages/FirstScreen';

import SelectAdmin from './pages/sign-up/SelectAdmin';
import NameInput from './pages/sign-up/NameInput';
import IdInput from './pages/sign-up/IdInput';

import DiseaseInput from './pages/sign-up/DiseaseInput';
import SurgeryInput from './pages/sign-up/SurgeryInput';
import EtcInput from './pages/sign-up/EtcInput';

import PharmacyInput from './pages/sign-up/PharmacyInput';
import LicenseInput from './pages/sign-up/LicenseInput';

import LoginScreen from './pages/LoginScreen';

import BottomTabNavigation from './pages/navigators/BottomTabNavigation';

import ChatNavigator from './pages/navigators/ChatNavigator';

import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

export default function App() {
  
  const [userInfo, setUserInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  onload = () => {
    this.props.navigation.addListener()
  }
  useEffect(() => {
    const getUser = async() => {
      const storageData = JSON.parse(await AsyncStorage.getItem('userInfo'))
      
      if (storageData) {
        setUserInfo(storageData)
        console.log(userInfo)
      } 
      setLoading(false)
    };

    getUser();
  }, [])

  return (
    <NavigationContainer>
      <StatusBar barStyle={'dark-content'}/>
      {loading?null:
      <Stack.Navigator screenOptions={({route, navigation}) => (
                    { headerTitle:()=>(
                          <View style={{height:40, justifyContent:'center', flexDirection:'row', alignItems:'center'}}>
                            <Image source={require('./assets/logo.png')} style={{width:40, height:30, marginHorizontal: 6}}/>
                            <Text style={{fontSize:20, color:'#b5b7ba', fontWeight:'bold'}}>
                              약쏙
                            </Text>
                          </View>), 
                      headerShown:false, 
                      headerBackVisible:false,
                      headerShadowVisible:false,
                      animation:'fade', 
                      headerRight:()=>
                      (userInfo===null||!userInfo.admin?
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
                        })} 
                    initialRouteName={userInfo!==null?'BottomTabNavigation':'FirstScreen'}
                    >
        
        <Stack.Screen name='BottomTabNavigation' component={BottomTabNavigation} options={{animation:'slide_from_right', headerShown:true, headerStyle:{backgroundColor:'#F5F7FF'}}}/>

        <Stack.Screen name='FirstScreen' component={FirstScreen}/>
        
        <Stack.Screen name='SelectAdmin' component={SelectAdmin} />
        <Stack.Screen name='NameInput' component={NameInput} />
        <Stack.Screen name='IdInput' component={IdInput} />

        <Stack.Screen name='DiseaseInput' component={DiseaseInput} />
        <Stack.Screen name='SurgeryInput' component={SurgeryInput} />
        <Stack.Screen name='EtcInput' component={EtcInput} />

        <Stack.Screen name='PharmacyInput' component={PharmacyInput} />
        <Stack.Screen name='LicenseInput' component={LicenseInput} />

        <Stack.Screen name='LoginScreen' component={LoginScreen} />

        <Stack.Screen name='ChatNavigator' component={ChatNavigator} 
                      options={({route, navigation}) => ({
                            headerShown:true, 
                            headerStyle:{backgroundColor:'#F5F7FF'},
                            headerRight: ()=>(
                              <View style={{height:40, justifyContent:'center'}}>
                                <TouchableOpacity style={{backgroundColor:'#e6ebff',
                                                      borderColor:'#5471ff', 
                                                      borderWidth:2,
                                                      borderRadius:30, 
                                                      paddingHorizontal:14, 
                                                      paddingVertical:6,
                                                      alignItems:'center',
                                                      justifyContent:'center',
                                                      flexDirection:'row'}}
                                              onPress={()=>navigation.navigate('BottomTabNavigation', {
                                                      screen:'MainScreen',
                                                      params:{userInfo:userInfo}
                                                    })}
                                              >
                                  <Text style={{color:'#5471ff'}}>메인으로</Text>
                                </TouchableOpacity>
                              </View>
                            )
                          })} />

      </Stack.Navigator>}
    </NavigationContainer>
  )
}

