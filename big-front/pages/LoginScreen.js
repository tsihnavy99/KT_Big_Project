import React, { useEffect, useRef, useState } from "react";
import { View, Text, Alert, Image, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from "react-native";
import styles from "../styles";
import StyledInput from "../components/StyledInput";
import StyledButton from "../components/StyledButton";
import CryptoJS from 'crypto-js';

import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused } from "@react-navigation/native";
import { TextInput } from "react-native-paper";
import Loading from "../components/Loading";
import { API_URL_LOGIN } from '@env';

import { LogBox } from "react-native";
LogBox.ignoreAllLogs();

const LoginScreen = ({navigation}) => {
    const isFocused = useIsFocused();
    const ref_input2 = useRef(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (isFocused) {
            setId('');
            setPw('');
        }
      }, [isFocused]);

    const loginSession = async(data) => {
        await AsyncStorage.setItem('userInfo', JSON.stringify(data))
        setLoading(false)
    }  

    const [admin, setAdmin] = useState(false);
    const [user_id, setId] = useState('');
    const [pw, setPw] = useState('');
    const [userInfo, setUserInfo] = useState();

    const login = async () => {
        if(user_id===''||pw==='') {
            Alert.alert('입력 오류', 'ID, PW를 모두 입력해주세요')
            setLoading(false)
            return
        }
        
        const sha256Password = CryptoJS.SHA256(pw).toString();

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username:user_id, password:pw})// 보낼 데이터 sha256Password로 바꾸자
        }
        console.log(requestOptions)
        try {
            await fetch(API_URL_LOGIN, requestOptions) 
                    .then(response => {
                    response.json()
                        .then(data => {
                            console.log('받은 데이터', data)
                            if(data.message==='로그인되었습니다.'){
                                //admin여부 받아오기
                                setAdmin(data.admin)
                                loginSession(data.data)
                                if(!loading) {
                                    navigation.navigate('BottomTabNavigation', {
                                        userInfo:{
                                            user_id, admin
                                        }});
                                }
                            } else {
                                Alert.alert('로그인 실패', 'ID와 PW를 다시 확인해주세요.')
                                setLoading(false)
                            } 
                        });
                })
        } catch(error) {
            Alert.alert('로그인 실패', '문제가 발생했습니다. 잠시 후 다시 시도해주세요.')
            setLoading(false)
            console.error(error);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
        <View style={styles.container} >
            <View style={styles.logoContainer}>
                <View style={styles.dummyView} />
                <Image source={require('../assets/logo_with_text.png')} style={{resizeMode:'contain', width:'70%', height:'70%'}}/>
            </View>
            <View style={styles.inputContainer}>
                <StyledInput placeholder="ID를 입력해주세요"
                            left={<TextInput.Icon icon='account'/>}
                            value={user_id}
                            onChangeText={setId}
                            right={user_id===''?null:<TextInput.Icon icon='window-close' onPress={()=>setId('')}/>}
                            autoFocus={true}
                            onSubmitEditing={()=>ref_input2.current.focus()}
                            returnKeyType='next'
                            blurOnSubmit={false}
                             />          
                <StyledInput mode='outlined' 
                            placeholder="비밀번호를 입력해주세요"
                            left={<TextInput.Icon icon='form-textbox-password'/>} 
                            activeOutlineColor="#5471ff"
                            value={pw}
                            onChangeText={setPw}
                            right={pw===''?null:<TextInput.Icon icon='window-close' onPress={()=>setPw('')}/>}
                            secureTextEntry={true}
                            ref={ref_input2}
                            onSubmitEditing={()=>{setLoading(true);login()}}/>       
            </View>
            <View style={styles.dummyView}/>
            <View>
                <StyledButton
                    title="로그인"
                    onPress={() => {setLoading(true);login();/*navigation.navigate('BottomTabNavigation', {userInfo})*/}}/>
                <View style={styles.linkBox}> 
                    <TouchableOpacity onPress={()=>Alert.alert('ID, PW 안내', `
ID : test
PW : new1234!
위 계정으로 진행해주시기 바랍니다.`)}>
                        <Text style={styles.link}>ID/비밀번호 찾기</Text>
                    </TouchableOpacity>
                    <Text style={{alignSelf: 'center', fontSize:20, marginHorizontal:12}}> | </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('SelectAdmin')}>
                        <Text style={styles.link}>회원가입</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Loading show={loading}/>
        </View>
        </TouchableWithoutFeedback>
    )
}

export default LoginScreen;