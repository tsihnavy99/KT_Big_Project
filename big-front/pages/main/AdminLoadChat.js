import { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore'
import { API_URL_CHAT_LIST } from '@env'
import _ from "lodash";

const getChatKey = (userIds) => {
    return _.orderBy(userIds, userId => userId, "asc")
}

const AdminLoadChat = (userInfo) => {
    const [ adminLoading, setAdminLoading ] = useState(true)
    const [ djangoUsers, setDjangoUsers ] = useState([]);
    const [ allData, setAllUsers ] = useState([]);
    const user_id = userInfo.user_id
    const [chatList, setChatList] = useState([])

    useEffect(()=>{
        login()
    }, [])

    useEffect(()=>{
        if(djangoUsers.length>0){
            console.log(djangoUsers.length)
            loadUserChatList()
        }
    }, [djangoUsers])

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
                            setDjangoUsers(data.filter(u => u.admin === false ));
                            setAllUsers(data);
                        });
                })
        } catch(error) {
            console.error(error);
        }
    }

    const loadUserChatList = async() => {
        const user = user_id
        try {
            // testchat에서 userids와 일치하는 방을 불러오기
            const newChatList = []
            for(let u of djangoUsers) {
                const chatSnapshot = await firestore().collection("Test7Chats").where('userIds', "==", getChatKey([user, u.user_id])).get();
                    
                if(chatSnapshot.docs.length>0) {
                    const doc = chatSnapshot.docs[0]
                    
                    newChatList.push({
                        id: doc.id,
                        userIds: doc.data().userIds,
                        users: doc.data().users,
                    })
                }
            }

            if(newChatList.length>0) {
                setChatList(newChatList)
                setAdminLoading(false)
            }
        } catch(error) {
            console.log(error)
        }
    }

    return {chatList, adminLoading, allData}
}

export default AdminLoadChat