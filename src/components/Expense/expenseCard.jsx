import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { IconButton, Menu, Divider, Button } from 'react-native-paper';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { convertToCurrency, currencyFind, getMonthMMM } from '../../utils/helper';
import { useNavigation } from '@react-navigation/native';
import { deleteExpenseService } from '../../services/expenseServices';

ExpenseCard.propTypes = {
  expenseName: PropTypes.string,
  expenseAmount: PropTypes.number,
  expensePerMember: PropTypes.number,
  expenseOwner: PropTypes.string,
  currencyType: PropTypes.string,
};

export default function ExpenseCard({
  expenseId,
  expenseName,
  expenseAmount,
  expensePerMember,
  expenseOwner,
  expenseDate,
  currencyType,
}) {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const deleteConfirmOpen = () => {
    setDeleteConfirm(true);
  };
  const deleteConfirmClose = () => {
    setDeleteConfirm(false);
  };

  const apiDeleteCall = async () => {
    try {
      await deleteExpenseService({ id: expenseId });
      // Refresh the screen or update the list
      Alert.alert('Success', 'Expense deleted successfully');
      deleteConfirmClose();
      // Add logic to refresh the dashboard
      navigation.replace("DashboardHome"); //refresh dashboard
    } catch (error) {
      Alert.alert('Error', 'Failed to delete expense');
    }

  };

  return (
    <View style={styles.container}>
      <View style={styles.dateBox}>
        <Text style={styles.date}>
          {new Date(expenseDate).getDate().toString().padStart(2, '0')}
        </Text>
        <Text style={styles.month}>{getMonthMMM(expenseDate)}</Text>
      </View>
      <View style={styles.expenseDetails}>
        <Text style={styles.expenseName}>{expenseName}</Text>
        <Text style={styles.totalAmount}>
          Total: {currencyFind(currencyType)} {convertToCurrency(expenseAmount)}
        </Text>
        <Text style={styles.paidBy}>Paid by, {expenseOwner}</Text>
      </View>
      <View style={styles.perPerson}>
        <Text style={styles.perPersonLabel}>Per person</Text>
        <Text style={styles.perPersonAmount}>
          {currencyFind(currencyType)} {convertToCurrency(expensePerMember)}
        </Text>
      </View>
      <View style={styles.menu}>
        <IconButton icon="dots-vertical" onPress={openMenu} />
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={{ x: 0, y: 0 }}
          style={styles.menuItems}
        >
          <Menu.Item
            title="View"
            onPress={() => {
              navigation.navigate('ViewExpense', { expenseId });
              closeMenu();
            }}
          />
          <Divider />
          <Menu.Item
            title="Edit"
            onPress={() => {
              navigation.navigate('EditExpense', { expenseId });
              closeMenu();
            }}
          />
          <Divider />
          <Menu.Item title="Delete" onPress={deleteConfirmOpen} />
        </Menu>

        <Modal visible={deleteConfirm} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Confirm expense deletion</Text>
              <Text style={styles.modalText}>
                Are you sure you want to delete the expense?
              </Text>
              <View style={styles.modalButtons}>
                <Button
                  mode="outlined"
                  icon="delete"
                  color="red"
                  onPress={apiDeleteCall}
                  style={styles.modalButton}
                >
                  Delete
                </Button>
                <Button
                  mode="outlined"
                  icon="cancel"
                  color="primary"
                  onPress={deleteConfirmClose}
                  style={styles.modalButton}
                >
                  Cancel
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 8,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dateBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF3E0', // Replace with your theme's warning lighter color
    justifyContent: 'center',
    alignItems: 'center',
  },
  date: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF9800', // Replace with your theme's warning darker color
  },
  month: {
    fontSize: 14,
    color: '#FF9800', // Replace with your theme's warning darker color
  },
  expenseDetails: {
    flex: 2,
    marginLeft: 8,
  },
  expenseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2', // Replace with your theme's primary dark color
  },
  totalAmount: {
    fontSize: 12,
    color: '#1976D2', // Replace with your theme's primary dark color
  },
  paidBy: {
    fontSize: 10,
  },
  perPerson: {
    flex: 1,
    alignItems: 'center',
  },
  perPersonLabel: {
    fontSize: 12,
    color: '#D32F2F', // Replace with your theme's error dark color
  },
  perPersonAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D32F2F', // Replace with your theme's error dark color
  },
  menu: {
    alignItems: 'flex-end',
  },
  menuItems: {
    marginTop: 30,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
  },
});