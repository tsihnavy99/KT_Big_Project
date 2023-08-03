import React, { useState, useEffect } from "react";
import { View, Text, TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import StyledInput from "../../components/StyledInput";
import styles from "../../styles";
import StyledButton from "../../components/StyledButton";
import { ProgressBar, TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL_JOIN } from '@env'
import { MaskedTextInput } from "react-native-mask-text";

const LicenseInput = ({route, navigation}) => {
    const {admin, name, gender, user_id, pw, phone, birthdate, pharmacy} = route.params.userInfo;
    const [chkLicense, setChkLicense] = useState(false); // 유효한 약사 면허 번호 값인지 확인했는지?(현재는 불가), false면 다음 단계 못 넘어가게
    const [disabled, setDisabled] = useState(true);

    const [license, setLicense] = useState(''); // 임시

    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    useEffect(()=>{
        if(success&&!loading) {
            navigation.navigate('BottomTabNavigation');
        }
    }, [success, loading])

    useEffect(()=>{
        if(license.length<5) {
            setDisabled(true)
        } else {
            setDisabled(false)
        }
    }, [license])

    const signIn = async () => {
        setLoading(true)
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({admin, name, gender, user_id, pw, phone, birthdate, pharmacy, license})// 보낼 데이터
        }

        try {
            await fetch(API_URL_JOIN, requestOptions) //django 링크
                .then(response => {
                    response.json()
                        .then(data => {
                            console.log('성공! ', data);
                            Alert.alert('회원가입 성공', '회원가입이 완료되었습니다.')
                            loginSession()

                            setLoading(false)
                            setSuccess(true)    
                        });
                })
        } catch(error) {
            console.error('실패! ', error);
        }
    };

    const loginSession = async() => {
        await AsyncStorage.setItem('userInfo', JSON.stringify(route.params.userInfo))
    }

    return (
        <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
        <View style={styles.container}>
            <View style={styles.progressBarContainer}>
                <ProgressBar progress={1} theme={{colors:{primary:'#5471FF'}}}/>
            </View>
            <View style={styles.inputInfoContainer}>
                <Text style={styles.inputInfo}>약사 면허 번호를 등록해주세요.</Text>
                <Text>면허 번호가 4자리인 경우 앞에 0을 추가해 {'\n'}5자리로 입력해주세요.</Text>
            </View>
            <View style={styles.inputContainer}>
            
                <StyledInput 
                        placeholder="약사 면허 번호를 입력해주세요" 
                        onChangeText={setLicense} 
                        value={license} 
                        autoFocus={true}
                        inputMode='numeric'
                        render={(props) => <MaskedTextInput {...props} mask='99999'/>}
                        />
                <Text style={styles.regexText}>{disabled ? '약사 면허 등록은 필수입니다' : ''}</Text>
            </View>
            <View style={styles.dummyView} />
            <View style={styles.bottomBtn}>
                <StyledButton 
                    onPress={() => signIn()} 
                    title='완료' 
                    disabled={disabled}/>
                <Text style={styles.link} onPress={()=>navigation.pop()}>이전화면</Text>
            </View>
        </View>
        </TouchableWithoutFeedback>
    )
}

export default LicenseInput;