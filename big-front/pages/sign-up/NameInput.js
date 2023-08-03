import React, { useEffect, useState, useRef } from "react";
import { View, TouchableWithoutFeedback, Keyboard, Alert, Text } from "react-native";
import StyledButton from "../../components/StyledButton";
import styles from '../../styles';
import { MaskedTextInput } from "react-native-mask-text";
import { ProgressBar } from "react-native-paper";
import StyledInput from "../../components/StyledInput";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CryptoJS from "crypto-js";
import { SMS_API_SECRET_KEY, SMS_SEND_NUMBER } from '@env'

const NameInput = ({route, navigation}) => {
    const {admin} = route.params.userInfo;

    const [disabled, setDisabled] = useState(true); // 다음 버튼 활성화

    const [name, setName] = useState('');
    const [condition, setCondition] = useState(true); // 이름 유효성 검사
    
    const [gender, setGender] = useState();

    const [birthdate, setBirth] = useState('');

    const [phone, setPhone] = useState('');
    
    const [inputData, setInputData] = useState(''); // 주민등록번호 입력 데이터

    //자동으로 다음 input으로 이동
    const ref_input2 = useRef(null)
    const ref_input3 = useRef(null)


    useEffect(() => {
        if(name==='') {
            setCondition(false)
            return
        }
        const regex = /^[a-zA-Z가-힣]*$/;
        setCondition(regex.test(name))
    }, [name])

    useEffect(() => {
        if (condition&&isPhoneChk&&inputData!=='') {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [condition, inputData, isPhoneChk, name])

    const onChange = (text) => {
        if(text.includes('-')) {
            const data = text.split('-')
            
            let birth;
            if(data[1]>=3) {
                birth = '20' + data[0].replace(/(.{2})/g,"$1-").slice(0, -1)
            } else {
                birth = '19' + data[0].replace(/(.{2})/g,"$1-").slice(0, -1)
            }
            setBirth(birth)
            // console.log(birth)
            setGender(data[1]%2===0?'F':'M')
        } else {
            setBirth(text)
        }
        setInputData(text)
    }
    
    // 문자 전송을 위한 secretKey 암호화
    const makeSignature = (timestamp) => {
        const space = " ";				// one space
        const newLine = "\n";				// new line
        const method = "POST";				// method
        const url = "/sms/v2/services/ncp:sms:kr:310296479349:big_project/messages";	// url (include query string)
        
        const accessKey = "Q6gUt3IpK2cUb1c3uBNB";			// access key id (from portal or Sub Account)
        const secretKey = SMS_API_SECRET_KEY;			// secret key (from portal or Sub Account)

        let hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
        hmac.update(method);
        hmac.update(space);
        hmac.update(url);
        hmac.update(newLine);
        hmac.update(timestamp);
        hmac.update(newLine);
        hmac.update(accessKey);

        var hash = hmac.finalize();

        return hash.toString(CryptoJS.enc.Base64);
    }

    // 문자 인증 관련
    const [randNum, setRandNum] = useState('') // 문자로 보낸 랜덤 번호
    const [phoneChk, setPhoneChk] = useState('') // 사용자가 입력하는 인증번호
    const [showPhoneChk, setShowPhoneChk] = useState(false); // 인증번호 입력 input 보여줄지(문자 보낸 뒤에 보여줌)
    const [isPhoneChk, setIsPhoneChk] = useState(false); // 문자 인증 완료 여부
    const [phoneDisabled, setPhoneDisabled] = useState(false); // 문자 인증 완료하면 전화번호 못바꾸게
    const [phoneChkBtn, setPhoneChkBtn] = useState(false) // 전화번호를 모두 입력해야 인증 버튼 누를 수 있게

    useEffect(()=>{
        if(phone.length>12) { // 전화번호 13자리 모두 입력되야 인증 번호 활성화
            setPhoneChkBtn(true)
        } else {
            setPhoneChk('')
            setPhoneChkBtn(false)
            setShowPhoneChk(false)
            setRandNum('')
        }
    }, [phone])

    // 랜덤 값 생성
    const makeRandom = () => {
        let result = ''
        for(let i=0; i<6; i++) {
            result += Math.floor(Math.random()*10).toString()
        }
        setRandNum(result)
        return result
    }

    const [count, setCount] = useState(180); // 인증 시간 제한 3분

    // 다른 input값 입력중이면 타이머 멈춰버림...
    const Timer = () => {
        useEffect(()=>{
            const id = setInterval(()=>{
                setCount((current)=>(current-1))
            }, 1000);

            if(count===0) {
                clearInterval(id)
                setPhoneChk('')
                setShowPhoneChk(false)
                setRandNum('')
                Alert.alert('인증 시간 만료', '전화번호 인증 시간이 만료되었습니다. 다시 시도해주세요.')
            }

            return () => clearInterval(id)
        }, [count]);

        let min = parseInt(count/60, 10)
        let sec = parseInt(count%50, 10)

        min = (min<10)?'0'+min:min
        sec = (sec<10)?'0'+sec:sec

        return <View><Text style={{color:'#f25555', fontSize: 14, marginLeft:6}}>{min}:{sec}</Text></View>
    }

    // 문자 전송
    const sendSms = async() => {
        const randNum = makeRandom()
        setShowPhoneChk(true)
        setCount(180)
        const timestamp = new Date().getTime().toString()
        const signature = makeSignature(timestamp)
        // 여기에 랜덤 값 만들어서 보내기
        const body = {
            "type": "SMS",
            "contentType": "COMM",
            "countryCode": "82",
            "from": SMS_SEND_NUMBER,
            "content": "내용",
            "messages": [
              {
                "to": phone.replace('-', '').replace('-', ''),
                "content": `회원가입 인증번호 [ ${randNum} ]를 입력해주세요.` 
              }
            ]
          }
          
          let apiUrl = 'https://sens.apigw.ntruss.com/sms/v2/services/ncp:sms:kr:310296479349:big_project/messages'
          let options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
              'x-ncp-apigw-timestamp': timestamp,
              'x-ncp-iam-access-key': 'Q6gUt3IpK2cUb1c3uBNB',
              'x-ncp-apigw-signature-v2': signature
            },
            body: JSON.stringify(body)
          }
        
        /*
        try {
            await fetch(apiUrl, options)
                .then(response => {
                    response.json()
                        .then(data => {
                            if(data.statusCode==='202') {
                                Alert.alert('문자 발송 확인', '3분 안에 문자로 발송된 인증번호를 입력해주세요.')
                            } else {
                                Alert.alert('Error', '문제가 발생했습니다. 입력한 번호를 확인하고 다시 시도해주세요.')
                            }
                        })
                })
        } catch(error) {
            Alert.alert('Error', '문제가 발생했습니다. 입력한 번호를 확인하고 다시 시도해주세요.')
            console.error(error);
        }  */
        checkPhone(randNum)
    }

    // 입력한 문자 인증 번호와 같은지 확인
    const checkPhone = (num) => {
        if(randNum===num) {//phoneChk) {
            setIsPhoneChk(true)
            // Alert.alert('인증 성공', '인증이 완료되었습니다.')
            Alert.alert('문자인증은 API SecretKey가 필요해 진행되지 않습니다.')
            if (condition&&inputData!=='') {
                setDisabled(false);
            } else {
                setDisabled(true);
            }
            setShowPhoneChk(false)
            setPhoneDisabled(true)
        } else {
            setIsPhoneChk(false)
            Alert.alert('인증 실패', '인증번호를 다시 확인해주세요.')
            setDisabled(true);
        }
    }

    return (
        <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
        <View style={styles.container}>
            <View style={styles.progressBarContainer}>
                <ProgressBar progress={0.2} theme={{colors:{primary:'#5471FF'}}}/>
            </View>
            <View style={styles.inputInfoContainer}>
                <Text style={styles.inputInfo}>기본정보를 입력해 주세요.</Text>
            </View>
            <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
                <View style={styles.inputContainer}>
                    <Text style={styles.inputTitle}>이름</Text>
                    <StyledInput 
                        placeholder="이름을 입력해주세요" 
                        onChangeText={setName} 
                        value={name}
                        returnKeyType='next'
                        maxLength={20}
                        autoFocus={true}
                        onSubmitEditing={()=>ref_input2.current.focus()}
                        blurOnSubmit={false}
                        />
                    <Text style={styles.regexText}>{name===''?'Please input your name':condition?'':'한글, 영어만 입력해주세요.'}</Text>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.inputTitle}>주민등록번호</Text>
                    <StyledInput 
                        placeholder="YYMMDD - X******" 
                        onChangeText={onChange} 
                        value={inputData}
                        returnKeyType='next'
                        render={(props) => <MaskedTextInput {...props} mask='999999-9' inputMode='numeric'/>}
                        ref={ref_input2}
                        onSubmitEditing={()=>ref_input3.current.focus()}
                        blurOnSubmit={false}
                        />
                    <Text style={styles.regexText}>{inputData===''?'Please input':''}</Text>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.inputTitle}>전화번호</Text>
                    <View style={styles.inputWithBtn}>
                        <StyledInput 
                            placeholder="숫자만 입력해주세요" 
                            onChangeText={setPhone} 
                            value={phone}
                            render={(props) => <MaskedTextInput {...props} mask='999-9999-9999'/>}
                            inputMode='numeric'
                            withBtn={true}
                            disabled={phoneDisabled}
                            ref={ref_input3}
                            />
                        <StyledButton title={'인증'} onPress={sendSms} withInput={true} disabled={!phoneChkBtn||phoneDisabled}/>
                    </View>
                    <Text style={styles.regexText}>{phone===''?'Please input your phone':''}</Text>
                    {showPhoneChk?
                    <View>
                        <View style={styles.inputWithBtn}>
                            <StyledInput
                                mode="outlined"
                                placeholder="인증번호를 입력해주세요."
                                onChangeText={setPhoneChk} 
                                value={phoneChk}
                                render={(props) => <MaskedTextInput {...props} mask='9999999'/>}
                                activeOutlineColor="#5471FF"
                                inputMode="numeric"
                                withBtn={true}
                                autoFocus={true}
                                />
                            <StyledButton title={'확인'} onPress={checkPhone} withInput={true}/>
                        </View>
                        <Timer/>
                    </View>:null}
                </View>
            </KeyboardAwareScrollView>
            <View style={styles.dummyView} />
            <View style={styles.bottomBtn}>
                <StyledButton 
                    onPress={() => navigation.navigate('IdInput', {
                        userInfo:{
                            admin, 
                            name, 
                            gender, 
                            birthdate, 
                            phone
                        }})} 
                    title='다음'
                    disabled={disabled}/>
                <Text style={styles.link} onPress={()=>navigation.pop()}>이전화면</Text>
            </View>
        </View>
        </TouchableWithoutFeedback>
    )
}

export default NameInput;