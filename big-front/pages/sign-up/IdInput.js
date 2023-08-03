import React, { useEffect, useRef, useState } from "react";
import { View, Text, Alert, TouchableWithoutFeedback, Keyboard } from "react-native";
import StyledButton from "../../components/StyledButton";
import styles from '../../styles';
import { ProgressBar } from "react-native-paper";
import StyledInput from "../../components/StyledInput";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const IdInput = ({route, navigation}) => {
    const {admin, name, gender, birthdate, phone} = route.params.userInfo;
    const [disabled, setDisabled] = useState(true);
    const [user_id, setId] = useState('');
    const [idDisabled, setIdDisabled] = useState(true);
    const [idCondition, setIdCondition] = useState(true); // 유효성 검사
    const [isChk, setIsChk] = useState(false);  // 중복 확인 했는지

    const [pw, setPw] = useState('');
    const [pwChk, setPwChk] = useState('');
    const [pwDisabled, setPwDisabled] = useState(true);
    const [pwCondition, setPwCondition] = useState(false);

    const ref_input2 = useRef()
    const ref_input3 = useRef()

    useEffect(() => {
        setIsChk(false); // Id 재입력 시 중복확인도 다시
        setIdDisabled(true);
        if(user_id==='') {
            setIdCondition(false)
            return
        }
        // 영문 숫자 조합만
        const regex = /^[0-9a-zA-Z]*$/;
        setIdCondition(regex.test(user_id))
    }, [user_id])

    useEffect(() => {
        if(pw.length<8) {
            setPwCondition(false)
            setPwDisabled(true)
            return
        }
        const regex = /^[0-9a-zA-Z#?!@$%^&*-]*$/
        setPwCondition(regex.test(pw));
           
        if(pw!==pwChk) {
            setPwDisabled(true)
        } else {
            setPwDisabled(false)
        }
    }, [pw, pwChk])


    useEffect(() => {
        if (idCondition&&pwCondition&&isChk&&pw===pwChk) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [idCondition, pwCondition, isChk, pwDisabled])

    const checkId = async() => {
        // Id 중복 여부 확인
        /*
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({user_id})// 보낼 데이터
        }

        try {
            await fetch('django링크', requestOptions) //django 링크
                .then(response => {
                    response.json()
                        .then(data => { // 사용 가능한 Id면 사용 가능 알림창+버튼 disabled 해제, 불가능하면 이미 사용중 아이디 알림창
                            if (data==='사용 가능 id') {
                                Alert.alert('사용 가능한 ID입니다.');
                                setIsChk(true);
                            } else {
                                Alert.alert('이미 사용중인 ID입니다.');
                            }
                        });
                })
        } catch(error) {
            console.error(error);
        }*/
        setIsChk(true);
        Alert.alert('사용 가능한 ID입니다.');
        setDisabled(false);
    }

    return (
        <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
        <View style={styles.container}>
            <View style={styles.progressBarContainer}>
                <ProgressBar progress={0.4} theme={{colors:{primary:'#5471FF'}}}/>
            </View>
            <View style={styles.inputInfoContainer}>
                <Text style={styles.inputInfo}>계정정보를 입력해 주세요.</Text>
            </View>
            <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
                <View style={styles.inputContainer}> 
                    <Text style={styles.inputTitle}>아이디</Text>
                    <Text>영문, 숫자 조합만 가능, 최대 20자</Text>
                    <View style={styles.inputWithBtn}>
                        <StyledInput 
                                placeholder="ID를 입력해주세요" 
                                onChangeText={setId} 
                                value={user_id}
                                withBtn={true}
                                autoFocus={true}
                                onSubmitEditing={()=>ref_input2.current.focus()}
                                blurOnSubmit={false}
                                returnKeyType='next'/>
                        <StyledButton title={'중복 확인'} onPress={checkId} withInput={true} disabled={isChk||user_id===''&&idCondition} /> 
                    </View>
                    <Text style={styles.regexText}>{user_id===''?'Please input your ID':idCondition?isChk?'':'ID 중복 확인이 필요합니다.':'입력 불가능한 문자가 포함되어있습니다.'}</Text>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.inputTitle}>비밀번호</Text> 
                    <Text>최소 8자, 최대 20자</Text>
                    <Text>영문, 숫자, 특수문자 ( #?!@$%^&*- ) 조합 가능</Text>
                    <StyledInput
                            placeholder="비밀번호" 
                            onChangeText={setPw} 
                            value={pw}
                            secureTextEntry={true}
                            onSubmitEditing={()=>ref_input3.current.focus()}
                            blurOnSubmit={false}
                            ref={ref_input2}
                            returnKeyType='next'/>
                    <StyledInput 
                            placeholder="비밀번호 확인" 
                            onChangeText={setPwChk} 
                            value={pwChk}
                            secureTextEntry={true}
                            blurOnSubmit={false}
                            ref={ref_input3}
                            onSubmitEditing={()=>Keyboard.dismiss()}/>
                    <Text style={styles.regexText}>{pw.length<8?'비밀번호는 최소 8자 이상입니다.':pwCondition?pwDisabled?'비밀번호와 비밀번호 확인이 일치하지 않습니다.':'':'입력 불가능한 문자가 포함되어있습니다.'}</Text>
                </View>
            </KeyboardAwareScrollView>
            <View style={styles.dummyView} />
            <View style={styles.bottomBtn}>
                <StyledButton 
                    onPress={() => navigation.navigate(admin?'PharmacyInput':'DiseaseInput', {
                        userInfo:{
                            'admin':admin, 
                            'name':name,
                            'gender':gender,
                            'birthdate':birthdate,
                            'phone':phone,
                            user_id, pw}})} 
                    title='다음'
                    disabled={disabled}/>
                <Text style={styles.link} onPress={()=>navigation.pop()}>이전화면</Text>
            </View>
        </View>
        </TouchableWithoutFeedback>
    )
}

export default IdInput;