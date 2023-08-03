import React, { useCallback, useState, useMemo } from "react";
import { useRoute } from "@react-navigation/native";
import { View, StyleSheet, Text, FlatList, TouchableOpacity, Modal, Pressable, Image } from "react-native";

// 정렬 pakage
import _ from "lodash";
// yarn add react-native-image-crop-picker
import ImagePicker from 'react-native-image-crop-picker';

import testuseChat from "./UseChat";
import TestMessage from "./Message";

import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

import StyledInput from "../../components/StyledInput";
import Loading from "../../components/Loading";
import moment from "moment";

const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor:'#f5f7ff'
    },
    loadingContanier : {
        flex : 1,
        alignItems : "center",
        justifyContent : "center",
    },
    chatContainer : {
        flex : 1,
        padding : 20,
    },
    membersSection : {
        backgroundColor:'white',
        padding: 10,
        borderRadius: 10,
    },
    membersTitleText : {
        fontSize : 16,
        color : "black",
        fontWeight : "bold",
        marginBottom : 6,
    },
    userProfile : {
        width : 34,
        height : 34,
        backgroundColor : "#5471ff",
        borderRadius : 34 / 2,
        borderWidth : 1,
        borderColor : "white",
        justifyContent : "center",
        alignItems : "center",
        marginRight: 4,
    },
    userProfileText : {
        color : "white",
    },
    messageList : {
        flex : 1,
        marginVertical : 20,
    },
    inputContainer : {
        flexDirection : "row",
        alignItems : "center",
    },
    textInputContainer : {
        flex : 1,
        marginRight : 10,
        borderRadius : 24,
        borderColor : "black",
        borderWidth : 1,
        overflow : "hidden",
        padding : 10,
        minHeight : 50,
        justifyContent : "center",
    },
    textInput : {
        paddingTop : 0,
        paddingBottom : 0,
    },
    sendButton : {
        justifyContent :"center",
        alignItems : "center",
        backgroundColor : "#5471ff",
        width : 50,
        height : 50,
        borderRadius : 50 / 2,
    },
    sendText : {
        color: "white",
    },
    messageseparator : {
        height : 8,
    },
    imageButton : {
        borderWidth : 1,
        borderColor : "#5471ff",
        width : 50,
        height : 50,
        borderRadius : 8,
        marginLeft : 8,
        alignItems : "center",
        justifyContent : "center",
    }
});

// 활성화 안되었을 때 스타일
const disabledSendButtonStyle = [
    styles.sendButton,
    { backgroundColor : "gray" },
];

const Chat = () => {
    const { params } = useRoute();
    const { other, userIds, allData} = params;
    const { loadingChat, chat, sendMessage, messages, loadingMessages, sendImageMessage} = testuseChat(userIds, allData);
    const [ text, setText ] = useState("")
    const [modalVisible, setModalVisible] = useState('')

    // 로그인 계정
    const user = params.userInfo;
    
    const loading = loadingChat || loadingMessages;

    // text 길이가 0일때 
    const sendDisabled = useMemo(() => text.length === 0, [text]);

    // 버튼 눌리면 초기화 
    const onPressSendButton = useCallback(() => {
        // text와 user 정보 보내기
        sendMessage( text, user )
        setText('');
    }, [user, sendMessage, text] )

    // text가 바뀌었을 때
    const onChangeText = useCallback((newText) => {
        setText(newText);
    }, [])

    // 버튼이 눌렸을 때
    const onPressImageButton = useCallback(async () => {
        if (user != null) {
            const image = await ImagePicker.openPicker( { cropping : true } );
            sendImageMessage(image.path, user)
        }
    }, [user, sendImageMessage])


    const renderChat = useCallback(() => {
        return (
            <View style={styles.chatContainer}>
                {/* 대화상대 member icon section */}
                <View style = {styles.membersSection}>
                    <Text style = {styles.membersTitleText}>대화상대</Text>
                    <FlatList 
                        data = {chat.users}
                        renderItem= {({item : u}) => (
                            <View style={[styles.userProfile, u.name===user.name?null:{borderColor:'#5471ff', backgroundColor:'white'}]}>
                                <Text style={[styles.userProfileText, u.name===user.name?null:{color:'black'}]} >{ u.name[0] }</Text>
                            </View>
                        )}
                        horizontal
                    />
                </View>
                {/* 텍스트 input section */}
                <FlatList
                    inverted
                    style = {styles.messageList}
                    data = {messages}
                    renderItem={( {item : message} ) => {
                        if (message.text != null) {
                            return (
                                <TestMessage
                                    name = {message.user.name}
                                    message = {{ text : message.text}} 
                                    createdAt={message.createdAt}
                                    isOtherMessage={message.user.user_id !== user.user_id}
                            />
                            )
                        }
                        if (message.imageUrl != null) {
                            return (
                                <Message 
                                    name = {message.user.name}
                                    message = {{ url : message.imageUrl}} 
                                    createdAt={message.createdAt}
                                    isOtherMessage={message.user.user_id !== user.user_id}
                                />
                            )
                        }
                    }}
                    ItemSeparatorComponent={() => (
                        <View style = {styles.messageseparator} />
                    )}
                />

                <View style = {styles.inputContainer}>
                    <StyledInput withBtn={true} value={text} onChangeText={onChangeText} multiline={true}/>
                    {/* 보내기 버튼 */}
                    <TouchableOpacity style = {sendDisabled ? disabledSendButtonStyle : styles.sendButton}
                                        disabled = {sendDisabled}
                                        onPress = { onPressSendButton } >
                        <Ionicons name="ios-send" size={18} color="white" />
                    </TouchableOpacity>
                    {/* 이미지 보내는 버튼 */}
                    <TouchableOpacity style = {styles.imageButton}
                                        onPress = {onPressImageButton} >
                        <Feather name="image" size={24} color="#5471ff" />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }, [modalVisible, loading, chat, sendMessage, messages, onChangeText, text, sendDisabled, onPressSendButton, user, onPressImageButton, sendImageMessage])

    
    

    const Message = ({name, message, createdAt, isOtherMessage}) => {
        const messageStyles = isOtherMessage ? otherNessageStyles : msgStyles; 
    
        const renderMessage = useCallback(() => {
            console.log(message)
            if ("text" in message) {
                return <Text style = {messageStyles.messageText}>{message.text}</Text>
            }
            if ("url" in message ) {
                return (
                    <TouchableOpacity onPress={()=>{setModalVisible(message.url)}}>
                        <Image style = {{width : 100, height : 100}} source = {{uri : message.url}} />
                    </TouchableOpacity>
                )
            }
        }, [message, messageStyles.messageText] )
    
        const components = [
            <Text key = "timeText" style = {messageStyles.timeText}>{moment(createdAt).format("HH:mm")}</Text>,
            <View key = "message" style = {messageStyles.bubble}>
                {renderMessage()}
            </View>,
        ];
    
        const renderMessageContainer = useCallback(() => {
            return isOtherMessage ? components.reverse() : components;
        
        }, [createdAt, renderMessage, messageStyles, isOtherMessage])
    
        return (
            <View style = {messageStyles.container}>
                <Text style = {msgStyles.nameText}>{name}</Text>
                <View style = {msgStyles.renderMessageContainer}>
                    {renderMessageContainer()}
                </View>    
            </View>
        )
    }


    return (
        <View style = {styles.container}>
            {
                loading ? (
                    <Loading show={loading}/>
                ) : (
                    renderChat()
                )
            }
            <Modal transparent={true}
                    visible={modalVisible!==''}
                    onRequestClose={()=>setModalVisible('')}
                    animationType='fade' >
                <Pressable onPress={()=>setModalVisible('')} style={{flex:1}}>
                    <View style={{backgroundColor:'white', opacity:0.6, position:'absolute', width:'100%', height:'100%'}}/>
                    <View style={{justifyContent:'center', alignItems:'center', position:'absolute', width:'100%', height:'100%'}}>
                        <Image source={{uri:modalVisible}} style={{resizeMode:'contain', width:'90%', minHeight:'80%'}}/>
                    </View>
                </Pressable>
            </Modal>
        </View>
    )
};

const msgStyles = StyleSheet.create({
    container : {
        marginBottom : 10,
        alignItems : "flex-end",
    },
    nameText : {
        fontSize : 12,
        color : "gray",
        marginBottom : 4,
    },
    renderMessageContainer : {
        flexDirection : "row",
        alignItems : "flex-end",
    },
    timeText : {
        fontSize : 12,
        color : "gray",
        marginRight : 4,
    },
    bubble : {
        borderWidth:1, 
        borderColor:'#5471ff',
        backgroundColor : "#5471ff",
        borderRadius : 12,
        padding : 12,
        flexShrink : 1,
    },
    messageText : {
        fontSize : 14,
        color : "white",
    }
});

// 다른 유저일 때 사용되는 STYLE
const otherNessageStyles = {
    container : [msgStyles.container, { alignItems : "flex-start" }],
    bubble : [msgStyles.bubble, { backgroundColor : "white"}],
    messageText : [msgStyles.messageText, {color : "black"}],
    timeText : [msgStyles.timeText, {marginRight : 0, marginLeft : 4}],
};

export default Chat;