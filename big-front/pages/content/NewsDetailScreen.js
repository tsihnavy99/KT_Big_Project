import React, { useCallback } from 'react'
import { View } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import Webview from "react-native-webview"
import { LogBox } from "react-native";
LogBox.ignoreAllLogs();

export default function NewsDetailScreen() {
    const navigation = useNavigation();
    const routes = useRoute();

    const onPressBack = useCallback(() => {
        navigation.goBack();
    }, [])
    
  return (
    <View style={{flex:1}}>
        <Webview 
            style = {{flex:1}}
            source = {{uri : routes.params.item.link}}
        />
    </View>
  )
}