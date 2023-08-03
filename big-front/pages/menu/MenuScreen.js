import React from "react";
import { View, Text, Alert, TouchableOpacity, StyleSheet } from "react-native";
import styles from "../../styles";
import { Feather, Ionicons, FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { LogBox } from "react-native";
LogBox.ignoreAllLogs();

const MenuScreen = ({route, navigation}) => {
    const userInfo = route.params.userInfo;

    const logout = () => {
        const removeUser = async() => {
            await AsyncStorage.removeItem('userInfo')
        };
        removeUser();
        navigation.replace('FirstScreen');
    }

    const menuIconSize = 24
    
    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <View style={styles.dummyView}/>
                <View style={{borderRadius:100, borderWidth:1, height:130, width:130, alignItems:'center', justifyContent:'center'}}>
                    {userInfo==='admin'?<FontAwesome name="user-md" size={100}/>:<FontAwesome name='user' size={100}/>}
                </View>
                <View style={styles.dummyView}/>
            </View>
            <View style={styles.inputContainer}>
                <View style={{backgroundColor:'white', borderRadius:10, paddingVertical:20}}>
                    <TouchableOpacity style={menuStyles.menuContainer} onPress={() => {navigation.navigate('UserInfoScreen', route.params)}}>
                        <View style={menuStyles.iconContainer}>
                            <Feather name='user' size={menuIconSize} color='black' />
                        </View>
                        <Text style={menuStyles.menuText}>내 정보</Text>
                    </TouchableOpacity>
                    {userInfo.admin?null:
                    <TouchableOpacity style={menuStyles.menuContainer} onPress={() => {navigation.navigate('MyPostScreen', route.params)}}>
                        <View style={menuStyles.iconContainer}>
                            <Ionicons name='md-chatbubble-ellipses-outline' size={menuIconSize} color='black' />
                        </View>
                        <Text style={menuStyles.menuText}>내가 쓴 글 보기</Text>
                    </TouchableOpacity>}
                    <TouchableOpacity style={menuStyles.menuContainer} onPress={() => {navigation.navigate('GuideScreen')}}>
                        <View style={menuStyles.iconContainer}>
                            <FontAwesome name='question-circle-o' size={menuIconSize} color='black' />
                        </View>
                        <Text style={menuStyles.menuText}>사용 가이드</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={menuStyles.menuContainer} onPress={() => {
                            Alert.alert('로그아웃', '정말 로그아웃 하시겠습니까?', [
                                    {
                                        text: '취소',
                                    },
                                    {
                                        text: '확인',
                                        onPress: () => {logout()/* 로그인 세션 해제 */}
                                    }
                                ])
                            }}>
                        <View style={menuStyles.iconContainer}>
                            <Feather name='log-out' size={menuIconSize} color='black' />
                        </View>
                        <Text style={menuStyles.menuText}>로그아웃</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const menuStyles = StyleSheet.create({
    menuContainer: {
        flexDirection: 'row',
        marginVertical: 10,
        marginHorizontal: 20,
        borderBottomWidth: 1,
        paddingBottom: 10,
    },
    iconContainer: {
        width: 40,
        alignItems: 'center'
    },
    menuText: {
        fontSize: 16,
        marginHorizontal: 10
    }
})

export default MenuScreen;