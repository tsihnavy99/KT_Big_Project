import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import styles from "../../styles";
import StyledButton from "../../components/StyledButton";
import { AntDesign } from "@expo/vector-icons";
import { ProgressBar } from "react-native-paper";

const DiseaseInput = ({route, navigation}) => {
    const {admin, name, gender, user_id, pw, phone, birthdate} = route.params.userInfo;
    const [disease, setDisease] = useState([]);
    const [diseaseLen, setDiseaseLen] = useState(0);

    const [haveDisease, setHaveDisease] = useState(false);

    const selectDisease = (value) => {
        const idx = disease.indexOf(value)
        const newData = disease;
        
        if(idx===-1) {
            newData.push(value);
            setDisease(newData)
            setDiseaseLen(disease.length)
        } else {
            newData.splice(idx, 1);
            setDisease(newData)
            setDiseaseLen(disease.length)
        }
        printDisease();
    }

    useEffect(() => {
        printDisease();
    }, [diseaseLen])

    const printDisease = () => {
        let array = [];
        const list = ['당뇨병', '천식', '골다공증', '치주염', '고혈압', '저혈압', '심장병', '간경화', '뇌졸중', '고지혈증'];
        for(let d of list) {
            array.push(
                <TouchableOpacity key={d} style={disease.indexOf(d)===-1?selectStyles.notSelected:selectStyles.selected} onPress={() => selectDisease(d)}>
                    <Text key={d} style={disease.indexOf(d)===-1?selectStyles.notSelectedText:selectStyles.selectedText}>{d}</Text>
                </TouchableOpacity>
            )
        }
        
        return array;
    }

    return (
        <View style={styles.container}>
            <View style={{height:60}}>
                <ProgressBar progress={0.6} theme={{colors:{primary:'#5471FF'}}}/>
            </View>
            <View style={styles.inputInfoContainer}>
                <Text style={styles.inputInfo}>앓고 있는 병이 있으신가요?</Text>
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.inputTitle}>질병여부</Text>
                <TouchableOpacity style={haveDisease?selectStyles.btn:selectStyles.btn2} onPress={() => setHaveDisease(false)}>
                    <Text style={haveDisease?selectStyles.btnText:selectStyles.btnText2}>갖고 있는 병 없음</Text>
                    <AntDesign name='check' size={30} color='white' />
                </TouchableOpacity>
                <TouchableOpacity style={haveDisease?selectStyles.btn2:selectStyles.btn} onPress={() => setHaveDisease(true)}>
                    <Text style={haveDisease?selectStyles.btnText2:selectStyles.btnText}>갖고 있는 병 있음</Text>
                    <AntDesign name='check' size={30} color='white' />
                </TouchableOpacity>
                {haveDisease?(
                    <View>
                        <Text style={styles.inputTitle}>질병을 선택해 주세요</Text>
                        <View style={selectStyles.btnContainer}>
                            {(() => (printDisease()))()}
                        </View>
                    </View>
                ):null}
            </View>
            <View style={styles.dummyView} />
            <View style={styles.bottomBtn}>
                <StyledButton 
                    onPress={() => navigation.navigate('SurgeryInput', { 
                        userInfo:{
                            'admin':admin, 
                            'name':name,
                            'gender':gender,
                            'user_id':user_id, 
                            'pw':pw, 
                            'phone':phone,
                            'birthdate':birthdate,
                            disease}})} 
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
    btnContainer: {
        flexDirection:'row', 
        display:'flex', 
        flexWrap:'wrap'
    },
    notSelected: {
        borderWidth: 1,
        display: 'flex',
        flexWrap: 'wrap',
        borderRadius: 6,
        paddingHorizontal: 14,
        paddingVertical: 8,
        margin: 6,
        borderColor: '#5471ff',
        backgroundColor: 'white'
    },
    notSelectedText: {
        color: '#5D5F64',
    },
    selected: {
        borderWidth: 1,
        display: 'flex',
        flexWrap: 'wrap',
        borderRadius: 6,
        paddingHorizontal: 14,
        paddingVertical: 8,
        margin: 6,
        backgroundColor: '#5471ff',
        borderColor: '#5471ff'
    },
    selectedText: {
        color: 'white'
    }
});
export default DiseaseInput;