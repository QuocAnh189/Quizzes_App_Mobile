//Library
import {
    StyleSheet,
    View,
    FlatList,
    ActivityIndicator,
    Image,
    Text,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';

//redux
import { useDispatch, useSelector } from 'react-redux';

//filter
import filter from 'lodash.filter';

//component
import BoxQuiz from '../BoxQuiz';

const QuizFilter = ({ navigation }) => {
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const [data, setData] = useState();
    const [result, setResults] = useState([]);
    const [showData, setShowData] = useState(true);
    const userData = useSelector((state) => state.auths?.authData);
    const searchQuery = useSelector((state) => state.searchs.searchQuery);
    const accessToken = userData?.data?.accessToken;

    const quizes = useSelector((state) => state.quizs.allquizes);

    const userInfo = useSelector((state) => state.auths?.user);
    const userType = userInfo?.userType;

    useEffect(() => {
        if (quizes) {
            setData(quizes);
        }
    }, [quizes]);

    useEffect(() => {
        if (isFocused && data) {
            setShowData(false);
            const contains = ({ name, creatorName }, query) => {
                if (
                    name?.toLowerCase().includes(query) ||
                    creatorName?.toLowerCase().includes(query)
                ) {
                    return true;
                }
                return false;
            };

            const fotmatQuery = searchQuery.toLowerCase();
            const filterData = filter(data, (quiz) => {
                return contains(quiz, fotmatQuery);
            });
            setResults(filterData);
        }
    }, [searchQuery]);

    return (
        <View style={styles.container}>
            {/* {!result.length && <ActivityIndicator size="large" color="#333" />} */}
            {!data && <ActivityIndicator size="large" color="#333" />}
            {result.length === 0 && !showData && (
                <View style={{ alignItems: 'center' }}>
                    <Image
                        source={{
                            uri: 'https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg//assets/a60759ad1dabe909c46a817ecbf71878.png',
                        }}
                        resizeMode="cover"
                        style={{ width: 100, height: 100 }}
                    />
                    <Text style={{ color: '#333' }}>No results found</Text>
                </View>
            )}
            <FlatList
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item._id}
                data={showData ? data : result}
                refreshing
                renderItem={({ item }) => (
                    <BoxQuiz
                        key={item}
                        quizData={item}
                        navigation={navigation}
                        mylibrary={false}
                        direct="DetailQuiz"
                        discover={true}
                        userType={userType}
                    />
                )}
            />
        </View>
    );
};

export default QuizFilter;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        display: 'flex',
        padding: 15,
        marginBottom: 70,
    },
});
