import { StyleSheet, Text, View, Image, FlatList, useWindowDimensions,Alert, Pressable, Modal, TouchableOpacity} from 'react-native';
import { useEffect, useState } from 'react';
import { Foundation, MaterialIcons } from '@expo/vector-icons'; 
import { DB_URL_USERPILLJOIN } from '@env'
import { LogBox } from "react-native";
LogBox.ignoreAllLogs();

export default function PrescriptionScreen(props) {
  const [drugInfo, setDrugInfo] = useState([]); // 약 정보를 저장하는 상태입니다. 초기값은 빈 배열입니다.
  const {width} = useWindowDimensions(); // 화면의 너비를 가져옵니다.
  const [bigImgModalVisible, setbigImgModalVisible] = useState(false); // 이미지를 크게 보는 모달의 상태입니다. 초기값은 false입니다.
  const { responseData, source, image, user_id } = props.route.params; // route params에서 필요한 정보를 가져옵니다.
   
    // 다음 화면으로 이동하는 함수입니다.
    const moveToInterdictScreen = () => {
      const sendToModel = async() => {
        let drugNameList = ''
        for(let drug of drugInfo){
            drugNameList = drugNameList + drug.name + '~'
        }
        
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({pill_name:drugNameList, user_id:user_id})// 보낼 데이터
        }
        
        try {
            await fetch(DB_URL_USERPILLJOIN, requestOptions)
                .then(response => {
                    response.json()
                        .then(data => {
                            console.log('통신', data)
                            props.navigation.navigate("MainScreen")
                        });
                })
        } catch(error) {
            console.error(error);
        }
    }
    sendToModel()
  }
  
  const [mainImgModalVisible, setMainImgModalVisible] = useState(false)

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
      ], {cancelable:true}) 
    }

    // 약 정보를 화면에 표시하는 함수입니다.
    const renderItem = ({item}) => {
      console.log(item)
      const onLongPress = () => deleteImage(item.name);
      return (
        <View>
          <Pressable onLongPress = {onLongPress} style = {styles.container}>
            <View style = {styles.box}>
              <Image source = {{uri : item.uri}} style = {styles.image}/>
              <View style = {styles.textContainer}>
                <Text style = {styles.nameText}>
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
                visible = {bigImgModalVisible==item}
                onRequestClose={()=>setbigImgModalVisible(0)}
                >
                <Pressable onPress = {closeModal} style = {{flex : 1, justifyContent : "center", alignItems : "center"}}>
                  <View style={{backgroundColor:'white', opacity:0.4, position:'absolute', width:'100%', height:'100%'}}/>
                  <View style={{backgroundColor:'white', alignItems:'center', 
                              opacity:0.9, shadowColor:'black', shadowOffset:{width:0, height:2},
                              shadowOpacity: 0.2, shadowRadius:4, elevation:5, borderRadius:6,
                              width:'80%', minHeight:'40%'}}>
                    {item.uri!==undefined?<Image source = {{uri : item.uri}} style = {{ width : '100%', minHeight : '40%', resizeMode:'contain' }}/>
                    :<MaterialIcons name='image-not-supported' size={100} style={{margin:30}}/>}
                    <View style={{backgroundColor:'white', width:'100%', padding:20, }}>
                      <Text style={{fontSize:26, fontWeight:'bold', marginVertical:6}}>{item.name}</Text>
                      <Text style={{fontSize:16}}>{item.description}</Text>
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

    const mainOpenModal = () => {
      setMainImgModalVisible(true)
    }

    const mainCloseModal = () => {
      setMainImgModalVisible(false)
    }
  
    const openModal = (item) => {
      setbigImgModalVisible(item)
    }

    const closeModal = () => {
        setbigImgModalVisible(0)
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
          console.log('다시', responseData)
          setDrugInfo(newDrugInfos);
      }
    }, [responseData]);

    // 화면을 렌더링합니다.
    return (
      <View style = {{flex : 1, alignItems : "center", backgroundColor : "#f5f7ff"}}>
        <View style = {{justifyContent : "center", alignItems : "center", width : width * 0.9, height : "45%"}}>
            <Image source = {{uri : image}} style = {{width : "55%", height : "90%"}}/>
    
        </View>
        <View style = {{flexDirection : "row",padding : 5, backgroundColor : "#DBDCDC", borderRadius : 10}}>
            <Foundation name="magnifying-glass" size={18} color="black" style = {{marginRight : 5}}/>
            <TouchableOpacity onPress = {mainOpenModal}>
                <Text style = {{fontSize : 12}}>화면크게보기</Text>

                {/* Modal */}
                <Pressable>
                    <Modal
                    animationType = "fade"
                    transparent = {true}
                    visible = {mainImgModalVisible}
                    >
    
                    <Pressable onPress = {mainCloseModal} style = {{flex : 1, justifyContent : "center", alignItems : "center",  backgroundColor : "lightblue", padding:50}}>    
                        <Image source = {{uri : image}} style = {{resizeMode:'contain', width:'100%', height:'100%'}}/>
                    </Pressable>
                    </Modal>
                </Pressable>
            </TouchableOpacity>
        </View>
        <View style = {{ flex :1, width : width * 0.90}}>
          {/* Header */}
          <Text style={{marginTop:10, marginBottom:2, marginLeft:6}}>길게 누르면 삭제할 수 있습니다.</Text>
          <Text style={{marginBottom:4, marginLeft:6}}>잘못된 정보가 있다면 삭제 후 진행해주세요.</Text>
          {/* flatlist */}
          <View style = {{flex:1, paddingVertical : 20, paddingHorizontal : 10, backgroundColor : "white", marginBottom : 20, borderRadius : 10}}>
            <FlatList 
                data = {drugInfo}
                renderItem = {renderItem}
            />
          </View>
        </View>
        <View style = {{flexDirection : "row", width : "100%", height : 50, paddingHorizontal : 10,justifyContent : "space-between", marginBottom : 20,}} >
              <Pressable onPress={()=>props.navigation.pop()} style = {{width : "45%", backgroundColor : "#FFE1E1", borderWidth : 1, borderColor : "#F25555", justifyContent : "center", alignItems : "center", borderRadius : 5}}>
                <Text style = {{fontSize : 18}}>{source === "gallery" ? "재선택" : "재촬영"}</Text>
              </Pressable> 
              <Pressable onPress = {moveToInterdictScreen} style = {{width : "45%", backgroundColor : "#5471FF", justifyContent : "center", alignItems : "center", borderRadius : 5}}>
                <Text style = {{fontSize : 18, color : "white"}}>등록완료</Text>
              </Pressable>
        </View>
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
container_2: {
  flex: 1,
  flexDirection : "row",
  backgroundColor: '#F25555',
  borderRadius : 10,
  alignItems: 'center',
  justifyContent: 'space-between',
},
box : {
  flexDirection : "row",
  paddingHorizontal : 10,
  paddingVertical : 10,
  borderRadius : 10,
},
image : {
  width : 40,
  height : 40,
  borderRadius : 10,
  backgroundColor : "gray",
},
textContainer : {
  justifyContent : "center",
  marginLeft :  10,
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
  paddingHorizontal: 5,
  paddingVertical : 8,
  marginRight : 5,
},
Pressable_2 : {
  borderRadius : 5,
  backgroundColor: '#FFE1E1',
  paddingHorizontal: 5,
  paddingVertical : 8,
  marginRight : 5,
}

});