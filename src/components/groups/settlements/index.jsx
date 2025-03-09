// client/src/components/groups/settlement/GroupSettlements.jsx (React Native Expo)

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { getGroupSettleService } from '../../../services/groupServices';
import AlertBanner from '../../AlertBanner';
import Iconify from '../../Iconify';
import Loading from '../../loading';
import SettlementCard from './settlementCard'; // Assuming you have SettlementCard.jsx
import UserBalanceChart from './userBalanceCard'; // Assuming you have UserBalanceChart.jsx

export const GroupSettlements = ({ currencyType }) => {
  const route = useRoute();
  const { groupId } = route.params;

  const [noSettle, setNoSettle] = useState(true);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [groupSettlement, setGroupSettlement] = useState([]);

  useEffect(() => {
    const getGroupSettlement = async () => {
      setLoading(true);
      const groupIdJson = {
        id: groupId,
      };
      try {
        const group_settle = await getGroupSettleService(groupIdJson, setAlert, setAlertMessage);
        setGroupSettlement(group_settle?.data?.data);
      } catch (error) {
        console.error('Error fetching group settlements:', error);
      } finally {
        setLoading(false);
      }
    };
    getGroupSettlement();
  }, [groupId]);

  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <Loading />
      ) : (
        <View style={styles.content}>
          <AlertBanner showAlert={alert} alertMessage={alertMessage} severity="error" />
          <View style={styles.settlementCards}>
            {groupSettlement?.map((mySettle, index) => (
              mySettle[2] > 0 && (
                <View key={index} style={styles.settlementCard}>
                  {noSettle && setNoSettle(false)}
                  <SettlementCard mySettle={mySettle} currencyType={currencyType} />
                </View>
              )
            ))}
          </View>

          {noSettle ? (
            <View style={styles.noSettlement}>
              <Iconify icon="icon-park-twotone:doc-success" style={styles.successIcon} />
              <Text style={styles.noSettlementText}>No Settlement required!</Text>
            </View>
          ) : (
            <UserBalanceChart />
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  content: {
    paddingBottom: 24,
  },
  settlementCards: {
    flexDirection: 'column',
  },
  settlementCard: {
    marginBottom: 8,
  },
  noSettlement: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    minHeight: 200,
  },
  successIcon: {
    color: 'green',
    fontSize: 100,
  },
  noSettlementText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 8,
  },
});