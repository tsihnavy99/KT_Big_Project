// 필요한 모듈들을 불러옵니다.
import { StyleSheet, Text, View, Image, FlatList, useWindowDimensions, Alert, Pressable, Modal, TouchableOpacity} from 'react-native';
import { useEffect, useState } from 'react';
import { API_URL_PillInFoView_inter } from '@env'
import Loading from '../../components/Loading';
import { MaterialIcons } from '@expo/vector-icons';
import { LogBox } from "react-native";
LogBox.ignoreAllLogs();

// 약 정보를 화면에 표시하는 컴포넌트입니다.
export default function DrugScreen(props) {
    const [drugInfo, setDrugInfo] = useState([]); // 약 정보를 저장하는 상태입니다. 초기값은 빈 배열입니다.
    const {width} = useWindowDimensions(); // 화면의 너비를 가져옵니다.
    const [bigImgModalVisible, setbigImgModalVisible] = useState(0); // 이미지를 크게 보는 모달의 상태입니다. 초기값은 false입니다.
    const { responseData, source, user_id, pickImage } = props.route.params; // route params에서 필요한 정보를 가져옵니다.
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(null)

    useEffect(()=>{
      if(success&&loading) {
        props.navigation.navigate("InterdictScreen", {user_id:user_id, drugInfo:success})
      }
    }, [success, loading])
        
    // 다음 화면으로 이동하는 함수입니다.
    const moveToInterdictScreen = () => {
      const sendToModel = async() => {
        let drugNameList = []
        for(let d of drugInfo) {
          drugNameList.push(d.name);
        }

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({pill_names:drugNameList, user_id:user_id})// 보낼 데이터, user_id:user_id
        }

        try {
            const responsePromise = fetch(API_URL_PillInFoView_inter, requestOptions) //http://3.38.94.32/user/api/login
            const timeoutPromise = new Promise((resolve, reject) => {
                setTimeout(() => reject(new Error("Request timed out")), 500000); // 10초 후에 타임아웃 // 테스트 중 timeout 걸려서 임시로 0하나 추가
            });

            const response = await Promise.race([responsePromise, timeoutPromise]);
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setSuccess(data.result)
            setLoading(false)
        } catch(error) {
            console.error(error);
            Alert.alert("서버 오류", "다시 시도해주세요."); // 이 부분을 사용자에게 적절한 오류 메시지를 표시하는 방법으로 변경하실 수 있습니다.
            setLoading(false)
        }
      }
      setLoading(true)
      sendToModel()
    }

    // 이미지를 크게 보는 모달을 열고 닫는 함수입니다.
    const openModal = (item) => {setbigImgModalVisible(item)}
    const closeModal = () => {setbigImgModalVisible(0)}

    // 이미지를 삭제하는 함수입니다.
    const deleteImage = (name) => {
      Alert.alert("이미지를 삭제하시겠어요?", "", [
        {
          style : "cancel",
          text : "아니요",
        },
        {
          text : "네",
          onPress : () => {
            const newDrugInfo = drugInfo.filter((drug) => drug.name !== name);
            setDrugInfo(newDrugInfo);
          }
        }
      ], {cancelable: true}) 
    }

    // 약 정보를 화면에 표시하는 함수입니다.
    const renderItem = ({item}) => {
      const onLongPress = () => deleteImage(item.name);
      return (
        <View>
          <Pressable onLongPress = {onLongPress} style = {styles.container}>
            <View style = {styles.box}>
              <Image source = {{uri : item.uri}} style = {styles.image}/>
              <View style = {styles.textContainer}>
                <Text style = {styles.nameText} numberOfLines={1} >
                  {item.name}
                </Text>
                <View>
                  <Text style = {styles.desName}>{item.description}</Text>
                </View>
              </View>
            </View>
            <Pressable>
              <Modal
                animationType = "fade"
                transparent = {true}
                visible = {bigImgModalVisible===item}
                >
                <Pressable onPress = {closeModal} style = {{flex : 1, justifyContent : "center", alignItems : "center"}}>
                  <View style={{backgroundColor:'white', opacity:0.4, position:'absolute', width:'100%', height:'100%'}}/>
                  <View style={{backgroundColor:'white', alignItems:'center', 
                              opacity:0.9, shadowColor:'black', shadowOffset:{width:0, height:2},
                              shadowOpacity: 0.2, shadowRadius:4, elevation:5, borderRadius:6,
                              width:'80%', minHeight:'40%',}}>
                    {item.uri!==undefined?<Image source = {{uri : item.uri}} style = {{ width : '100%', minHeight : '26%', resizeMode:'contain', margin:10}}/>
                    :<MaterialIcons name='image-not-supported' size={100} style={{margin:30}}/>}
                      <View style={{backgroundColor:'white', width:'100%', padding:20, borderBottomLeftRadius:6, borderBottomRightRadius:6}}>
                        <Text style={{fontSize:22, fontWeight:'bold', marginVertical:10}}>{item.name}</Text>
                        <Text style={{fontSize:16, lineHeight:26}}>{item.description}</Text>
                      </View>
                  </View>
                </Pressable>
              </Modal>
            </Pressable>
            <TouchableOpacity onPress = {()=>openModal(item)} style = {styles.Pressable}>
              <Text style = {{fontSize : 12, color : "white"}}>크게보기</Text>
            </TouchableOpacity>
          </Pressable>
          <View style={{height : 10}}></View>
        </View>
      )
    }

    // 컴포넌트가 마운트되면서 서버로부터 받은 응답 데이터를 사용하여 약 정보를 설정합니다.
    useEffect(() => {
      if (responseData && responseData.pill_img_info && responseData.results) {
          const newDrugInfos = responseData.pill_img_info.map((pillInfo, index) => {
              return {
                  uri: pillInfo.img_key, 
                  name: responseData.results[index],
                  description: ` 색상: ${pillInfo.color_class1} / ${pillInfo.color_class2}\n 약 형태: ${pillInfo.drug_shape}\n 뒷면 프린트: ${pillInfo.print_back}\n 앞면 프린트: ${pillInfo.print_front}`,
              };
          });
          setDrugInfo(newDrugInfos);
      }
    }, [responseData]);

    // 재촬영 버튼을 누를 때 동작하는 함수입니다.
    const reCaptureButtonHandler = () => {
      if (source === "gallery") {
        // pickImage('pill')
        props.navigation.navigate('PhotoPreview', {model:'pill', source:'gallery'})
      } else {
        props.navigation.navigate('CameraScreen', {model:'pill'})
      }
    }
  
    // 화면을 렌더링합니다.
    return (
      <View style = {{flex : 1, alignItems : "center", backgroundColor : "#f5f7ff"}}>
        <View style = {{ flex :1, width : width * 0.90}}>
          <View style = {{paddingTop : 40, paddingBottom : 20,}}>
            <Text style= {{fontSize : 24,}}>등록할 약을 확인해 주세요.</Text>
            <Text style= {{fontSize : 24,}}>
              <Text style = {{fontSize : 26, fontWeight : "bold", color : "#5471FF"}}>{`${drugInfo.length}개`}</Text>의 알약이 인식되었습니다.
            </Text>
            <Text style={{marginTop:10, marginBottom:2}}>길게 누르면 삭제할 수 있습니다.</Text>
            <Text>잘못된 정보가 있다면 삭제 후 진행해주세요.</Text>
          </View>
          <View style = {{paddingVertical : 10, paddingHorizontal : 10, maxHeight : "56%", backgroundColor : "white", marginBottom : 20, borderRadius : 10}}>
            <FlatList 
              data = {drugInfo}
              renderItem = {renderItem}
            />
          </View>
          <View style = {{flex : 1, alignItems : "center", backgroundColor : "#f5f7ff"}}>
            <View style = {{flexDirection : "row", width : "100%", height : 50, paddingHorizontal : 10,justifyContent : "space-between"}} >
              <Pressable onPress={reCaptureButtonHandler} style = {{width : "45%", backgroundColor : "#FFE1E1", borderWidth : 1, borderColor : "#F25555", justifyContent : "center", alignItems : "center", borderRadius : 5}}>
                <Text style = {{fontSize : 18}}>{source === "gallery" ? "재선택" : "재촬영"}</Text>
              </Pressable> 
              <Pressable onPress = {moveToInterdictScreen} style = {{width : "45%", backgroundColor : "#5471FF", justifyContent : "center", alignItems : "center", borderRadius : 5}}>
                <Text style = {{fontSize : 18, color : "white"}}>충돌 확인</Text>
              </Pressable>
            </View>
          </View>
        </View>
        <Modal visible={loading} 
              animationType = "fade"
              transparent = {true}>
            <Loading show={loading} />
        </Modal>
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection : "row",
    backgroundColor: '#e6ebff',
    borderRadius : 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  box : {
    flexDirection : "row",
    paddingHorizontal : 10,
    paddingVertical : 10,
    borderRadius : 10,
    flex:1
  },
  image : {
    width : 81,
    height : 81,
    borderRadius : 10,
    backgroundColor : "gray",
  },
  textContainer : {
    justifyContent : "center",
    marginLeft : 10,
    flex:1,
    flexGrow:1,
  },
  nameText : {
    fontWeight : "bold",
    fontSize : 12,
    color : "#5D5F64",
  },
  desName : {
    fontSize : 11,
    color : "#5D5F64"
  },
  Pressable : {
    borderRadius : 5,
    backgroundColor: '#5471FF',
    paddingHorizontal: 8,
    paddingVertical : 8,
    marginRight : 10,
  }

});