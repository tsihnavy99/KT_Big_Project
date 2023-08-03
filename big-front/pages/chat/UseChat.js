import { useCallback, useState,useEffect } from "react";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import _ from "lodash";

// userids 정렬
const getChatKey = (userIds) => {
    return _.orderBy(userIds, userId => userId, "asc")
}

const UseChat = (userIds, allData) => {
    
    // 채팅방
    const [ chat, setChat ] = useState("");

    //  채팅방 로딩
    const [ loadingChat, setLoadingChat ] = useState(false);

    // 필터링된 데이터
    const [ filterdUser, setFilterdUser ] = useState([])

    // 로딩
    const [ filterLoading, setFilterLoading ] = useState(true);

    // 메세지 저장 state
    const [ messages, setMessages ] = useState([])

    const [ sending, setSending ] = useState(false)

    const [ loadingMessages, setLoadingMessages ] = useState(false)

    // 유저 필터링
    const filtered = () => {
        //  전체 데이터에서 채팅방에 들어온  userdata만 filtering
        const usersSnapshot = allData.filter(user => userIds.includes(user.user_id));
        setFilterdUser(usersSnapshot)
        setFilterLoading(false)
    }

    // 채팅 로드
    const loadChat = useCallback(async (users) => {
        
        try {
            setLoadingChat(true)
            
            // testchat에서 userids와 일치하는 방을 불러오기
            const chatSnapshot = await firestore().collection("Test7Chats").where("userIds", "==", getChatKey(userIds)).get();
  
            // 만약 그런 방이 없으면 새로생성
            if (chatSnapshot.docs.length > 0) {
                const doc = chatSnapshot.docs[0];
                
                setChat({
                    id : doc.id,
                    userIds : doc.data().userIds,
                    users : doc.data().users,
                });
                return;
            }

            // 입력할 데이터
            const data = {
                userIds : getChatKey(userIds),
                users,
            }
            
            // 데이터 추가 
            const doc = await firestore().collection("Test7Chats").add(data);
            setChat({
                id : doc.id,
                ...data,
            })
            } finally {
                setLoadingChat(false);
            }
    }, [userIds]);

    useEffect(() => {
        console.log("start")
        filtered();
    }, [userIds]);

    useEffect(() => {
        if ( filterLoading == false ) {
            loadChat(filterdUser);
        }


    }, [filterLoading, filterdUser, loadChat]);
    
    // 메세지 보내는 함수
    // text 와 user 정보를 받음
    const sendMessage = useCallback( async (text, user) => {
        try{
            setSending(true);

            // 저장할 데이터
            // text, user 정보, 보낸날짜 저장
            const data = {
                text : text,
                user : user,
                imageUrl : null,
                createdAt : new Date(), 
            };

            // test7chats에 저장되어있는 id 접근하고 Messages 데이터 베이스를 새로만들어 data를 저장
            const doc = await firestore()
                            .collection("Test7Chats")
                            .doc(chat.id)
                            .collection("Messages")
                            .add(data);
            
            // 이전 메세지와 합쳐서 저장
            setMessages(prevMessages => 
                [
                    {
                        id : doc.id,
                        ...data,
                    }
                ].concat(prevMessages),
            )
        } finally {
            setSending(false);
        }
    }, [chat.id]);

    // message load
    const loadMessages = useCallback( async (chatId) => {
        try {
            setLoadingMessages(true)
            // 메세지를 정렬해서 반환
            const messagesSnapshot = await firestore()
                                            .collection("Test7Chats")
                                            .doc(chatId)
                                            .collection("Messages")
                                            .orderBy("createdAt", "desc")
                                            .get();

            const ms = messagesSnapshot.docs.map(doc => {
                const data = doc.data();

                return {
                    id : doc.id,
                    user : data.user,
                    text : data.text ?? null,
                    imageUrl : data.imageUrl ?? null,
                    createdAt : data.createdAt.toDate(),
                }
            })
            setMessages(ms);
        } finally {
            setLoadingMessages(false)
        }
    }, [])

    useEffect(() => {
        loadMessages(chat.id);
    }, [chat.id, loadMessages])

    //  이미지 보내는 함수
    //  filepath와 보낸 user를 인수로 받음
    const sendImageMessage = useCallback(async (filepath, user) => {
        setSending(true);
        try {
            if ( user == null) {
                throw new Error("Undefined user")
            }

            const originalFilename = _.last(filepath.split('/'));
            if (originalFilename == null) {
                throw new Error("Undefined filename");
            }

            // originalFilename aaa.png -> date.png
            const fileExt = originalFilename.split(".")
            const filename = `${Date.now()}.${fileExt}`

            const storagePath = `chat/${chat.id}${filename}`;
            await storage().ref(storagePath).putFile(filepath);
            const url = await storage().ref(storagePath).getDownloadURL();

            const doc = 
            await firestore()
                    .collection("Test7Chats")
                    .doc(chat.id)
                    .collection("Messages")
                    .add({
                        imageUrl : url,
                        user : user,
                        text : null,
                        createdAt: firestore.FieldValue.serverTimestamp(),
                    });

            setMessages(prevMessages => 
                [
                    {   
                        id : doc.id,
                        text : null,
                        imageUrl : url,
                        user : user,
                        createdAt: new Date()
                    }
                ].concat(prevMessages),
            )

        } finally {
            setSending(false);
        }
    }, [chat, setMessages])

    // chat(채팅방)과 loading(채팅이 로딩되었는지)를 반환 
    return {
        chat,
        loadingChat,
        sendMessage,
        messages,
        sending,
        loadingMessages,
        sendImageMessage,
    };
}

export default UseChat;