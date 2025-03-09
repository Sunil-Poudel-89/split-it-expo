import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserGroupsService } from '../../services/groupServices';
import Icon from 'react-native-vector-icons/Ionicons';
import Loading from '../loading'; // Make sure this import is correct
import GroupCards from './groupCards';

export default function Groups() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [group, setGroup] = useState([]);
  const [color] = useState([
    'primary',
    'secondary',
    'error',
    'warning',
    'info',
    'success',
  ]);
  const [profile, setProfile] = useState(null);
  const [emailId, setEmailId] = useState(null);

  useEffect(() => {
    const getUserGroups = async () => {
      setLoading(true);
      try {
        const profileString = await AsyncStorage.getItem('profile');
        if (profileString) {
          const parsedProfile = JSON.parse(profileString);
          setProfile(parsedProfile);
          setEmailId(parsedProfile.emailId);
          const response_group = await getUserGroupsService(parsedProfile);
          setGroup(response_group.data.groups);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    getUserGroups();
  }, []);

  const checkActive = (split) => {
    if (!split || split.length === 0) return false;
    const splitObj = split[0];
    for (const key in splitObj) {
      if (splitObj.hasOwnProperty(key) && Math.round(splitObj[key]) !== 0) {
        return true;
      }
    }
    return false;
  };

  const renderGroupItem = ({ item }) => (
    <TouchableOpacity
      style={styles.groupItem}
      onPress={() => navigation.navigate('ViewGroupPage', { groupId: item._id })}
    >
      <GroupCards
        title={item.groupName}
        description={item.groupDescription}
        groupMembers={item.groupMembers}
        share={item.split && item.split[0] && item.split[0][emailId]}
        currencyType={item.groupCurrency}
        groupCategory={item.groupCategory}
        isGroupActive={checkActive(item.split)}
        color={color[Math.floor(Math.random() * 5)]}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <Loading /> // Correct usage of the Loading component
      ) : (
        <>
          {/* <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('CreateGroupPage')}
          >
            <Icon name="add-circle-outline" size={24} color="#fff" />
          </TouchableOpacity> */}
          <Text style={styles.title}>Your Groups,</Text>
          <FlatList
            data={group}
            renderItem={renderGroupItem}
            keyExtractor={(item) => item._id}
            numColumns={2}
            columnWrapperStyle={styles.row}
          />

          <TouchableOpacity
            style={styles.createGroupCard}
            onPress={() => navigation.navigate('CreateGroupPage')}
          >
            <Icon name="add-circle-outline" size={50} color="black" />
            <Text style={styles.createGroupText}>Create new Group!</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#1976D2',
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  groupItem: {
    flex: 1,
    margin: 8,
    marginTop:20,
    justifyContent:"center",
    backgroundColor:"#FAFAFA",
    height:350,
    borderRadius:8
    
  },
  row: {
    flex: 1,
    justifyContent: 'space-around',
  },
  createGroupCard: {
    backgroundColor: '#1976D2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    height:300,
    backgroundColor:"#EED9C4"
  },
  createGroupText: {
    color: 'black',
    fontSize: 18,
    marginTop: 8,
  },
});