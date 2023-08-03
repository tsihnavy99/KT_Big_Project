import { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, Alert, Pressable, Modal, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from "react-native"
import styles from "../../styles";
import StyledButton from "../../components/StyledButton";
import { useIsFocused } from "@react-navigation/native";
import StyledInput from "../../components/StyledInput";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { DB_QNA_CREATE } from '@env';
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Loading from "../../components/Loading";
import { LogBox } from "react-native";
LogBox.ignoreAllLogs();


const QnAAddScreen = ({route, navigation}) => {
    const userInfo = route.params.userInfo
    
    // 이 화면에서 다른 탭으로 이동 시 자동으로 첫 화면으로 이동
    const isFocused = useIsFocused();

    const [question, setQuestion] = useState('')
    const [addImage, setAddImage] = useState('')
    const [loading, setLoading] = useState(false)

    const [modalVisible, setModalVisible] = useState(false)

    useEffect(() => {
        if (!isFocused) {
            navigation.pop();
            console.log('pop')
        }
    }, [isFocused]);

    useEffect(() => {
        console.log('사진 state > ', addImage!=='')
    }, [addImage])
    
    const addQnA = async() => {
        setLoading(true)
        try {
            const formData = new FormData();
            formData.append('user_info', userInfo.user_id);
            formData.append('question', question); // 질문 필드를 question으로 변경

            if(addImage!=='') {
                formData.append('user_img', {
                    uri: addImage,
                    name: 'photo.jpg',
                    type: 'image/jpeg',
                });
            }

            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            };

            await fetch(DB_QNA_CREATE, requestOptions)
                .then(response => {
                    response.json()
                    .then(data => {
                        console.log('결과', data);
                        if (response.status === 201) {
                            Alert.alert('질문등록 완료', '질문을 등록했습니다.');
                            navigation.pop()
                        } else {
                            Alert.alert('Error', '문제가 발생했습니다. 잠시후 다시 시도해주세요.');
                        }
                        setLoading(false);
                    });
                })
        } catch(error) {
            console.error(error);
        } finally {
            setLoading(false)
        }
    }

    const pickImage = async() => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [1, 1],
            quality: 1
        });
    
        if (!result.canceled) {
            // image 선택되었는지    
            setAddImage(result.assets[0].uri)
            console.log(result.assets[0].uri)
        }
    }

    return (
        <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
        <View style={styles.container}>
            <KeyboardAwareScrollView keyboardShouldPersistTaps="always" style={{backgroundColor:'white', padding:10, borderRadius:6}}>
            <View>
                <View>
                    <Text style={{fontWeight:'bold', fontSize: 16, marginBottom: 6}}>
                        질문자
                    </Text>
                    <Text style={{padding: 10, backgroundColor: '#f5f7ff', borderRadius: 6, fontSize: 16}}>
                        {userInfo.user_id}
                    </Text>
                </View>
                <View style={{marginVertical: 20}}>
                    <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                        <Text style={{fontWeight:'bold', fontSize: 16, marginBottom: 6}}>
                            질문 내용
                        </Text>
                        <StyledButton title='사진 추가' withInput={true} onPress={pickImage}/>
                    </View>
                    <ScrollView>
                        <StyledInput 
                                multiline={true}
                                placeholder="질문 내용을 입력해주세요"
                                value={question}
                                onChangeText={setQuestion}
                                numberOfLines={8}
                                maxLength={100}/>
                        <Text style={{textAlign:'right'}}>{`${question.length}/100`}</Text>
                    </ScrollView>
                </View>
                <View>
                    <View style={{borderWidth:2, borderColor:'#5471ff', padding:10, width:100, height:100, borderRadius:20, justifyContent:'center', alignItems:'center', borderStyle:'dashed', backgroundColor:'#f5f7ff'}}>
                    {addImage!==''?
                        <View style={{height:'100%', width:'100%'}}>
                            <TouchableOpacity onPress={()=>setAddImage('')} style={{position:'absolute', top:-20, right:-20}}>
                                <MaterialCommunityIcons name="close" size={34}/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>setModalVisible(true)}>
                                <Image source={{uri:addImage}} style={{height:'100%', width:'100%', resizeMode:'contain'}}/>
                            </TouchableOpacity>
                        </View>
                        :<TouchableOpacity onPress={pickImage}>
                            <MaterialCommunityIcons name="image-plus" size={40} color={'#5471ff'}/>
                        </TouchableOpacity>}
                    </View>
                </View>
            </View>
            </KeyboardAwareScrollView>
            <View>
                <StyledButton title={'질문하기'} onPress={()=>{addQnA()}} disabled={question===''}/>
            </View>
            <Pressable>
              <Modal
                animationType = "fade"
                transparent = {true}
                visible = {modalVisible}
                >
                <Pressable onPress = {()=>setModalVisible(false)} style = {{flex : 1, justifyContent : "center", alignItems : "center"}}>
                  <View style={{backgroundColor:'white', position:'absolute', width:'100%', height:'100%', opacity:0.3}}/>
                  <View style={{borderRadius:6, width:'80%', height:'80%', padding:16, borderColor:'black'}}>
                    {addImage!==''?
                      <Image source = {{uri : addImage}} style = {{ width : '100%', height : '100%', resizeMode:'contain'}}/>
                        :null
                    }
                  </View>
                </Pressable>
              </Modal>
            </Pressable>
            <Loading show={loading}/>
        </View>
        </TouchableWithoutFeedback>
    )
}

export default QnAAddScreen;