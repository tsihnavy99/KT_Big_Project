import { useRef, useCallback } from 'react'
import { Animated } from 'react-native'
import { TouchableOpacity, View, Image, Text } from 'react-native'
import { MaterialIcons } from "@expo/vector-icons";

const MainScreenBtn = ({model='admin', onPress}) => {
    const animValue = useRef(new Animated.Value(0)).current
    
    const btnInfo = {
        'ocr': {
            source: '../../assets/prescription.png',
            title: '처방전 등록할래요',
            content: '처방받은 약을 등록하고 정보를 열람할래요.'
        },
        'pill': {
            source: '../../assets/pill.png',
            title: '알약 등록할래요',
            content: '먹고 있는 약을 등록하고 정보를 열람할래요.'
        }
    }

    const onPressIn = useCallback(()=>{
        Animated.timing(animValue, {
            duration:300,
            toValue: 1,
            useNativeDriver:false,
        }).start()
    })

    const onPressOut = useCallback(()=>{
        Animated.timing(animValue, {
            duration:100,
            toValue: 0,
            useNativeDriver:false,
        }).start()
    })
    
    const color = animValue.interpolate({
        inputRange:[0, 1],
        outputRange:['rgb(245, 247, 255)', 'rgb(230, 235, 255)']
    })
    
    const scale = animValue.interpolate({
        inputRange:[0, 0.1, 1],
        outputRange:[1.0, 0.95, 0.95]
    })

    return (
        <Animated.View style={{backgroundColor:color, transform:[{scale:scale}], flex:1, borderRadius:10, padding:14, elevation:2, marginRight:6}}>
            <TouchableOpacity style={{alignItems:'flex-start'}}
                                onPress={onPress}
                                onPressIn={onPressIn}
                                onPressOut={onPressOut}
                                activeOpacity={1}>        
                <View style={{backgroundColor:'white', padding:4, borderRadius:8}}>
                    {model==='admin'?
                        <MaterialIcons name='question-answer' size={40}/>:
                        <Image source={model==='ocr'?require('../assets/prescription.png'):require('../assets/pill.png')} style={{width:40, height:40}}/>
                    }
                </View>
                <Text style={{fontSize:16, fontWeight:'600', marginTop:12, marginBottom:4}}>
                    {model==='admin'?'상담하기':btnInfo[model].title}
                </Text>
                <Text>
                    {model==='admin'?'복약지도가 필요한 분들과 1:1상담':btnInfo[model].content}
                </Text>
            </TouchableOpacity>
        </Animated.View>
    )
}

export default MainScreenBtn