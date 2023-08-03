import { useEffect, useRef } from "react"
import { View, Image } from "react-native-animatable"
import { Animated, Easing } from "react-native"

const Loading = ({show}) => {
    const animValue = useRef(new Animated.Value(0)).current

    useEffect(()=>{
        Animated.loop(
            Animated.timing(animValue, {
                duration: 2100,
                toValue: 1,
                useNativeDriver: false,
                easing:Easing.ease
            })
        ).start()
    }, [])

    const rotateZ = animValue.interpolate({
        inputRange:[0, 0.3, 0.8, 1],
        outputRange:['0deg', '180deg', '330deg', '360deg']
    })

    const scale = animValue.interpolate({
        inputRange:[0, 0.5, 1],
        outputRange:[1, 1.2, 1]
    })

    return (
        <View style={{alignItems:'center', justifyContent:'center', flex:1, position:'absolute', display:show?'flex':'none', top:0, left:0, right:0, bottom:0, zIndex:10}}>
            <Animated.View style={{transform:[{rotateY:rotateZ}, {scale:scale}], zIndex:12}}>
                <Image source={require('../assets/main_logo.png')} style={{width:120, height:100, opacity:1}}/>
            </Animated.View>
            <View style={{opacity:0.6, backgroundColor:'white', position:'absolute', zIndex:11, top:0, left:0, right:0, bottom:0, flex:1}}/>
        </View>
    )
}

export default Loading