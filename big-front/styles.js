import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f7ff',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        paddingVertical: '6%',
        paddingHorizontal: '6%'
    },
    title: {
        fontSize: 28,
        marginTop: '20%',
        marginBottom: 10,
        fontWeight: 'bold'
    },
    logoContainer: {
        alignItems: "center",
        justifyContent: 'space-evenly',
        flex: 3,
    },
    logo: {
        alignItems: 'center',
        width: 100,
        height: 100,
        marginBottom:30
    },
    progressBarContainer: {
        height: 60,
        justifyContent:'center'
    },
    inputWithBtn: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    bottomBtn: {
    },
    linkBox: {
        flexDirection:'row',
        justifyContent:'center'
    },
    inputInfoContainer: {
        marginTop: '0%',
        marginBottom: '4%'
    },
    inputInfo: {
        fontSize: 24,
        fontWeight: 400
    },
    inputTitle: {
        fontSize: 16,
        fontWeight: 400,
        marginVertical: 6
    },
    link: {
        borderBottomWidth: 1,
        alignSelf: 'center',
        paddingBottom: 4,
        paddingHorizontal: 2,
        marginTop: 10,
        borderColor:'#5D5F64'
    },
    inputContainer: {
        justifyContent:'center',
        alignItems: 'stretch',
        marginTop: '0%',
        paddingVertical: 10,
    },
    selectBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
        elevation: 3,
        backgroundColor: 'black',
        height: '38%',
        marginVertical: 10
    },
    selectBtnText: {
        color: 'white',
        fontSize: 18,
        marginTop: 10
    },
    selectIcon: {
        marginBottom: 16,
        width: 80,
        height: 80
    },
    regexText: {
        color: '#e10000',
    },
    dummyView: {
        flex:1
    },
    scrollBtn: {
        backgroundColor: '#5471FF',
        padding: 14,
        borderRadius: 100,
        position: 'absolute',
        bottom: '2%',
        left: '4%',
        elevation:4
    },
    itemContainer: {
        paddingVertical: 10,
        borderRadius: 6,
        marginVertical:6,
        paddingHorizontal:14,
        backgroundColor:'white'
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
});

export default styles;