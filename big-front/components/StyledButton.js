import { useCallback, useRef } from "react";
import { TouchableOpacity, Text } from "react-native";
import { Animated } from "react-native";

const StyledButton = ({title, onPress, disabled=false, withInput=false, withBtn=false, isCancle=false}) => {
    const btnColor = disabled ? 'gray' : isCancle?'#FFE1E1':'#5471ff';  // 비활성 버튼은 회식
    const animValue = useRef(new Animated.Value(0)).current  // 버튼 애니메이션(눌렀을 때 작아짐)

        const onPressIn = useCallback(()=>{
            Animated.timing(animValue, {
                duration: 100,
                toValue: 1,
                useNativeDriver:false ,
            }).start()
        })

        const onPressOut = useCallback(()=>{
            Animated.timing(animValue, {
                duration: 200,
                toValue: 0,
                useNativeDriver:false,
            }).start()
        })

        const scale = animValue.interpolate({
            inputRange:[0, 1],
            outputRange:[1.0, 0.9]
        })

    return (
        <Animated.View style={{transform:[{scale:scale}], width:withBtn?'45%':null}}>
            <TouchableOpacity
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: withBtn?40:18,
                    paddingVertical: withBtn?12:withInput?0:12,
                    borderRadius: 6,
                    elevation: 2,
                    backgroundColor: btnColor,
                    width: '100%',
                    marginVertical: withInput?0:10,
                    flex: withInput?1:null,
                    maxHeight: withInput?50:null,
                    borderWidth:isCancle?1:0,
                    borderColor:isCancle?'#f25555':'#5471FF'
                
                }}
                onPress={onPress}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                disabled={disabled}>
                <Text style={{
                    color:  isCancle?'black':'white',
                    fontSize: withBtn?18:withInput?14:24,
                    fontWeight: withBtn?'bold':'normal'
                }}>{title}</Text>
            </TouchableOpacity>
        </Animated.View>
    )
}

export default StyledButton;