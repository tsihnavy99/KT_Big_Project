import { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, RefreshControl, Pressable, Image } from "react-native"
import { FontAwesome, Fontisto } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { TouchableWithoutFeedback } from "react-native";
import { Keyboard } from "react-native";
import styles from "../../styles";
import { TextInput } from "react-native-paper";
import StyledInput from "../../components/StyledInput";
import StyledButton from "../../components/StyledButton";
import Loading from "../../components/Loading";
import { DB_QNA_LIST } from '@env'
import { LogBox } from "react-native";
LogBox.ignoreAllLogs();

const MyPostScreen = ({route, navigation}) => {
    // 질병 카테고리 or 내용 or (작성 user_id) 검색 기능 추가
    // 질문 자세히 보는 창 모달로?
    const userInfo = route.params.userInfo

    const [mainData, setMainData] = useState([]);
    const isFocused = useIsFocused(); 

    useEffect(() => {
        if (isFocused&&!loading) {
            setRefreshing(false);
            setScrollTop(true)
        }
      }, [isFocused]);

    useEffect(() => {
        loadQnaData()
    }, [])

    const flatlistRef = useRef();
    const [scrollTop, setScrollTop] = useState(false);

    const [QnAData, setQnAData] = useState([]);

    const [search, setSearch] = useState('')
    const [searchKeyword, setSearchKeyword] = useState('')

    const [refreshing, setRefreshing] = useState(true);

    const [onlyAnswered, setOnlyAnswered] = useState(false);
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        if(QnAData!==mainData) {
            const newData = []
            for(data of mainData) {
                if(route.params.userInfo.user_id!==data.user_info) continue;
                newData.push(data)
            }
            setQnAData(newData)
            setMainData(newData)
            setLoading(false)
        }
    }, [mainData])

    const loadQnaData = async() => {
        const requestOptions = {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        }
        try {
            await fetch(DB_QNA_LIST, requestOptions)
                .then(response => {
                    response.json()
                        .then(data => {
                            if(data.length>0) {
                                setRefreshing(false);
                                setMainData(data)
                            } else {
                               Alert.alert('Error', '문제가 발생했습니다. 잠시후 다시 시도해주세요.')
                               setLoading(false)
                            }
                        });
                })
        } catch(error) {
            console.error(error);
            
            setLoading(false)
        }
    }

    useEffect(() => {
        if(flatlistRef.current&&scrollTop) {
            flatlistRef.current.scrollToIndex({animated:true, index:0});
            setScrollTop(false)
        }
    }, [scrollTop])

    const Item = ({item, onPress}) => (
        <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
            <View style={styles.itemHeader}>
                <Text style={qnaStyles.userId}>{item.user_info}</Text>
                {item.answer!==''?<Image source={require('../../assets/answered_logo.png')} style={{width:30, height:20}}/>:null}
            </View>
            <View style={qnaStyles.qnaBody}>
                <Text style={qnaStyles.q}>{item.question}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderItem = ({item}) => {
        return (
            <Item item={item}
                onPress={() => navigation.navigate('QnADetailScreen', {'qna':item, userInfo:userInfo})} />
        )
    }

    const searchQnA = (search) => {
        // DB에서 search 키워드로 filtering한 뒤 re render? 아니면 그냥 front에서?
        // front에서 하면 qna 많아지면 시간 오래걸릴수도
        let newData = []

        if(search==='') {
            if(onlyAnswered) {
                for(let item of mainData) {
                    if(userInfo.admin?item.answer!=='':item.answer==='') {
                        continue
                    }
                    newData.push(item)
                }
            } else {
                newData = mainData
            }
            setQnAData(newData)
            setSearchKeyword(search)
            return
        }

        for(let item of mainData) {
            if(item.question.includes(search)) {
                if(onlyAnswered&&(userInfo.admin?item.answer!=='':item.answer==='')){
                    continue
                }
                newData.push(item)
            } 
        }
        setQnAData(newData)
        setSearchKeyword(search)
    }

    useEffect(() => {
        if(onlyAnswered) {
            let newData = []
            for(let item of QnAData) {
                if(userInfo.admin?item.answer==='':item.answer!=='') {
                    newData.push(item)
                }
            }
            setQnAData(newData)
        } else {
            setQnAData(mainData)
            searchQnA(search)
        }
    }, [onlyAnswered])
    
    return (
        <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
        <View style={styles.container}>
            <View style={{flexDirection:'row', alignItems:'flex-end'}}>
                <StyledInput value={search} 
                            onChangeText={setSearch} 
                            mode='outlined' 
                            placeholder="검색어를 입력하세요."
                            left={<TextInput.Icon icon='magnify'/>}
                            right={search===''?null:<TextInput.Icon icon='window-close' onPress={()=>setSearch('')}/>} 
                            activeOutlineColor="#5471FF"
                            withBtn={true}
                            />
                            
                <StyledButton title={'검색'} onPress={()=>searchQnA(search)} withInput={true}/>
            </View>
            <View>
                {searchKeyword!==''? // 검색 키워드 제거
                    <Pressable style={{marginVertical:6, marginLeft:6}} onPress={()=>{setSearch('');setSearchKeyword('');searchQnA('')}}>
                        <Text>{searchKeyword} X</Text>
                    </Pressable>
                    :null}
            </View>
            <View style={{marginVertical:20, width:160}}>
                <Pressable style={{flexDirection:'row', alignItems:'center'}} onPress={()=>setOnlyAnswered(!onlyAnswered)}>
                    <View style={{width:20}}>
                        <Fontisto name={onlyAnswered?'checkbox-active':'checkbox-passive'} size={16} color={onlyAnswered?'#5471ff':'#222222'}/>
                    </View>
                    <Text style={{marginLeft:6}}>{userInfo.admin?'답변 못 받은 질문만 보기':'답변 받은 질문만 보기'}</Text>
                </Pressable>
            </View>
            <View style={{flex:2}}>
                <FlatList data={QnAData} 
                        renderItem={renderItem} 
                        refreshControl={
                            <RefreshControl 
                                refreshing={refreshing} 
                                onRefresh={loadQnaData} />}
                        ref={flatlistRef}
                        keyExtractor={item=>item.no} 
                        ListEmptyComponent={() => {
                            return <Text>작성한 글이 없습니다.</Text>
                        }}/>
            </View>
            <TouchableOpacity style={styles.scrollBtn} onPress={()=>setScrollTop(true)}>
                <FontAwesome name="chevron-up" size={16} color={'white'}/>
            </TouchableOpacity>
            
            <Loading show={loading}/>
        </View>
        </TouchableWithoutFeedback>
    )
}

const qnaStyles = StyleSheet.create({
    qnaBody: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingVertical: 6
    },
    userId: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    disease: {
        borderWidth: 1,
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginBottom: 10,
        fontSize: 16,
        backgroundColor: 'black',
        color: 'white',
        borderRadius: 14
    },
    q: {
        fontSize: 18
    }, 
    addBtn: {
        backgroundColor: '#5471FF',
        padding: 14,
        borderRadius: 100,
        position: 'absolute',
        bottom: '4%',
        right: '4%',
        elevation:4
    },
    
})

export default MyPostScreen;