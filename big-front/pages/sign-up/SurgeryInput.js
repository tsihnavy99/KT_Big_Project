import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import styles from "../../styles";
import StyledButton from "../../components/StyledButton";
import { AntDesign } from "@expo/vector-icons";
import { ProgressBar } from "react-native-paper";

const SurgeryInput = ({route, navigation}) => {
    const {admin, name, gender, user_id, pw, phone, birthdate, disease} = route.params.userInfo;
    const [has_surgery, setHasSurgery] = useState(false);

    return (
        <View style={styles.container}>
            <View style={{height:60}}>
                <ProgressBar progress={0.8} theme={{colors:{primary:'#5471FF'}}}/>
            </View>            
            <View style={styles.inputInfoContainer}>
                <Text style={styles.inputInfo}>수술 이력이 있으신가요?</Text>
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.inputTitle}>수술여부</Text>

                <TouchableOpacity style={has_surgery?selectStyles.btn:selectStyles.btn2} onPress={() => setHasSurgery(false)}>
                    <Text style={has_surgery?selectStyles.btnText:selectStyles.btnText2}>없음</Text>
                    <AntDesign name='check' size={30} color='white' />
                </TouchableOpacity>
                <TouchableOpacity style={has_surgery?selectStyles.btn2:selectStyles.btn} onPress={() => setHasSurgery(true)}>
                    <Text style={has_surgery?selectStyles.btnText2:selectStyles.btnText}>있음</Text>
                    <AntDesign name='check' size={30} color='white' />
                </TouchableOpacity>
            </View>
            <View style={styles.dummyView} />
            <View style={styles.bottomBtn}>
                <StyledButton 
                    onPress={() => navigation.navigate('EtcInput', { 
                        userInfo:{
                            'admin':admin, 
                            'name':name,
                            'gender':gender,
                            'user_id':user_id, 
                            'pw':pw, 
                            'phone':phone,
                            'birthdate':birthdate,
                            'disease':disease,
                            has_surgery}})} 
                    title='다음' />
                <Text style={styles.link} onPress={()=>navigation.pop()}>이전화면</Text>
            </View>
        </View>
    )
}

const selectStyles = StyleSheet.create({
    btn: {
        borderWidth: 1,
        backgroundColor: 'white',
        borderRadius: 6,
        flexDirection: 'row',
        paddingVertical: 14,
        paddingHorizontal: 10,
        marginVertical: 10,
        justifyContent: 'space-between',
        borderColor: '#5471ff',
        alignItems:'center'
    },
    btn2: {
        borderWidth: 1,
        borderColor: '#5471ff',
        backgroundColor: '#5471ff',
        borderRadius: 6,
        flexDirection: 'row',
        paddingVertical: 14,
        paddingHorizontal: 10,
        marginVertical: 10,
        justifyContent: 'space-between',
        alignItems:'center'
    },
    btnText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#5D5F64',
        paddingHorizontal: 10
    },
    btnText2: {
        textAlign: 'center',
        fontSize: 16,
        color: 'white',
        paddingHorizontal: 10,
    },
});
export default SurgeryInput;