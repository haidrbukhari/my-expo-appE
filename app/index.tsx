import React, { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';
import { USER_STORAGE_KEY } from '@/data/api';

const Page = () => {
  const [hasID, setHasID] = useState<boolean | null>(null); // null = still checking

  useEffect(() => {
    const checkOrCreateUserId = async () => {
      const id = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (!id) {
        const randomUserid = Math.random().toString(36);
        await AsyncStorage.setItem(USER_STORAGE_KEY, randomUserid);
      }
      setHasID(true);
    };

    checkOrCreateUserId();
  }, []);

  if (hasID) {
    return <Redirect href="/(tabs)/sets" />;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
};

export default Page;
