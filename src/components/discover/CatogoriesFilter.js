//Library
import {
    StyleSheet,
    ScrollView,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    Image,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';

//constant
import { categories } from 'src/constants/category.constant';

//redux
import { useSelector } from 'react-redux';

//filter
import filter from 'lodash.filter';

//Component
import BoxQuiz from '../BoxQuiz';
import CategoryCard from '../CategoryCard';

const CatogoriesFilter = ({ navigation }) => {
    const userInfo = useSelector((state) => state.auths?.user);
    const userType = userInfo?.userType;

    const searchQuery = useSelector((state) => state.searchs.searchQuery);
    const [result, setResults] = useState([]);
    const [searchs, setSearchs] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);
    const [listQuiz, setListQuiz] = useState([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        setShowQuiz(false);
    }, []);

    useEffect(() => {
        if (isFocused) {
            const contains = ({ name }, query) => {
                if (name.toLowerCase().includes(query)) {
                    return true;
                }
                return false;
            };

            const fotmatQuery = searchQuery.toLowerCase();
            const filterData = filter(categories, (category) => {
                return contains(category, fotmatQuery);
            });
            setResults(filterData);
            setSearchs(true);
        }
    }, [searchQuery, isFocused]);

    const showListQuiz = (quizCate) => {
        setListQuiz(quizCate);
        setShowQuiz(true);
    };

    return !showQuiz ? (
        <ScrollView showsVerticalScrollIndicator={false}>
            {/* {!listQuiz.length && (
                <View style={styles.viewLoading}>
                    <ActivityIndicator size="large" color="#fff" />
                </View>
            )} */}
            <View style={styles.categoryContain}>
                {result?.length
                    ? result.map((category) => (
                          <CategoryCard
                              width="46%"
                              key={category.name}
                              category={category}
                              activeCategory={true}
                              showQuiz={(quizCate) => showListQuiz(quizCate)}
                          />
                      ))
                    : searchs && (
                          <View style={{ alignItems: 'center' }}>
                              <Image
                                  source={{
                                      uri: 'https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg//assets/a60759ad1dabe909c46a817ecbf71878.png',
                                  }}
                                  resizeMode="cover"
                                  style={{ width: 100, height: 100 }}
                              />
                              <Text style={{ color: '#333' }}>
                                  No results found
                              </Text>
                          </View>
                      )}
            </View>
        </ScrollView>
    ) : (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => setShowQuiz(false)}>
                <View style={styles.viewBack}>
                    <Text style={{ color: 'white' }}>Back</Text>
                </View>
            </TouchableOpacity>
            <FlatList
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item._id}
                data={listQuiz}
                refreshing
                renderItem={({ item }) => (
                    <BoxQuiz
                        key={item}
                        quizData={item}
                        navigation={navigation}
                        mylibrary={false}
                        direct="DetailQuiz"
                        userType={userType}
                    />
                )}
            />
        </View>
    );
};

export default CatogoriesFilter;

const styles = StyleSheet.create({
    viewLoading: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryContain: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingTop: 20,
        gap: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 100,
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        display: 'flex',
        padding: 15,
        marginBottom: 50,
    },

    viewBack: {
        width: '12%',
        backgroundColor: '#8F87E5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        borderRadius: 5,
    },
});
