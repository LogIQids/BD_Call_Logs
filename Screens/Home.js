import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/Ionicons';
import Icon3 from 'react-native-vector-icons/Feather';
import * as actions from '../actions';
import {connect} from 'react-redux';
import firestore from '@react-native-firebase/firestore';


const user = require('../assets/user.png');

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: null,
    };
  }
  async componentDidMount() {
    this.fetchdata();
    this._unsubscribe = this.props.navigation.addListener('focus', () => this.fetchdata());
  }
  componentWillUnmount() {
    this._unsubscribe()
  }
  fetchdata = () => {
    const uid = this.props.login?.uid;
    firestore()
      .collection('Posts')
      .get()
      .then(querySnapshot => {
        console.log('Total users: ', querySnapshot);
        let posts = [];
        querySnapshot.forEach(documentSnapshot => {
          posts.push({id: documentSnapshot.id, ...documentSnapshot.data()});
          console.log('posts', posts);
          this.setState({posts: posts});
        });
      });
  };
  onLikePress = id => {
    const uid = this.props.login?.uid;

    firestore()
      .collection('Posts')
      .doc(id)
      .update({
        likeCount: firestore.FieldValue.increment(1),
        likeArray: firestore.FieldValue.arrayUnion(uid),
      })
      .then(() => {
        this.fetchdata();
      });
  };
  onUnLikePress = id => {
    const uid = this.props.login?.uid;
    firestore()
      .collection('Posts')
      .doc(id)
      .update({
        likeCount: firestore.FieldValue.increment(-1),
        likeArray: firestore.FieldValue.arrayRemove(uid),
      })
      .then(() => {
        this.fetchdata();
      });
  };
  render() {
    const {posts} = this.state;
    const uid = this.props.login?.uid;

    return (
      <View style={{flex: 1}}>
        <View style={styles.top}>
          <Text style={styles.label}> Home</Text>
          <Icon3
            name="send"
            size={24}
            color="#000"
            onPress={() => this.props.navigation.navigate('Users')}
          />
        </View>
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.contentView}>
              {posts?.map(post=> (
                <View style={[styles.post, {marginTop: 10}]} key={post?.id}>
                  <View style={styles.postHeader}>
                    {post.profileImg?.length>0?<Image
                      style={styles.postUserImage}
                      source={{
                        uri: post.profileImg,
                      }}
                    />
                    :
                    <Image
                      style={styles.postUserImage}
                      source={user}
                      resizeMode='contain'
                    />}
                    <Text style={styles.postUsernameText}>{post.username}</Text>
                  </View>
                  <View style={styles.postContent}>
                    <Image
                      style={styles.postImage}
                      source={{
                        uri: post.image,
                      }}
                    />
                  </View>
                  <View style={styles.postActions}>
                    <View style={styles.postActionsLeftView}>
                      <TouchableOpacity
                        onPress={() =>
                          post.likeArray?.includes(uid)
                            ? this.onUnLikePress(post.id)
                            : this.onLikePress(post.id)
                        }
                        style={[styles.postActionIcon, {paddingLeft: 0}]}>
                        <Icon
                          name={
                            post.likeArray?.includes(uid) ? 'heart' : 'hearto'
                          }
                          size={30}
                          color={post.likeArray?.includes(uid) ? 'red' : '#000'}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.postActionIcon}
                        onPress={() =>
                          this.props.navigation.navigate('Comment', {
                            postId: post.id,
                            comments: post.commentArray,
                          })
                        }>
                        <Icon2
                          name="ios-chatbubble-outline"
                          size={30}
                          color="#000"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.postDescView}>
                    <Text style={styles.likeCount}>{post.likeCount} likes</Text>
                    <View style={styles.postDescTextView}>
                      <Text style={styles.postDescUsernameText}>
                        {`${post.username}`}
                        <Text
                          style={
                            styles.postDescText
                          }>{` ${post.caption}`}</Text>
                      </Text>
                    </View>
                    {post.commentArray?.length>0?<Text style={styles.likeCount}>{post.commentArray.length} comments</Text>:null}

                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    login: state.login,
  };
}

export default connect(mapStateToProps, actions, null)(Home);

const styles = StyleSheet.create({
  container: {},
  contentView: {
    marginTop: 4,
  },
  post: {
    borderWidth: 1,
    borderColor: '#f1f3f6',
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 10,
    alignItems: 'center',
  },
  label: {
    color: '#000',
    fontSize: 22,
    fontWeight: 'bold',
  },
  likeCount: {
    color: '#000',
  },
  postHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#dfe4ea',
    borderTopColor: '#dfe4ea',
    backgroundColor: '#fff',
  },
  postUserImage: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  postUsernameText: {
    flex: 1,
    marginLeft: 10,
    color: '#000',
  },
  postContent: {
    backgroundColor: '#fafafa',
  },
  postImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width,
    resizeMode: 'contain',
  },
  postActions: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#dfe4ea',
    paddingVertical: 10,
    paddingHorizontal: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  postActionsLeftView: {
    display: 'flex',
    flexDirection: 'row',
  },
  postActionIcon: {
    paddingHorizontal: 6,
  },
  postDescView: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#dfe4ea',
  },
  postDescText: {
    fontSize: 16,
    fontWeight: '300',
  },
  postDescUsernameText: {
    fontWeight: 'bold',
    marginTop: 6,
    fontSize: 16,
    color: '#000',
  },
});
