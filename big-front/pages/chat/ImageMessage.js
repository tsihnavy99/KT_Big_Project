import React, { useState } from "react";
import { Modal, Pressable, StyleSheet } from "react-native";
import { Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const styles = StyleSheet.create({
    image : {
        width : 200,
        height : 200,
    }
});

const ImageMessage = ({url}) => {
    const [modalVisible, setModalVisible] = useState(false)

    return (
        <TouchableOpacity onPress={()=>{console.log('!!');setModalVisible(true)}}>
            <Modal visible={modalVisible}>
                <Pressable onPress={()=>setModalVisible(false)}>
                    <Image style = {{resizeMode:'contain'}} source = {{url :url}} resizeMode = "contain" />
                </Pressable>
            </Modal>
            <Image style = {styles.image} source = {{url :url}} resizeMode = "contain" />
        </TouchableOpacity>
    )
};

export default ImageMessage;