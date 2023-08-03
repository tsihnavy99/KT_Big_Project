import React, { useRef, useEffect } from "react";
import { View, Text, Image } from "react-native";
import StyledButton from "../components/StyledButton";
import styles from '../styles';
import { Animated, Easing } from "react-native";
import { LogBox } from "react-native";
LogBox.ignoreAllLogs();

const FirstScreen = ({navigation}) => { 
    const animValue = useRef(new Animated.Value(0)).current  

    useEffect(()=>{
        Animated.loop(
            Animated.timing(animValue, {
                duration: 5000,
                toValue: 1,
                useNativeDriver: false,
                easing:Easing.linear//exp //linear
            })
        ).start()
    }, [])

    const scale = animValue.interpolate({
        inputRange:[0, 0.5, 1],
        outputRange:[0.8, 1.3, 0.8]
    })
    
    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.title}>당신의 올바른 복약을 {'\n'}<Text style={{color:'#5471FF', fontSize:36}}>약쏙</Text> 드립니다.</Text>
                <Text style={{fontSize:16}}>당신의 건강을 보호해줄 인공지능 복약지도 {'\n'}플랫폼 약쏙</Text>
            </View>
            <View style={styles.logoContainer}>
                <View style={styles.dummyView} />
                <Animated.View style={{justifyContent:'center', alignItems:'center', width:'100%', height:'100%', transform:[{scale:scale}]}}>
                    <Image source={require('../assets/main_logo.png')} style={{resizeMode:'contain', width:'60%', height:'80%'}}/>
                </Animated.View>
                <View style={styles.dummyView} />
            </View>
            <View style={styles.bottomBtn}>
                <StyledButton
                    title="로그인"
                    onPress={() => navigation.navigate('LoginScreen')}/>
                <Text style={styles.link}onPress={() => navigation.navigate('SelectAdmin')}>회원가입</Text>
            </View>
        </View>
    )
}

export default FirstScreen;