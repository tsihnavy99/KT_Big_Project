import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import styles from "../../styles";
import { FontAwesome } from "@expo/vector-icons";
import { LogBox } from "react-native";
LogBox.ignoreAllLogs();

const UserInfoScreen = ({route, navigation}) => {
    const userInfo = route.params.userInfo
    const list = {name:'이름', gender:'성별', user_id:'ID', pw:'비밀번호'
                , phone:'전화번호', birthdate:'생년월일', disease:'질병'
                , has_surgery:'수술이력', user_specialnote:'특이사항'
                , pharmacy:'운영약국'}

    const printUserInfo = () => {
        let array = [];
        console.log(userInfo)
        
        for(let val in userInfo) {
            if(val==='id'||val==='admin'||val==='user_pill'||val==='dt_created'||val==='dt_modified'||val==='pw') {
                continue
            }
            
            if(val==='gender') {
                array.push(
                    <Text key={val} style={infoStyles.infoText}>{list[val]} : {userInfo[val]==='M'?'남성':'여성'}</Text>
                )
            } else if(val==='disease') {
                if(userInfo.admin) continue
                array.push(
                    <Text key={val} style={infoStyles.infoText}>{list[val]} : {eval(userInfo[val]).length>0?eval(userInfo[val]).join(', '):'없음'}</Text>
                )
            } else if(val==='user_specialnote') {
                if(userInfo.admin) continue
                array.push(
                    <Text key={val} style={infoStyles.infoText}>{list[val]} : {typeof(userInfo[val])==='string'?userInfo[val]:userInfo[val].length>0?eval(userInfo[val]).join(', '):'없음'}</Text>
                )
            } else if(userInfo.admin&&val==='has_surgery') {
                continue
            } else if(userInfo[val]==='') {
                continue            
            } else {
                array.push(
                    <Text key={val} style={infoStyles.infoText}>{list[val]} : {userInfo[val]?userInfo[val]:'없음'}</Text>
                )
            }
        }
        return array;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.inputInfo}>내 정보</Text>
            <View style={styles.dummyView}/>
            <View style={styles.logoContainer}>
                <View style={{backgroundColor:'white', borderRadius:100, width:180,height:180, justifyContent:'center', alignItems:'center'}}>
                    {userInfo.admin?<FontAwesome name="user-md" size={150}/>:<FontAwesome name='user' size={100}/>}
                </View>
            </View>
            <View style={styles.dummyView} />
            <View style={styles.inputContainer}>
                <View style={{backgroundColor:'white', paddingVertical:16, paddingHorizontal:22, borderRadius:10, elevation:1}}>
                {(() => (printUserInfo()))()}
                </View>
            </View>
        </View>
    )
}

const infoStyles = StyleSheet.create({
    infoText: {
        fontSize: 20,
        marginVertical: 6,
    }
})

export default UserInfoScreen;