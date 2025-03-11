import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AlertBanner from '../../AlertBanner';
import Loading from '../../loading';
import { convertToCurrency, currencyFind, categoryIcon } from '../../../utils/helper';
import ExpenseCard from '../../Expense/expenseCard';
import GroupCategoryGraph from './GroupCategoryGraph';
import GroupMonthlyGraph from './GroupMonthlyGraph';
import { GroupSettlements } from '../settlements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getGroupDetailsService, getGroupExpenseService } from '../../../services/groupServices';
import Iconify from '../../Iconify';
// import Icon from 'react-native-vector-icons/EvilIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 
let showCount = 10;

export default function ViewGroup() {
  const route = useRoute();
  const navigation = useNavigation();
  const { groupId } = route.params;

  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState({});
  const [groupExpense, setGroupExpense] = useState();
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertExpense, setAlertExpense] = useState(false);
  const [alertExpenseMessage, setAlertExpenseMessage] = useState('');
  const [showAllExp, setShowAllExp] = useState(false);
  const [expFocus, setExpFocus] = useState(false);
  const [expenses, setExpenses] = useState();
  const [viewSettlement, setViewSettlement] = useState(0);
  const [emailId, setEmailId] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileString = await AsyncStorage.getItem('profile');
        if (profileString) {
          const profile = JSON.parse(profileString);
          setEmailId(profile?.emailId);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const toggleAllExp = () => {
    setExpenses(groupExpense?.expense?.slice(0, showCount));
    if (showCount >= groupExpense?.expense?.length) setShowAllExp(true);
    setExpFocus(true);
    showCount += 5;
  };

  const toggleExpView = () => {
    setViewSettlement(0);
  };

  const toggleSettleView = () => {
    setViewSettlement(1);
  };

  const toggleMySettleView = () => {
    setViewSettlement(2);
  };

  const findUserSplit = (split) => {
    if (split && emailId) {
      split = split[0];
      return split[emailId] || 0;
    }
    return 0;
  };

  useEffect(() => {
    const getGroupDetails = async () => {
      setLoading(true);
      const groupIdJson = {
        id: groupId,
      };
      try {
        const response_group = await getGroupDetailsService(
          groupIdJson,
          setAlert,
          setAlertMessage
        );
        const response_expense = await getGroupExpenseService(
          groupIdJson,
          setAlertExpense,
          setAlertExpenseMessage
        );

        response_group && setGroup(response_group?.data?.group);
        response_expense && setGroupExpense(response_expense?.data);
        response_expense?.data?.expense &&
          setExpenses(response_expense?.data?.expense?.slice(0, 5));
        if (response_expense?.data?.expense?.length <= 5 || !response_expense)
          setShowAllExp(true);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    getGroupDetails();
  }, [groupId, emailId]);

  const navigateToEditGroup = () => {
    navigation.navigate('EditGroup', { groupId: groupId });
  };

  const navigateToAddExpense = () => {
    navigation.navigate('AddExpense', { groupId: groupId });
  };

  const navigateBackToGroups = () => {
    navigation.navigate('DashboardHome', { screen: 'Groups' });
  };

  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <Loading />
      ) : (
        <>
          <View style={styles.header}>
            <TouchableOpacity onPress={navigateBackToGroups} style={styles.backButton}>
              <Icon name="chevron-left" size={30} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.groupInfo}>
            <AlertBanner showAlert={alert} alertMessage={alertMessage} severity="error" />
            <TouchableOpacity onPress={navigateToEditGroup} style={styles.editLink}>
              <Icon name="pencil" style={styles.editIcon} />
            </TouchableOpacity>
            <Text style={styles.groupName}>{group?.groupName}</Text>
            <Text style={styles.groupDescription}>{group?.groupDescription}</Text>
            <Text style={styles.createdBy}>
              Created by: <Text style={styles.ownerName}>{group?.groupOwner}</Text>
            </Text>
            <View style={styles.categoryContainer}>
              <Text style={styles.categoryLabel}>Category: {group?.groupCategory}</Text>
              <TouchableOpacity onPress={navigateToAddExpense} style={styles.addExpenseButton}>
                <Icon name="plus-circle-outline" style={styles.addExpenseIcon} />
                <Text style={styles.addExpenseText}>Add Expense</Text>
              </TouchableOpacity>
            </View>
            {/* <View style={styles.categoryIconContainer}>
              <Iconify icon={categoryIcon(group?.groupCategory)} style={styles.categoryIcon} />
            </View> */}
          </View>

          <View style={styles.expenseSummary}>
            <View style={styles.summaryItem}>
              <Icon name="cash-multiple" style={styles.summaryIcon} />
              <View>
                <Text style={styles.summaryTitle}>Total expense</Text>
                <Text style={styles.summaryValue}>
                  {currencyFind(group?.groupCurrency)} {groupExpense && groupExpense.total  ? convertToCurrency(groupExpense.total) : 0}
                </Text>
              </View>
            </View>
            <View style={styles.summaryItem}>
            <Icon name="cash-plus" style={styles.summaryIcon} />

              <View>
                <Text style={styles.summaryTitle}>You are owed</Text>
                <Text style={styles.summaryValue}>
                  {currencyFind(group?.groupCurrency)} {findUserSplit(group?.split) > 0 ? convertToCurrency(findUserSplit(group?.split)) : 0}
                </Text>
              </View>
            </View>
            <View style={styles.summaryItem}>
              <Icon name="cash-minus" style={styles.summaryIcon} />
              <View>
                <Text style={styles.summaryTitle}>You owe</Text>
                <Text style={styles.summaryValue}>
                  {currencyFind(group?.groupCurrency)} {findUserSplit(group?.split) < 0 ? convertToCurrency(Math.abs(findUserSplit(group?.split))) : 0}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.viewToggle}>
            <TouchableOpacity
              style={[styles.toggleButton, viewSettlement === 0 && styles.activeToggle]}
              onPress={toggleExpView}
            >
              <Text style={[styles.toggleText, viewSettlement === 0 && styles.activeToggle]}>
                Expenses
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, viewSettlement === 1 && styles.activeToggle]}
              onPress={toggleSettleView}
            >
              <Text style={[styles.toggleText, viewSettlement === 1 && styles.activeToggle]}>
                All Settlements
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, viewSettlement === 2 && styles.activeToggle]}
              onPress={toggleMySettleView}
            >
              <Text style={[styles.toggleText, viewSettlement === 2 && styles.activeToggle]}>
                My Settlements
              </Text>
            </TouchableOpacity>
          </View>

          {viewSettlement === 0 && (
            <View style={styles.contentContainer}>
              {groupExpense?.expense?.length> 0 ? (
                <>
                  <View style={styles.expenseList}>
                    <View style={styles.expenseCards}>
                      {expenses.map((expense, index) => (
                        <ExpenseCard
                          key={expense?._id}
                          expenseId={expense?._id}
                          expenseName={expense?.expenseName}
                          expenseAmount={expense?.expenseAmount}
                          expensePerMember={expense?.expensePerMember}
                          expenseOwner={expense?.expenseOwner}
                          expenseDate={expense?.expenseDate}
                          currencyType={expense?.expenseCurrency}
                        />
                      ))}
                    </View>
                    {!showAllExp && (
                      <TouchableOpacity style={styles.viewMoreButton} onPress={toggleAllExp}>
                        <Text style={styles.viewMoreText}>View More</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  {expFocus && (
                    <>
                      <View style={styles.graphContainer}>
                        <GroupCategoryGraph expense={groupExpense?.expense} />
                      </View>
                      <View style={styles.monthlyGraphContainer}>
                        <GroupMonthlyGraph expense={groupExpense?.expense} />
                      </View>
                    </>
                  )}
                </>
              ) : (
                <View style={styles.noExpenseContainer}>
                  <AlertBanner
                    showAlert={alertExpense}
                    alertMessage={alertExpenseMessage}
                    severity="error"
                  />
                  <Text style={styles.noExpenseText}>
                    No expenses yet.{' '}
                    <TouchableOpacity onPress={navigateToAddExpense}>
                      <Text style={styles.addLinkText}>Add some!</Text>
                    </TouchableOpacity>
                  </Text>
                </View>
              )}
            </View>
          )}

          {viewSettlement === 1 && (
            <View style={styles.contentContainer}>
              <GroupSettlements
                groupId={groupId}
                currency={group?.groupCurrency}
                email={emailId}
                type={1}
              />
            </View>
          )}

          {viewSettlement === 2 && (
            <View style={styles.contentContainer}>
              <GroupSettlements
                groupId={groupId}
                currency={group?.groupCurrency}
                email={emailId}
                type={0}
              />
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  backButton: {
    padding: 5,
    marginTop:25
  },
  groupInfo: {
    backgroundColor: '#e0f7fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  editLink: {
    alignSelf: 'flex-end',
  },
  editIcon: {
    fontSize: 18,
  },
  groupName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  groupDescription: {
    fontSize: 16,
    marginBottom: 8,
  },
  createdBy: {
    fontSize: 14,
    marginBottom: 8,
  },
  ownerName: {
    fontWeight: 'bold',
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryLabel: {
    backgroundColor: '#fff3e0',
    padding: 8,
    borderRadius: 4,
  },
  addExpenseButton: {
    flexDirection: 'row',
    backgroundColor: '#2196f3',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  addExpenseIcon: {
    color: 'white',
    marginRight: 4,
  },
  addExpenseText: {
    color: 'white',
  },
  categoryIconContainer: {
    position: 'relative',
    top: -20,
    left: -20,
  },
  categoryIcon: {
    fontSize: 32,
    backgroundColor: '#bbdefb',
    padding: 8,
    borderRadius: 16,
  },
  expenseSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  summaryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewToggle: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 16,
  },
  toggleButton: {
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  activeToggle: {
    backgroundColor: '#bbdefb',
    fontWeight: 'bold',
  },
  toggleText: {
    fontSize: 16,
  },
  contentContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
  },
  underDevelopment: {
    textAlign: 'center',
    fontSize: 16,
  },
  noExpenseContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  noExpenseText: {
    textAlign: 'center',
    fontSize: 16,
  },
  addLink: {
    color: '#2196f3',
    fontWeight: 'bold',
  },
  addLinkText: {
    color: '#2196f3',
    fontWeight: 'bold',
  },
  expenseList: {
    flexDirection: 'column',
  },
  expenseCards: {
    flexDirection: 'column',
  },
  graphContainer: {
    marginTop: 16,
  },
  monthlyGraphContainer: {
    marginTop: 16,
  },
  viewMoreButton: {
    marginTop: 8,
    alignSelf: 'center',
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#2196f3',
  },
  viewMoreText: {
    color: '#2196f3',
    fontSize: 16,
  },
});