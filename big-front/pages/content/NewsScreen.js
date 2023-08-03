import React, { useCallback, useEffect, useState } from 'react'
import { View, Text, FlatList, Pressable, useWindowDimensions, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { TextInput } from 'react-native-paper'
import StyledButton from '../../components/StyledButton'
import { LogBox } from "react-native";
import { NEWS_API_SECRET_KEY } from '@env'
LogBox.ignoreAllLogs();

// expor const > export default로 수정
export default NewsScreen = ({route}) => {
    const {width} = useWindowDimensions();
    const navigation = useNavigation();
    const [query, setQuery] = useState("");
    const [item, setItem] = useState([]);
    const userInfo = route.params.userInfo;

    const onPressListItem = useCallback((item)=> {
      navigation.navigate("NewsDetailScreen", {item})
    }, [])
    
    // 뉴스 첫 접속 시 사용자가 등록한 질병과 관련된 뉴스 우선 출력
    useEffect(() => {
      if(userInfo.disease!==[]) {
        getNewsApi(eval(userInfo.disease).join(' '))
      }
    }, [])

    const getNewsApi = (query) => {
        fetch(`https://openapi.naver.com/v1/search/news.json?query=${query}`, {
            headers : {
                'X-Naver-Client-Id':'11UELhjX2Uc9bP1X6w8e',
                'X-Naver-Client-Secret':NEWS_API_SECRET_KEY
            }
        })
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            return setItem(response.items)
        })
        .catch((error) => {
            console.error(error);
        })
    }
    
    const onSubmitEditing = useCallback((query) => {
        if (query === ""){
            return;
        }

        getNewsApi(String(query.nativeEvent.text))
    })

    const renderItem = ({item}) => {
      return (
        <Pressable onPress ={()=> onPressListItem(item)} style = {{ width : width * 0.9, paddingHorizontal : 10, paddingVertical : 16, backgroundColor : "white", borderRadius : 5, marginBottom : 16}}>
          <View style={{flex:1, paddingHorizontal:10, paddingVertical:8}}>
              <Text style={{fontSize:18, fontWeight:'bold', marginBottom:6}} numberOfLines={1}>
                {item.title.replaceAll('<b>', '')
                            .replaceAll('</b>', '')
                            .replaceAll('&apos;', '')
                            .replaceAll('&quot;', '')
                            .replaceAll('&amp;', '')
                            .replaceAll('&gt;', '')
                            .replaceAll('&lt;', '')}
              </Text>
              <Text style={{fontSize:16}} numberOfLines={2} color='gray'>
                {item.description.replaceAll('<b>', '')
                                  .replaceAll('</b>', '')
                                  .replaceAll('&apos;', '')
                                  .replaceAll('&quot;', '')
                                  .replaceAll('&amp;', '')
                                  .replaceAll('&gt;', '')
                                  .replaceAll('&lt;', '')}
              </Text>
          </View>
        </Pressable>
      )   
    }
    
  return (
    <View style = {{flex : 1, backgroundColor : "#f5f7ff"}}>
      <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
      <View style={{paddingHorizontal:24, paddingVertical:12}}>
          <View style={{flexDirection:'row', alignItems:'flex-end'}}>
                <TextInput value={query} 
                            onChangeText={setQuery} 
                            mode='outlined' 
                            placeholder="뉴스 검색어를 입력해 주세요"
                            onSubmitEditing={onSubmitEditing}
                            left={<TextInput.Icon icon='magnify'/>}
                            right={query===''?null:<TextInput.Icon icon='window-close' onPress={()=>setQuery('')}/>} 
                            activeOutlineColor="#5471FF"
                            style={{flex:5, marginRight:6}}
                            outlineColor='#5471ff'
                            />
                <StyledButton title={'검색'} onPress={()=>getNewsApi(String(query))} withInput={true} />
            </View>
      </View>
      
    </TouchableWithoutFeedback>
      <View style = {{ justifyContent : "center", alignItems : "center", flexGrow:1, flex:1}}>
        <FlatList 
          data = {item}
          renderItem={renderItem}
          contentContainerStyle={{flexGrow:1}}
        />
      </View>
    </View>
  )
}
