import React, { useState, useEffect } from "react";
import { View, Text, TouchableWithoutFeedback, Keyboard } from "react-native";
import StyledInput from "../../components/StyledInput";
import styles from "../../styles";
import StyledButton from "../../components/StyledButton";
import { ProgressBar } from "react-native-paper";

const PharmacyInput = ({route, navigation}) => {
    const {admin, name, gender, user_id, pw, phone, birthdate} = route.params.userInfo;
    const [pharmacy, setPharmacy] = useState('');
    const [disabled, setDisabled] = useState(true);

    useEffect(() => {
        if(pharmacy==='') {
            setDisabled(true)
            return
        }
        const regex = /^[0-9a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣]*$/;
        setDisabled(!regex.test(pharmacy))
    }, [pharmacy])

    return (
        <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
        <View style={styles.container}>
            <View style={styles.progressBarContainer}>
                <ProgressBar progress={0.7} theme={{colors:{primary:'#5471FF'}}}/>
            </View>
            <View style={styles.inputInfoContainer}>
                <Text style={styles.inputInfo}>본인이 운영중인 {'\n'}약국을 입력해주세요.</Text>
                <Text>숫자, 영어, 한글만 입력 가능합니다.</Text>
            </View>
            <View style={styles.inputContainer}>
                <StyledInput 
                        placeholder="약국 명을 입력해주세요" 
                        onChangeText={setPharmacy} 
                        value={pharmacy} 
                        autoFocus={true}
                        />
                <Text style={styles.regexText}>{pharmacy===''?'약국 입력은 필수입니다.':disabled ? '입력 불가능한 문자가 포함되었습니다.' : ''}</Text>
            </View>
            <View style={styles.dummyView} />
            <View style={styles.bottomBtn}>
                <StyledButton 
                    onPress={() => navigation.navigate('LicenseInput', { 
                        userInfo:{
                            'admin':admin, 
                            'name':name,
                            'gender':gender,
                            'user_id':user_id, 
                            'pw':pw, 
                            'phone':phone,
                            'birthdate':birthdate,
                            pharmacy}})} 
                    title='다음' 
                    disabled={disabled}/>
                <Text style={styles.link} onPress={()=>navigation.pop()}>이전화면</Text>
            </View>
        </View>
        </TouchableWithoutFeedback>
    )
}

export default PharmacyInput;