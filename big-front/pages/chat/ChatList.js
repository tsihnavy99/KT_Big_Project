import { View,Text, TouchableOpacity, FlatList, StyleSheet, BackHandler } from "react-native"
import { useEffect, useState } from "react"
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { API_URL_CHAT_LIST } from '@env'
import Loading from "../../components/Loading";
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatList = ({route, navigation}) => {    
    const [userInfo, setUserInfo] = useState(null)
    const [loadUserInfo, setLoadUserInfo] = useState(true)

    const isFocused = useIsFocused()
    useEffect(() => {
        if (isFocused) {
            setLoading(true);
            const backAction = () => {
                navigation.navigate('BottomTabNavigation')
                return true;
            };
            
            const backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                backAction,
            );
            
            return () => backHandler.remove();
        }
      }, [isFocused]);
  
    useEffect(() => {
      const getUser = async() => {
        const storageData = JSON.parse(await AsyncStorage.getItem('userInfo'))
        
        if (storageData) {
          setUserInfo(storageData)
        } 
        setLoadUserInfo(false)
      };
      getUser();
      
    }, [])
    // 현재 로그인 된 계정
    // const userInfo = route.params.userInfo
    
    // 로딩 
    const [ loading, setLoading ] = useState(true)

    // 화면 이동 컴포넌트
    const { navigate } = useNavigation();
    
    // 약사만 필터링 유저
    const [ djangoUsers, setDjangoUsers ] = useState([]);

    // 전체 유저
    const [ allUsers, setAllUsers ] = useState([]);

    const login = async () => {
        const requestOptions = {
            method : "GET",
            headers: {'Content-Type': 'application/json'},
        }
        try {
            await fetch(API_URL_CHAT_LIST, requestOptions)
                    .then(response => {
                    response.json()
                        .then(data => {
                            setDjangoUsers(data.filter(u => u.admin === true ));
                            setAllUsers(data);
                        });
                })
        } catch(error) {
            console.error(error);
        } finally {
            setLoading(false)
        }
    }

    // 화면 시작될 때 유저 불러오기
    useEffect(() => {
        if(!loadUserInfo) {
            login();
        }
    }, [loadUserInfo]);

    return (
        <View style = {[styles.container, {paddingHorizontal:24, paddingTop:2, paddingBottom:24}]}>
            <View>
                <Text style={styles.sectionTitle}>나의 정보</Text>
                {loadUserInfo?null:
                <View style={styles.userSectionContent}>
                    <View style={styles.myProfile}>
                        <Text style = {styles.myNameText}>{userInfo.name}</Text>
                        <Text style = {styles.myEamilText}>{typeof(eval(userInfo.disease))==='string'?userInfo.disease:eval(userInfo.disease).join(', ')}</Text>
                    </View>
                </View>
                }
            </View>
            {/* userListSection */}
            <View style={{flex:1}}>
                { loading||loadUserInfo ? <Loading show={loading}/> : (
                    <>
                        <Text style = {styles.sectionTitle}>
                            약사님과 상담해 보세요!
                        </Text>
                        <View style={{flexGrow:1, flex:1}}>
                            <Text style={{marginLeft:4, marginBottom:6}}>상담 가능 약사 목록</Text>
                            <FlatList 
                                data = { djangoUsers }
                                renderItem={
                                    ({ item }) => (
                                        <TouchableOpacity
                                            style = {styles.userListItem}
                                            onPress = {() => {
                                                navigate("Chat", {
                                                    userInfo : userInfo,
                                                    userIds : [userInfo.user_id, item.user_id],
                                                    allData : allUsers,
                                                    other : item,
                                                })
                                            }}>
                                            <Text style={{fontWeight:'bold', fontSize:18}}>{item.name}</Text>
                                            <Text style = {styles.otherEmailText}>{item.parmacy}</Text>
                                        </TouchableOpacity>
                                    )}
                                ItemSeparatorComponent={() => <View style={styles.separator}/>}
                                ListEmptyComponent={() => {
                                    return <Text style={styles.emptyText}>사용자가 없습니다.</Text>
                                }}
                                contentContainerStyle={{flexGrow:1}}
                            />
                        </View>
                    </>
                )}
            </View>
        </View>  
    )
}


const styles = StyleSheet.create({
    container : {
        flex : 1, 
        backgroundColor : "#f5f7ff"
    },
    sectionTitle : {
        fontSize : 20,
        fontWeight : "bold",
        marginBottom : 10,
        marginTop:16,
        color : "black",
    },
    userSectionContent : {
        backgroundColor : "#5471ff",
        borderRadius : 12,
        padding : 20,
        alignItems : "center",
        flexDirection : "row"
    },
    myProfile : {
        flex : 1,
    },
    myNameText : {
        color : "white",
        fontSize : 18,
        fontWeight : "bold",
        marginBottom:6
    },
    myEamilText : {
        color : "white",
        fontSize : 14,
    },
    logoutText : {
        color : "white",
        fontSize : 14,
    },
    userSection : {
        marginTop : 40,
        flex : 1,   
    },
    loadingContainer : {
        flex : 1,
        alignItems : "center",
        justifyContent : "center",
    },
    userListItem : {
        backgroundColor : "white",
        borderRadius : 12,
        padding : 20,
    },
    otherNameText : {
        fontSize : 16,
        fontWeight : "bold",
        color : "black",
    },
    otherEmailText : {
        marginTop : 8,
        fontSize : 14,
        color : "black",
    },
    separator : {
        height : 10,

    },
    emptyText : {
        color : "black",
    }
});



export default ChatList;