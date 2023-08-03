import React, { useEffect, useState } from "react";
import { View, Text, Alert, TouchableOpacity, Image, Modal, Pressable, BackHandler } from "react-native";
import { StyleSheet } from "react-native";
import { Camera, CameraType, CameraPictureOptions } from 'expo-camera';
import StyledButton from "../../components/StyledButton";
import { AntDesign } from "@expo/vector-icons";
import { BASE_API_URL, API_URL_PILLNAME, API_URL_OCR } from '@env'
import { useIsFocused } from "@react-navigation/native";
import { LogBox } from "react-native";
LogBox.ignoreAllLogs();

const CameraScreen = ({route, navigation}) => {
    const isFocused = useIsFocused()
    const [loading, setLoading] = useState(true)
    
    const { user_id, model } = route.params;

    const [camera, setCamera] = useState(null)

    const [permission, requestPermission] = Camera.useCameraPermissions();
    
    const [modalVisible, setModalVisible] = useState(true);

    useEffect(()=>{
        if(isFocused)
            setLoading(false)
    }, [])

      
    useEffect(() => {
        (async () => {
          const { status } = await Camera.requestCameraPermissionsAsync();
          requestPermission(status === 'granted');
        })();
    }, []);

    // 상단 헤더 및 하단 메뉴바 숨기기
    useEffect(()=>{
        if(isFocused) {
            navigation.getParent().setOptions({tabBarStyle: {display:'none'}});
            navigation.getParent().getParent().setOptions({headerShown:false})
        }
        else{
            navigation.getParent().setOptions({tabBarStyle: {display:'flex'}});
            navigation.getParent().getParent().setOptions({headerShown:true})
        }
    }, [])

    useEffect(()=>{
        if(loading) {
            const backAction = () => {
                return true;
            };
            const backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                backAction,
            );
            
            return () => backHandler.remove();
        }
    }, [loading])

    useEffect(()=>{
        if(isFocused&&!loading) {
            navigation.getParent().setOptions({tabBarStyle: {display:'none'}});
            navigation.getParent().getParent().setOptions({headerShown:false})
        }
        else{
            navigation.getParent().setOptions({tabBarStyle: {display:'flex'}});
            navigation.getParent().getParent().setOptions({headerShown:true})
        }
    }, [isFocused, loading])

    

    useEffect(()=>{
        if (isFocused) {
            const backAction = () => {
                Alert.alert('취소', '촬영을 취소하시겠습니까?', [
                    {
                    text: '아니오',
                    onPress: () => null,
                    style: 'cancel',
                    },
                    {text: '네', onPress: () => navigation.navigate('MainScreen')},
                ], {cancelable: true});
                return true;
            };
            
            const backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                backAction,
            );
            
            return () => backHandler.remove();
        }
    }, [isFocused])
    // 다른 화면으로 벗어나지 못하게 처리 > 다른 bottom tab 누르면 Alert로 촬영 취소 물어보기

    const takePicture = async() => {
        console.log('takePicture function started');  // 로그 추가
    
        if(camera) {
            const data = await camera.takePictureAsync();          
    
            // API URL 값 설정하기
            let apiUrl = '';
            if (model === 'pill') {
                apiUrl = BASE_API_URL + API_URL_PILLNAME;
            } else if (model === 'ocr') {
                apiUrl = BASE_API_URL + API_URL_OCR;
            }
            
            navigation.navigate('PhotoPreview', {'image': data.uri, 'model': model, 'apiUrl': apiUrl, 'user_id':user_id, source:'camera'});
        } else {
        }
    }
    
    if(!permission) {
        return <View />;
    }

    if(!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={{textAlign:'center'}}>We need your permission to show the camera</Text>
                <StyledButton onPress={() => {requestPermission}} title='grant permission' />
            </View>
        )
    }
    
    if(permission.granted) {
        if(loading)
            setLoading(false)
    }

    const openCamera = () => {
        return (
            <View style={styles.cameraContainer}>   
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {setModalVisible(false)}}
                >
                    <Pressable style={{flex:1, justifyContent:'center', alignItems:'center'}} onPress={()=>{setModalVisible(false)}}>
                        <View style={{backgroundColor:'white', alignItems:'center', opacity:80, shadowColor:'black', width:'80%',
                        shadowOffset:{width:0, height:2}, shadowOpacity: 0.2, shadowRadius:4, elevation:5, padding:20, borderRadius:10}}>
                            <View>
                                <Text style={{fontSize:22, marginBottom:10, fontWeight:'bold'}}>{'<'} 촬영 시 유의사항 {'>'}</Text>
                                <Text style={{fontSize:18}}>
                                    - 가이드 라인에 맞춰 사진을 찍어주세요. {'\n'}
                                    - {model==='pill'?'알약 표면의 문자가 잘 보이게 찍으면 더 정확한 결과를 얻을 수 있습니다.':`'처방전' 글자가 잘 보이게 찍어주세요`}
                                </Text>
                                <Text style={{marginTop:10}}>해당 내용은 화면 우측 하단의 ? 를 눌러 다시 확인하실 수 있습니다.</Text>
                            </View>
                            <TouchableOpacity onPress={()=>{setModalVisible(false)}} style={{marginTop:20}}>
                                <Text style={{fontSize:16, fontWeight:'bold'}}>확인</Text>
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </Modal>
                {isFocused&&(   
                <Camera style={styles.fixedRatio} type={CameraType.back} ref={(ref) => setCamera(ref)} ratio={'1:1'}>
                    {model==='pill'?
                    <View style={styles.guideContainer}>
                        <Text style={{backgroundColor:'black',color:'white',padding:6, borderRadius:6,opacity:0.7}}>
                            가이드 안에 알약이 들어오게 찍어주세요
                        </Text>
                        <Image source={require('../../assets/guide.png')} style={styles.guide} />
                    </View>:
                    <View style={styles.guideContainer}>
                        <Image source={require('../../assets/ocr_guide.png')} style={{opacity:0.5, height:80, width:200, position:'absolute', alignSelf:'center', top:'4%'}} />
                        <Text style={{backgroundColor:'black',color:'white',padding:6, borderRadius:6,opacity:0.7, position:'absolute', alignSelf:'center', top:'24%'}}>
                            가이드 라인 안쪽에 '처방전'이 들어오게 찍어주세요
                        </Text>
                    </View>}
                    <View style={{flex:3}} />
                </Camera>)}
                <TouchableOpacity style={styles.button} onPress={takePicture}>
                        </TouchableOpacity>
                <TouchableOpacity style={{backgroundColor:'white', position:'absolute', bottom:'3%', right:'3%', padding:10, borderRadius:100}} onPress={()=>{setModalVisible(true)}}>
                    <AntDesign name='question' size={28}/>
                </TouchableOpacity>
            </View>
        )
    }

    return openCamera();
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    cameraContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fixedRatio: {
        flex: 1,
        aspectRatio: 1,
        
    },
    camera: {
        widgh: '100%'
    },
    buttonContainer: {
        justifyContent: 'space-between',
        margin: 64,
        flexDirection: 'row',
    },
    button: {
        width: 80,
        height: 80,
        borderRadius: 100,
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 4,
        position:'absolute',
        bottom:'4%',
        alignItems: "center"
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    guideContainer: {
        flex: 10,
        alignItems: 'center',
        justifyContent: 'center'

    },
    guide: {
        height: 300,
        width: 300,
        opacity: 0.5
    }
});

export default CameraScreen;