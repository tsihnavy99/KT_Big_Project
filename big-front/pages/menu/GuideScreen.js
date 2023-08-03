import { View, Text } from "react-native-animatable"
import { FontAwesome5 } from "@expo/vector-icons"
import { ScrollView, StyleSheet } from "react-native";
import { LogBox } from "react-native";
LogBox.ignoreAllLogs();

const GuideScreen = () => {
    return (
        <View style={{flex:1, backgroundColor:'#f5f7ff', paddingHorizontal:'3%', paddingVertical:'4%'}}>
            <Text style={{fontSize:30, fontWeight:'bold', marginBottom:10, paddingHorizontal:'3%'}}>
                <FontAwesome5 name='question-circle' size={30}/> 사용 가이드
            </Text>
            <ScrollView style={{backgroundColor:'white', borderRadius:6, paddingHorizontal:'4%', paddingVertical:'2%'}}>
                <View style={{flex:1, marginVertical:10}}>
                    <Text style={styles.title}>메인 화면</Text>
                    <View>
                        <Text style={styles.subTitle}>1. 처방전 등록</Text>
                        <View style={styles.contentContainer}>
                            <Text style={styles.contentText}>- 업로드 하는 처방전 사진은 상단에 '처방전'이라는 글자가 보여야합니다.</Text>
                            <Text style={styles.contentText}>- 또한 처방전 내의 알약 명이 선명하게 보여야 합니다.</Text>
                        </View>
                    </View>
                    <View>
                        <Text style={styles.subTitle}>2. 알약 등록</Text>
                        <View style={styles.contentContainer}>
                            <Text style={styles.contentText}>- 업로드 하는 알약 사진은 크게 나올 수록, 찍힌 알약이 적을 수록 정확도가 높아집니다.</Text>
                            <Text style={styles.contentText}>- 또한 알약의 표면에 있는 문자나 그림이 잘 보일 수록 더 정확한 결과를 얻을 수 있습니다.</Text>
                        </View>
                    </View>
                    <View>
                        <Text style={styles.subTitle}>3. 알약 정보 출력</Text>
                        <View style={styles.contentContainer}>
                            <Text style={styles.contentText}>- 알약 목록이 출력되면 검색하고자 한 알약과 일치하는지 사진과 알약 정보를 통해 확인할 수 있습니다.</Text>
                            <Text style={styles.contentText}>- 만약 다르다면 항목을 길게 눌러 삭제할 수 있습니다.</Text>
                        </View>
                    </View>
                    <View>
                        <Text style={styles.subTitle}>4. 알약 충돌 정보</Text>
                        <View style={styles.contentContainer}>
                            <Text style={styles.contentText}>- 기존 알약 등록을 통해 저장했던 알약과 새로 등록하려는 알약들 사이 병용 금기 항목이 발견되면 경고를 보여줍니다.</Text>
                            <Text style={styles.contentText}>- 충돌되는 알약을 먹지 않을거라면 길게 눌러 삭제할 수 있습니다.</Text>
                            <Text style={styles.contentText}>- 자세하게 알고싶은 부분이 있다면 상담하기를 눌러 약사와의 1:1 상담 화면으로 이동할 수 있습니다.</Text>
                        </View>
                    </View>
                </View>
                <View style={{flex:1, marginVertical:10}}>
                    <Text style={styles.title}>뉴스 및 QnA 화면</Text>
                    <View>
                        <Text style={styles.subTitle}>1. 뉴스</Text>
                        <View style={styles.contentContainer}>
                            <Text style={styles.contentText}>- 기본적으로는 회원가입 시 등록한 질병들과 관련된 뉴스 기사를 불러옵니다.</Text>
                            <Text style={styles.contentText}>- 검색을 통해 원하는 뉴스 키워드를 검색할 수 있습니다.</Text>
                        </View>
                    </View>
                    <View>
                        <Text style={styles.subTitle}>2. QnA</Text>
                        <View style={styles.contentContainer}>
                            <Text style={styles.contentText}>- 질문 등록 시 약사에게 답변을 받을 수 있습니다.</Text>
                            <Text style={styles.contentText}>- 다른 사람들의 질문과 답변 또한 확인할 수 있습니다.</Text>
                            <Text style={styles.contentText}>- 검색 및 답변 받은 질문 필터링을 통해 원하는 정보를 얻을 수 있습니다.</Text>
                            <Text style={styles.contentText}>- QnA에 등록했던 글은 메뉴 화면의 '내가 쓴 글 보기'에서 다시 검색해서 답변을 확인할 수 있습니다.</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize:20, 
        fontWeight:'bold', 
        marginBottom:6
    },
    subTitle: {
        fontSize:16, 
        marginVertical:6,
        backgroundColor: '#f5f7ff',
        borderRadius:10
    },
    contentContainer: {
        paddingHorizontal:10, 
        marginBottom:8
    },
    contentText: {
        marginBottom:4
    }
})

export default GuideScreen