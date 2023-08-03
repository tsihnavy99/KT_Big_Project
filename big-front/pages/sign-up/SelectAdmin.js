import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import styles from "../../styles";
import { AntDesign } from "@expo/vector-icons";
import StyledButton from "../../components/StyledButton";
import { Modal } from "react-native-paper";
import termsAndConditions from './termsAndConditions';

const Checkbox = ({ isChecked, setChecked }) => {
    return (
        <TouchableOpacity
            style={{
                height: 24,
                width: 24,
                borderRadius: 4,
                borderWidth: 1,
                borderColor: '#5471FF',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isChecked ? '#5471FF' : '#fff',
            }}
            onPress={() => setChecked(!isChecked)}
        >
            <Text style={{ color: '#fff' }}>{isChecked ? "✓" : ""}</Text>
        </TouchableOpacity>
    );
};

const SelectAdmin = ({navigation}) => {
    const [admin, setAdmin] = useState(false);
    const [visibleModal, setVisibleModal] = useState(true); // 개인정보 어쩌구
    const [check1, setCheck1] = useState(false);
    const [check2, setCheck2] = useState(false);
    const [check3, setCheck3] = useState(false);
    
    const allChecked = check1 && check2 && check3;

    const setCheckAll = () => {
        if(!check1||!check2||!check3) {
            setCheck1(true)
            setCheck2(true)
            setCheck3(true)
        } else {
            setCheck1(false)
            setCheck2(false)
            setCheck3(false)
        }
    }

    return (
        <View style={styles.container}>
            <View style={{height:60}} />
            <View style={styles.inputInfoContainer}>
                <Text style={styles.inputInfo}>회원 구분을 선택해 주세요</Text>
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.inputTitle}>회원구분</Text>
                <TouchableOpacity style={admin?selectStyles.btn:selectStyles.btn2} onPress={() => setAdmin(false)}>
                    <Text style={admin?selectStyles.btnText:selectStyles.btnText2}>일반회원</Text>
                    <AntDesign name='check' size={30} color='white' />
                </TouchableOpacity>
                <TouchableOpacity style={admin?selectStyles.btn2:selectStyles.btn} onPress={() => setAdmin(true)}>
                    <Text style={admin?selectStyles.btnText2:selectStyles.btnText}>약사</Text>
                    <AntDesign name='check' size={30} color='white' />
                </TouchableOpacity>

            </View>
            <View style={styles.dummyView} />
            <View style={styles.bottomBtn}>
                <StyledButton 
                    onPress={() => navigation.navigate('NameInput', { 
                        userInfo:{
                            admin}})} 
                    title='다음' />
                <Text style={styles.link} onPress={() => navigation.pop()}>이전화면</Text>
            </View>
            <Modal visible={visibleModal} contentContainerStyle={{position:'absolute', width:'100%', height:'100%', alignItems:'center'}}>
                <View style={{position:'absolute', width:'90%', top:'10%', alignItems:'center', height:'80%', backgroundColor:'white', padding:20, borderRadius:10, elevation:4}}>
                    <Text style={{fontWeight:'bold', fontSize:20, marginBottom:8}}>서비스 이용약관</Text>
                    
                    <View style={{flex:1, marginVertical:6, flexDirection:'column', minHeight:'14%'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Checkbox isChecked={check1} setChecked={setCheck1} />
                            <Text style={{marginLeft: 10}}>1.(필수)</Text>
                        </View>
                        <ScrollView style={{flexGrow: 1, borderRadius:4, marginVertical:10, padding:4, backgroundColor:'#E6EBFF'}}>
                            <Text>{termsAndConditions.term1}</Text>
                        </ScrollView>
                    </View>
                    <View style={{flex:1, marginVertical:6, flexDirection:'column', minHeight:'14%'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Checkbox isChecked={check2} setChecked={setCheck2} />
                            <Text style={{marginLeft: 10}}>2.(필수)</Text>
                        </View>
                        <ScrollView style={{flexGrow: 1, borderRadius:4, marginVertical:10, padding:4, backgroundColor:'#E6EBFF'}}>
                            <Text>{termsAndConditions.term2}</Text>
                        </ScrollView>
                    </View>
                    <View style={{flex:1, marginVertical:6, flexDirection:'column', minHeight:'14%'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Checkbox isChecked={check3} setChecked={setCheck3} />
                            <Text style={{marginLeft: 10}}>3.(필수)</Text>
                        </View>
                        <ScrollView style={{flexGrow: 1, borderRadius:4, marginVertical:10, padding:4, backgroundColor:'#E6EBFF'}}>
                            <Text>{termsAndConditions.term3}</Text>
                        </ScrollView>
                    </View>
                    
                    <View style={{flex:1, flexDirection:'column', width:'100%'}}>
                        <View style={{flexDirection:'row', alignItems: 'center'}}>
                            <Checkbox isChecked={check1&&check2&&check3} setChecked={setCheckAll}/>
                            <Text style={{marginLeft: 10}}>전체 동의</Text>
                        </View>
                    </View>
                    
                    <View>
                        <StyledButton 
                            title={'확인'} 
                            disabled={!allChecked}
                            withBtn={true}
                            onPress={()=>setVisibleModal(false)}
                        />
                    </View>
                </View>
            </Modal>
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

export default SelectAdmin;
