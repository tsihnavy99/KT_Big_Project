import { useEffect, useState } from "react";
import { View, Text, Alert, Pressable, Image, Modal, TouchableOpacity } from "react-native"
import styles from "../../styles";
import { useIsFocused } from "@react-navigation/native";
import StyledButton from "../../components/StyledButton";
import StyledInput from '../../components/StyledInput';
import { BASE_API_URL, DB_QNA_ANSWER_UPDATE, DB_QNA_DELETE } from '@env'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { LogBox } from "react-native";
LogBox.ignoreAllLogs();

const QnADetailScreen = ({route, navigation}) => {
    // 약사 계정에서는 답변 작성 가능
    // 작성자가 본인일 경우 삭제 가능 기능 추가(답변 달린 뒤에는 수정 불가능하게)
    const QnAData = route.params.qna
    const userInfo = route.params.userInfo
    
    const isFocused = useIsFocused();
    const [answer, setAnswer] = useState('');
    const [isAnswered, setIsAnswered] = useState(QnAData.answer===''?false:true)

    const [modalVisible, setModalVisible] = useState(false)

    useEffect(() => {
        if (!isFocused) {
            navigation.pop()
        }
      }, [isFocused]);

    const addAnswer = () => {
        const fetchAnswer = async() => {
            const requestOptions = {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({user_info:QnAData.user_info ,no:QnAData.no, answer:answer, answer_info:userInfo.user_id})// 보낼 데이터
            }
            
            try {
                await fetch(DB_QNA_ANSWER_UPDATE+QnAData.no+'/', requestOptions)
                    .then(response => {
                        response.json()
                            .then(data => {
                                console.log(data)
                                if(response.status===200){
                                    Alert.alert('답변 등록 완료', '정상적으로 답변이 등록되었습니다.')
                                    QnAData.answer = answer
                                    setIsAnswered(true)
                                } else {
                                    Alert.alert('답변 등록 실패', '문제가 발생했습니다. 잠시후 다시 시도해주세요')
                                } 
                            });
                    })
            } catch(error) {
                console.error(error);
            }
        }

        Alert.alert('등록 확인', '답변을 등록하시겠습니까?', [
            {
                text: '취소'
            },
            {
                text: '확인',
                onPress: ()=>fetchAnswer()
            }
        ])
    }

    const deleteQna = async() => {
        const requestOptions = {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
        }
        try {
            await fetch(DB_QNA_DELETE+QnAData.no+'/', requestOptions)
                .then(response => {
                    if(response.status===204){
                        Alert.alert('삭제 완료', '정상적으로 삭제되었습니다.')
                        navigation.pop()
                    } else {
                        Alert.alert('삭제 실패', '문제가 발생했습니다. 잠시후 다시 시도해주세요')
                    } 
                })
        } catch(error) {
            console.error(error);
        }
    }

    return (
        <View style={styles.container}>
            <View style={{backgroundColor:'white', borderRadius:6, flex:1, padding:10}}>
                <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
                <View style={{marginBottom: 10}}>
                    <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                        <Text style={{fontWeight:'bold', fontSize: 16, marginBottom: 6}}>
                            작성자
                        </Text>
                        {userInfo.user_id==QnAData.user_info?
                            <TouchableOpacity style={{backgroundColor:'#5472ff', paddingVertical:4, paddingHorizontal:10, justifyContent:'center', borderRadius:6, marginBottom:6}}
                                            onPress={()=>{Alert.alert('삭제 확인', '정말 삭제하시겠습니까?', [
                                                {
                                                    text: '취소',
                                                    style: 'cancel'
                                                },
                                                {
                                                    text: '삭제',
                                                    onPress: () => deleteQna()                                                    
                                                },
                                            ], {cancelable: true})}}>
                                <Text style={{color:'white'}}>삭제</Text>
                            </TouchableOpacity>
                            :null}
                        </View>
                        <Text style={{padding: 10, backgroundColor: '#f5f7ff', borderRadius: 6, fontSize: 16}}>
                            {QnAData.user_info}
                        </Text>
                    </View>
                    <View style={{marginVertical: 10}}>
                        <Text style={{fontWeight:'bold', fontSize: 16, marginBottom: 6}}>등록 사진</Text>
                        <View style={{backgroundColor:'#f5f7ff', padding:10, borderRadius:6}}>
                            {QnAData.user_img?
                                <TouchableOpacity onPress={()=>setModalVisible(true)}>
                                    <Image source={{uri:BASE_API_URL+QnAData.user_img}} style={{width:80, height:80, resizeMode:'contain'}}/>
                                </TouchableOpacity>
                            :<Text style={{backgroundColor: '#f5f7ff', borderRadius: 6, fontSize: 16}}>(등록된 사진이 없습니다.)</Text>}
                        </View>
                        <Modal animationType='fade'
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={()=>{setModalVisible(false)}}>
                        <Pressable style={{flex:1, justifyContent:'center', alignItems:'center'}} onPress={()=>{setModalVisible(false)}}>
                            <View style={{backgroundColor:'white', opacity:0.4, position:'absolute', width:'100%', height:'100%'}}/>
                            <View style={{backgroundColor:'white', alignItems:'center', 
                                        opacity:0.9, shadowColor:'black', shadowOffset:{width:0, height:2},
                                        shadowOpacity: 0.2, shadowRadius:4, elevation:5, borderRadius:6,
                                        width:'80%', height:'80%', padding:10}}>
                                <Image source={{uri:BASE_API_URL+QnAData.user_img}} style={{width:'100%', height:'100%', resizeMode:'contain'}}/>
                            </View>
                        </Pressable>
                    </Modal>
                    </View>
                    <View style={{marginVertical: 10}}>
                        <Text style={{fontSize: 16, marginBottom: 6, fontWeight: 'bold'}}>질문 내용</Text>
                        <Text style={{padding: 10, backgroundColor: '#f5f7ff', borderRadius: 6, fontSize: 16}}>{QnAData.질문?QnAData.질문:QnAData.question}</Text>
                    </View>
                    <View style={{marginVertical: 10}}>
                        <Text style={{fontSize: 16, marginBottom: 6, fontWeight: 'bold'}}>답변 내용</Text>
                        <Text style={{padding: 10, backgroundColor: '#f5f7ff', borderRadius: 6, fontSize: 16}}>
                            {QnAData.answer===''?'(아직 등록된 답변이 없습니다.)':QnAData.answer}
                        </Text>
                    </View>
                    {userInfo.admin&&!isAnswered?<StyledInput placeholder={'답변'} value={answer} onChangeText={setAnswer} multiline={true}/>:null}

                    </KeyboardAwareScrollView>
                </View>
                {userInfo.admin&&!isAnswered?
                    <View>
                        <StyledButton title='답변 입력' onPress={addAnswer} disabled={answer===''}/>
                    </View>:null}
            </View>
    )
}

export default QnADetailScreen;