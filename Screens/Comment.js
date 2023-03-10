import React, {useState} from 'react';
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import {connect} from 'react-redux';
import * as actions from '../actions';

const user = require('../assets/user.png');

class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      commentText: '',
      postId: '',
      comments: [],
    };
  }
  componentDidMount() {
    const params = this.props.route.params;
    console.log('params', params);
    this.setState({comments: params.comments, postId: params.postId});
  }
  fetchdata = () => {
    firestore()
      .collection('Posts')
      .doc(this.state.postId)
      .get()
      .then(querySnapshot => {
        console.log('Total users: ', querySnapshot._data);

        this.setState({
          comments: querySnapshot?._data?.commentArray,
          commentText: '',
        });
      })
      .catch(() =>
        ToastAndroid.show('Something went wrong', ToastAndroid.SHORT),
      );
  };
  postComment = () => {
    firestore()
      .collection('Posts')
      .doc(this.state.postId)
      .update({
        commentArray: firestore.FieldValue.arrayUnion({
          uid: this.props.login?.uid,
          comment: this.state.commentText,
          username: this.props.login?.username,
          image: this.props.login?.profileImg,
          user: this.props.login?.username,
        }),
      })
      .then(() => {
        this.fetchdata();
      })
      .catch(() =>
        ToastAndroid.show('Something went wrong', ToastAndroid.SHORT),
      );
  };
  render() {
    return (
      <View style={{justifyContent: 'space-between', flex: 1}}>
        <View style={styles.topContainer}>
          <View style={styles.top}>
            <Ionicons
              name="chevron-back"
              size={28}
              color="#000"
              onPress={() => this.props.navigation.goBack()}
            />
            <Text style={styles.label}> Comments</Text>
          </View>

          <ScrollView>
            <View style={styles.line} />
            {this.state.comments?.map((data, index) => {
              return (
                <View
                  key={index}
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}>
                  <View style={styles.comment}>
                    {data.image?.length > 0 ? (
                      <Image style={styles.images} source={{uri: data.image}} />
                    ) : (
                      <Image
                        style={styles.images}
                        source={user}
                        resizeMode="contain"
                      />
                    )}
                    <View style={{marginLeft: 10}}>
                      <Text
                        style={{
                          color: '#000',
                          fontWeight: 'bold',
                          fontSize: 13,
                        }}>
                        {data.user}
                      </Text>
                      <Text style={{color: '#000', marginTop: 5, fontSize: 15}}>
                        {data.comment}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.bottom}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              placeholder="Add a comment."
              placeholderTextColor={'#969696'}
              style={styles.input}
              value={this.state.commentText}
              onChangeText={text => this.setState({commentText: text})}
            />
          </View>

          <View>
            {!this.state.commentText.length ? (
              <Text style={{color: '#254253', marginRight: 15}}>Post</Text>
            ) : (
              <Text
                style={{color: '#0096fd', marginRight: 15}}
                onPress={() => this.postComment()}>
                Post
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    login: state.login,
  };
}

export default connect(mapStateToProps, actions, null)(Comment);

const styles = StyleSheet.create({
  label: {
    color: '#000',
    fontSize: 22,
    fontWeight: 'bold',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginTop: 10,
  },
  topContainer: {
    marginTop: 5,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  topComment: {
    marginTop: 20,
    flexDirection: 'row',
    marginLeft: 10,
    alignItems: 'flex-end',
    width: '100%',
  },
  line: {
    borderBottomWidth: 0.3,
    borderBottomColor: '#3a3a3a',
    marginTop: 10,
  },
  bottom: {
    backgroundColor: '#fff',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  image: {
    width: 35,
    height: 35,
    borderRadius: 100,
    marginLeft: 10,
  },
  comment: {
    flexDirection: 'row',
    marginLeft: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  images: {
    width: 35,
    height: 35,
    borderRadius: 100,
    marginLeft: 10,
    marginBottom: 10,
  },
  answer: {
    color: '#aeaeae',
    marginRight: 10,
    fontWeight: 'bold',
    fontSize: 13,
  },
  input: {
    marginLeft: 15,
    fontWeight: '500',
    color: '#000',
  },
});
