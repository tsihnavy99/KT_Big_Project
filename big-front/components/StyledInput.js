import React, { useRef, forwardRef } from "react";
import { TextInput } from "react-native-paper";

const StyledInput = forwardRef((props, ref) => {
    const {value, onChangeText, placeholder, inputMode='text', onSubmitEditing=null,
            secureTextEntry=false, maxLength=undefined, disabled=false, left=null,
            autoFocus=false, returnKeyType='default', withBtn=false, render=undefined,
            blurOnSubmit=true, multiline=false, numberOfLines=null, right=null} = props
    return (
        <TextInput value={value} 
            onChangeText={onChangeText} 
            mode='outlined' 
            placeholder={placeholder}
            onSubmitEditing={onSubmitEditing}
            left={left}
            right={right?right:value===''||disabled?null:<TextInput.Icon icon='window-close' onPress={()=>onChangeText('')}/>} 
            activeOutlineColor="#5471FF"
            returnKeyType={returnKeyType}
            style={{flex:withBtn?5:null, marginRight:withBtn?6:0}}
            outlineColor='#5471ff'
            inputMode={inputMode}
            secureTextEntry={secureTextEntry}
            render={render}
            disabled={disabled}
            autoFocus={autoFocus}
            maxLength={maxLength}
            blurOnSubmit={blurOnSubmit}
            ref={ref}
            multiline={multiline}
            numberOfLines={numberOfLines} />
    )
})

export default StyledInput;