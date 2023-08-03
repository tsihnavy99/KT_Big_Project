import React, { useEffect, useState } from "react";
import { View, Image, Alert, Modal, Text, FlatList, TouchableOpacity } from 'react-native';
import StyledButton from "../../components/StyledButton";
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { useIsFocused } from "@react-navigation/native";
import { BackHandler } from "react-native";
import Loading from "../../components/Loading";
import {BASE_API_URL, API_URL_OCR, API_URL_PILLNAME} from '@env'
import { Asset } from 'expo-asset';

import { LogBox } from "react-native";
LogBox.ignoreAllLogs();

const PhotoPreview = ({route, navigation}) => {
    // const { image, model, apiUrl, source, pickImage, user_id } = route.params;
    const { model, apiUrl, source, pickImage, user_id } = route.params;
    const [image, setImage] = useState('');

    const [isLoading, setIsLoading] = useState(true);
    const isFocused = useIsFocused()
    
    useEffect(()=>{
      if(isFocused&&image!=='') {
        setIsLoading(false)
        console.log(image)
      }
    }, [image])
    /*
    useEffect(()=>{
      if(isFocused)
        setIsLoading(false)
    }, [])
    */

  useEffect(()=>{
      if(isLoading) {
          const backAction = () => {
              return true;
          };
          const backHandler = BackHandler.addEventListener(
              'hardwareBackPress',
              backAction,
          );
          
          return () => backHandler.remove();
      }
  }, [isLoading])

  useEffect(()=>{
      if(isFocused) {
          navigation.getParent().setOptions({tabBarStyle: {display:'none'}});
          navigation.getParent().getParent().setOptions({headerShown:false})
      }
      else{
          navigation.getParent().setOptions({tabBarStyle: {display:'flex'}});
          navigation.getParent().getParent().setOptions({headerShown:true})
      }
  }, [isFocused, isLoading])

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
      const backAction = () => {
          Alert.alert('취소', '메인으로 돌아가시겠습니까? 진행 내용은 저장되지 않습니다.', [
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
  }, [isFocused])

////////////////////////// aws 제출용
  const [localUri, setLocalUri] = useState(null)
  useEffect(()=>{
    if(localUri!==null) {
      uploadImage()
    }
  }, [localUri])

    const setUri = async() => {
      setLocalUri(await Asset.loadAsync(image.require));
      // setLocalUri(await Asset.loadAsync(image));
      // setLocalUri(image)
    }
//////////////////////////


    // 이미지 업로드 함수
    const uploadImage = async () => {
      setIsLoading(true);
      try {
        // const asset = Asset.fromURI(localUri[0].localUri);
        // const asset = Asset.fromModule(image.require);
        // await asset.downloadAsync();
        let imageDriveUrl = ''
        imgName = image.uri.split('/').pop()
        switch (imgName) {
          case '처방전1.jpg':
            imageDriveUrl = 'https://big23.s3.ap-northeast-2.amazonaws.com/%EC%95%BD%EC%8F%99+%ED%85%8C%EC%8A%A4%ED%8A%B8+%EC%9D%B4%EB%AF%B8%EC%A7%80/%EC%B2%98%EB%B0%A9%EC%A0%84+%EC%9D%B4%EB%AF%B8%EC%A7%80.png'
            break
          case 'pill_image.png':
            imageDriveUrl = 'https://big23.s3.ap-northeast-2.amazonaws.com/%EC%95%BD%EC%8F%99+%ED%85%8C%EC%8A%A4%ED%8A%B8+%EC%9D%B4%EB%AF%B8%EC%A7%80/%EC%95%8C%EC%95%BD+%EC%9D%B4%EB%AF%B8%EC%A7%80.png'
            break
          case 'pill_image2.png':
            imageDriveUrl = 'https://big23.s3.ap-northeast-2.amazonaws.com/%EC%95%BD%EC%8F%99+%ED%85%8C%EC%8A%A4%ED%8A%B8+%EC%9D%B4%EB%AF%B8%EC%A7%80/%EC%95%8C%EC%95%BD+%EC%9D%B4%EB%AF%B8%EC%A7%802.png'
            break
          case 'pill_image3.png':
            imageDriveUrl = 'https://big23.s3.ap-northeast-2.amazonaws.com/%EC%95%BD%EC%8F%99+%ED%85%8C%EC%8A%A4%ED%8A%B8+%EC%9D%B4%EB%AF%B8%EC%A7%80/%EC%95%8C%EC%95%BD+%EC%9D%B4%EB%AF%B8%EC%A7%803.png'
            break
          case 'pill_image4.png':
            imageDriveUrl = 'https://big23.s3.ap-northeast-2.amazonaws.com/%EC%95%BD%EC%8F%99+%ED%85%8C%EC%8A%A4%ED%8A%B8+%EC%9D%B4%EB%AF%B8%EC%A7%80/%EC%95%8C%EC%95%BD+%EC%9D%B4%EB%AF%B8%EC%A7%804.png'
            break
          case 'pill_image5.png':
            imageDriveUrl = 'https://big23.s3.ap-northeast-2.amazonaws.com/%EC%95%BD%EC%8F%99+%ED%85%8C%EC%8A%A4%ED%8A%B8+%EC%9D%B4%EB%AF%B8%EC%A7%80/%EC%95%8C%EC%95%BD+%EC%9D%B4%EB%AF%B8%EC%A7%805.png'
            break
          default:
            console.log(imgName)
        }
        const asset = Asset.fromURI(imageDriveUrl);
        await asset.downloadAsync();
        console.log(asset.localUri)
        
        const imageData = await FileSystem.readAsStringAsync(asset.localUri, {
          encoding: FileSystem.EncodingType.Base64
        })

        // const imageData = await FileSystem.readAsStringAsync(localUri[0].localUri, {
        //   encoding: FileSystem.EncodingType.Base64,
        // });

        let response = await axios.post(apiUrl, {
          pill_image: imageData,
        });

        if (response.status == 200) {
          console.log('이미지 업로드 성공');
          console.log('응답 데이터:', response.data);
          // Alert.alert('업로드 완료')
          if(response.data.results=='처방전 사진을 제대로 인식하지 못했습니다.') {
            Alert.alert('오류', '처방전 사진을 제대로 인식하지 못했습니다. 다시 촬영해주세요.')
          } else if (response.data.pill_img_info.length===0) {
            Alert.alert('오류', '인식된 알약이 없습니다. 다시 촬영해주세요.')
          } else {
            // 조건에 따라 다른 화면으로 이동
            if (model === 'pill') {
              navigation.navigate('DrugScreen', { user_id:user_id, responseData: response.data, source: source, pickImage:pickImage });
            } else if (model === 'ocr') {
              navigation.navigate('PrescriptionScreen', { user_id:user_id, responseData: response.data, source: source, image: localUri[0].localUri, pickImage:pickImage });
            }
          }
        } else {
          // Alert.alert('업로드 실패')
          console.log('이미지 업로드 실패');
          console.log('응답 코드:', response.status);
        }
      } catch (error) {
        console.error(error);
        Alert.alert('오류 발생')
      } finally {
        setIsLoading(false);
      }
    };

    //aws 제출용
    const [sampleModalVisible, setSampleModalVisible] = useState(model)
    useEffect(() => {
      Alert.alert('샘플', '원활한 테스트를 위해 제공하는 샘플 이미지입니다.')
    }, [])
    

    const ocrSampleData = [
      // imageUri1
      {require:require('../../assets/처방전1.jpg'), uri:'../../assets/처방전1.jpg'}
    ]

    const pillSampleData = [
      // pillUri1, pillUri2, pillUri3, pillUri4, pillUri5
      {require:require('../../assets/pill_image.png'), uri:'../../assets/pill_image.png'},
      {require:require('../../assets/pill_image2.png'), uri:'../../assets/pill_image2.png'},
      {require:require('../../assets/pill_image3.png'), uri:'../../assets/pill_image3.png'},
      {require:require('../../assets/pill_image4.png'), uri:'../../assets/pill_image4.png'},
      {require:require('../../assets/pill_image5.png'), uri:'../../assets/pill_image5.png'},
    ]

    return (
      <View style={{flex:1}}>
          <View style={{backgroundColor:'black'}}>
            {/**image.require */}
            <Image source={image.require} style={{width:'100%', height:'100%', resizeMode:'contain'}}/>
          </View>
          <View style={{flexDirection:'row', 
                        justifyContent:'space-between', 
                        alignItems:"center",
                        height:'12%', 
                        bottom:0, 
                        width:'100%',
                        position:'absolute',
                        backgroundColor:'white', 
                        borderTopLeftRadius:20,
                        borderTopRightRadius:20,
                        paddingHorizontal:20,}}>
            <StyledButton 
              title={source==='gallery'?'재선택':'재촬영'} 
              withBtn={true}
              onPress={()=> {
                if(source === 'gallery') {
                  // pickImage(model);  // 같은 model로 다시 이미지 선택
                  setSampleModalVisible(model)
                } else {
                  navigation.replace('CameraScreen', {model:model})
                }
              }}
              isCancle={true}
            />
            <StyledButton title='확인' onPress={setUri} withBtn={true}/> 
          </View>
          {/* 샘플 이미지 모달 */}
          <Modal visible={sampleModalVisible!==''}
                        onRequestClose={()=>Alert.alert('취소', '사진 선택을 취소하시겠습니까?', [
                            {
                                text:'아니오'
                            },
                            {
                                text:'네',
                                onPress:()=>navigation.pop()
                            }
                        ])}>
                    <View style={{padding:20, flex:1, backgroundColor:'#f5f7ff'}}>
                        <View style={{alignItems:'center'}}>
                            <Text style={{fontSize:30, fontWeight:'bold', marginBottom:14}}>샘플 이미지</Text>
                        </View>
                        <View style={{flexGrow:1, flex:1, backgroundColor:'white', borderRadius:10}}>
                            <FlatList data={sampleModalVisible==='ocr'?ocrSampleData:pillSampleData}
                                    renderItem={({item}) => 
                                        { return <View style={{flexGrow:1, maxWidth:'50%'}}>
                                                <TouchableOpacity style={{marginHorizontal:10, 
                                                                          flexGrow:1, 
                                                                          alignItems:'center', 
                                                                          borderRadius:6, 
                                                                          aspectRatio:'1', 
                                                                          justifyContent:'center',
                                                                          backgroundColor:'#f5f7ff',
                                                                          elevation:2
                                                                        }}
                                                                    onPress={()=>Alert.alert('사진 선택 확인', '이 사진을 선택하시겠습니까?', [
                                                                        {
                                                                            text:'아니오'
                                                                        }, 
                                                                        {
                                                                            text:'네',
                                                                            onPress:()=>{
                                                                                // API URL 값 설정하기
                                                                                let apiUrl = '';
                                                                                if (sampleModalVisible === 'pill') {
                                                                                    apiUrl = BASE_API_URL + API_URL_PILLNAME;
                                                                                } else if (sampleModalVisible === 'ocr') {
                                                                                    apiUrl = BASE_API_URL + API_URL_OCR;
                                                                                }
                                                                                setImage(item)
                                                                                setSampleModalVisible('')
                                                                            }

                                                                        }
                                                                    ])}>
                                                                      {/**item.require */}
                                                    <Image source={item.require} style={{maxHeight:'90%', maxWidth:'90%', resizeMode:'contain'}}/>
                                                </TouchableOpacity>
                                                </View>
                                        }}
                                    numColumns={2}
                                    style={{flex:1, paddingVertical:10}}
                                    columnWrapperStyle={{width:'100%', padding:10}}
                                    contentContainerStyle={{width:'100%', alignItems:'center'}}/>
                        </View>
                    </View>
                </Modal>
          <Loading show={isLoading}/>
      </View>
  );
  
};

export default PhotoPreview;