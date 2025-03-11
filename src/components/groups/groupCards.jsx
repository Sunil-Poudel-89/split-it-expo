import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import PropTypes from 'prop-types';
import { convertToCurrency, currencyFind, categoryIcon } from '../../utils/helper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';    


GroupCards.propTypes = {
  color: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  groupMembers: PropTypes.array,
  share: PropTypes.number,
  currencyType: PropTypes.string,
  groupCategory: PropTypes.string,
  isGroupActive: PropTypes.bool,
};

export default function GroupCards({
  title,
  description,
  groupMembers,
  share,
  currencyType,
  groupCategory,
  isGroupActive,
  color = 'primary',
}) {
  const getColor = (themeColor) => {
    switch (themeColor) {
      case 'primary':
        return {
          lighter: '#E3F2FD',
          darker: '#1976D2',
        };
      case 'secondary':
        return {
          lighter: '#EDE7F6',
          darker: '#673AB7',
        };
      case 'error':
        return {
          lighter: '#FFEBEE',
          darker: '#D32F2F',
        };
      case 'warning':
        return {
          lighter: '#FFF8E1',
          darker: '#FFC107',
        };
      case 'info':
        return {
          lighter: '#E0F7FA',
          darker: '#03A9F4',
        };
      case 'success':
        return {
          lighter: '#E8F5E9',
          darker: '#4CAF50',
        };
      default:
        return {
          lighter: '#E3F2FD',
          darker: '#1976D2',
        };
    }
  };

  const themeColors = getColor(color);

  return (
    <View style={styles.card}>
      <View style={[styles.categoryStyle, { backgroundColor: themeColors.lighter }]}>
        <Icon name={categoryIcon(groupCategory)} size={20} color={themeColors.darker} />
      </View>
      <View style={[styles.titleContainer, { backgroundColor: themeColors.lighter }]}>
        <Text style={[styles.title, { color: themeColors.darker }]}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.statusContainer}>
          <Text
            style={[
              styles.statusText,
              {
                backgroundColor: isGroupActive
                  ? getColor('error').lighter
                  : getColor('success').lighter,
                color: isGroupActive
                  ? getColor('error').darker
                  : getColor('success').darker,
              },
            ]}
          >
            {isGroupActive ? 'Not Settled' : 'Settled'}
          </Text>
          <Text
            style={[
              styles.shareText,
              {
                backgroundColor: share < 0
                  ? getColor('error').lighter
                  : getColor('success').lighter,
                color: share < 0
                  ? getColor('error').darker
                  : getColor('success').darker,
              },
            ]}
          >
            {share < 0 ? 'You owe' : 'You are owed'}: {currencyFind(currencyType)}{' '}
            {convertToCurrency(Math.abs(Math.floor(share)))}
          </Text>
        </View>
        <View style={styles.detailsContainer}>
          <View style={styles.categoryInfo}>
            <Text style={styles.categoryLabel}>Category</Text>
            <View style={[styles.categoryValue, { backgroundColor: getColor('warning').lighter }]}>
              <Text style={{color: getColor('warning').darker}}>{groupCategory}</Text>
            </View>
          </View>
          <View style={styles.membersContainer}>
            {groupMembers.map((member) => (
              <Image
                key={member}
                source={{ uri: "https://res.cloudinary.com/tuzup/image/upload/v1658929366/SplitApp/user_l7xmft.png"}}
                style={styles.avatar}
              />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'relative',
  },
  categoryStyle: {
    width: 35,
    height: 32,
    position: 'absolute',
    left: 16,
    top: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: 'gray',
  },
  content: {
    padding: 16,
  },
  statusContainer: {
    flexDirection: 'col',
    justifyContent: 'space-between',
    marginBottom: 60,

  },
  statusText: {
    padding: 8,
    borderRadius: 4,
  },
  shareText: {
    padding: 10,
    borderRadius: 4,
  },
  detailsContainer: {
    flexDirection: 'col',
    justifyContent: 'space-between',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryLabel: {
    marginRight: 8,
  },
  categoryValue: {
    padding: 8,
    borderRadius: 4,
  },
  membersContainer: {
    flexDirection: 'row',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 2,
  },
});