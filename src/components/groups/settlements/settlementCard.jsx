import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image } from 'react-native';
import { convertToCurrency, currencyFind } from '../../../utils/helper';
import BalanceSettlement from './balanceSettlement';

const SettlementCard = ({ mySettle, currencyType }) => {
  const [reload, setReload] = useState(false);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    if (reload) {
      setOpen(false)
      setReload(false);
    } else {
      setOpen(false);
    }
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.name}>{mySettle[0].split('@')[0]}</Text>
        <Text style={styles.toText}>
          to <Text style={styles.toName}>{mySettle[1].split('@')[0]}</Text>
        </Text>
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Settlement Amount</Text>
          <Text style={styles.amount}>
            {currencyFind(currencyType)} {convertToCurrency(mySettle[2])}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.settleButton} onPress={handleOpen}>
        <Text style={styles.buttonText}>Settle</Text>
      </TouchableOpacity>

      <Modal visible={open} onRequestClose={handleClose} animationType="slide">
        <View style={styles.modalContainer}>
          <BalanceSettlement
            currencyType={currencyType}
            settleTo={mySettle[1]}
            settleFrom={mySettle[0]}
            amount={mySettle[2]}
            handleClose={handleClose}
            setReload={setReload}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "flex-start",
    backgroundColor: '#fff3e0',
    padding: 16,
    borderRadius: 8,
    elevation: 4,
    marginBottom: 8,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontWeight: '600',
    fontSize: 16,
  },
  toText: {
    fontSize: 14,
  },
  toName: {
    fontWeight: '600',
  },
  amountContainer: {
    alignItems: 'flex-start',
    marginTop: 5,
  },
  amountLabel: {
    fontSize: 12,
    color: 'red',
  },
  amount: {
    fontWeight: '900',
    color: 'red',
  },
  settleButton: {
    backgroundColor: '#2196f3',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
});

export default SettlementCard;