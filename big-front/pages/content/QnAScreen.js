import { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, RefreshControl, Pressable, Image, Alert } from "react-native"
import { MaterialIcons, FontAwesome, Fontisto, Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { TouchableWithoutFeedback } from "react-native";
import { Keyboard } from "react-native";
import styles from "../../styles";
import { TextInput } from "react-native-paper";
import StyledInput from "../../components/StyledInput";
import StyledButton from "../../components/StyledButton";
import Loading from "../../components/Loading";
import { DB_QNA_LIST } from '@env';
import { LogBox } from "react-native";
LogBox.ignoreAllLogs();

const QnAScreen = ({route, navigation}) => {
    const userInfo = route.params.userInfo
    const isFocused = useIsFocused(); 

    const flatlistRef = useRef();
    const [scrollTop, setScrollTop] = useState(false);

    const [QnAData, setQnAData] = useState([]);
    const [mainData, setMainData] = useState([]);

    const [search, setSearch] = useState('')
    const [searchKeyword, setSearchKeyword] = useState('')

    const [refreshing, setRefreshing] = useState(true);

    const [onlyAnswered, setOnlyAnswered] = useState(false);
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        if(QnAData.length>0) {
            setScrollTop(true)
        }
        if(QnAData&&mainData) {
            setLoading(false)
        }
    }, [QnAData])

    useEffect(() => {
        if (isFocused) {
            loadQnaData();
            setRefreshing(false);
        }
    }, [isFocused]);
    
    useEffect(() => {
        if(flatlistRef.current&&scrollTop) {
            flatlistRef.current.scrollToIndex({animated:true, index:0});
            setScrollTop(false)
        }
    }, [scrollTop])

    useEffect(() => {
        if(onlyAnswered) {
            let newData = []
            for(let item of QnAData) {
                if(userInfo.admin?item.answer==='':item.answer!=='') {
                    newData.push(item)
                }
            }
            setQnAData(newData)
            // loadQnaData()
        } else {
            setQnAData(mainData)
            searchQnA(search)
        }
    }, [onlyAnswered])

    const loadQnaData = async() => {
        const requestOptions = {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        }
        try {
            await fetch(DB_QNA_LIST, requestOptions)
                .then(response => {
                    response.json()
                        .then(data => {
                            if(data.length>0) {
                                setQnAData(data.reverse());
                                setMainData(data);
                                setLoading(false)
                                setRefreshing(false);
                            } else {
                               Alert.alert('Error', '문제가 발생했습니다. 잠시후 다시 시도해주세요.')
                            }
                        });
                })
        } catch(error) {
            console.error(error);
        }
    }

    const Item = ({item, onPress}) => {
        return (
        <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
            <View style={styles.itemHeader}>
                <Text style={qnaStyles.userId}>{item.user_info}</Text>
                {item.answer!==''?<Image source={require('../../assets/answered_logo.png')} style={{width:30, height:20}}/>:null}
            </View>
            <View style={qnaStyles.qnaBody}>
                <Text style={qnaStyles.q}>{item.question}</Text>
            </View>
        </TouchableOpacity>
        )
    };
    
    const renderItem = ({item}) => {
        return (
            <Item item={item}
                onPress={() => navigation.navigate('QnADetailScreen', {'qna':item, userInfo:userInfo})} />
        )
    }

    const searchQnA = (search) => {
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
    
    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
                <View>
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
                </View>
            </TouchableWithoutFeedback>
            <View style={{flex:1, flexGrow:1}}>
                <Loading show={loading}/>
                {QnAData.length>0?
                <FlatList data={QnAData} 
                        renderItem={renderItem} 
                        refreshControl={
                            <RefreshControl 
                                refreshing={refreshing} 
                                onRefresh={loadQnaData} />}
                        ref={flatlistRef}
                        initialNumToRender={20}
                        contentContainerStyle={{flexGrow:1}}
                        windowSize={10}
                        keyExtractor={(item, index)=>index.toString()}
                        />
                :<Text>아직 등록된 질문이 없습니다.</Text>}
            </View>
            <TouchableOpacity style={styles.scrollBtn} onPress={()=>setScrollTop(true)}>
                <FontAwesome name="chevron-up" size={16} color={'white'}/>
            </TouchableOpacity>
            {userInfo.admin?null:
                <TouchableOpacity style={qnaStyles.addBtn} onPress={()=>navigation.navigate('QnAAddScreen', route.params)}>
                    <MaterialIcons name="post-add" size={30} color={'white'}/>
                </TouchableOpacity>
            }
        </View>
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
        fontSize: 14,
        fontWeight: 'bold'
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

export default QnAScreen;