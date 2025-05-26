import {
  View,
  Text,
  ListRenderItem,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Set, getSets } from '@/data/api';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import Colors from '@/constants/Colors';
import { getMySets } from '@/data/api';
import { transformImage } from '@xata.io/client';
import { defaultStyleSheet } from '@/constants/Styles';

const Page = () => {
  const [sets, setSets] = useState<{ id: string; set: Set; canEdit: boolean }[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load available Sets
  useEffect(() => {
    loadSets();
  }, []);

  const loadSets = async () => {
    const data = await getMySets();
    setSets(data);
  };

  // Render a row for each Set
  const renderSetRow: ListRenderItem<{ id: string; set: Set; canEdit: boolean }> = ({
    item: { set, canEdit },
  }) => {
    return (
      <Link href={`/(modals)/set/${set.id}`} asChild>
        <TouchableOpacity style={styles.setRow}>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {set.image && (
              <Image
                source={{ uri: transformImage(set.image.url, { width: 100, height: 100 }) }}
                style={{ width: 50, height: 50, borderRadius: 8 }}
              />
            )}

            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{set.title}</Text>
              <Text style={{ color: Colors.darkGrey }}>{set.cards} Cards</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={24} color="#ccc" />
          </View>
        </TouchableOpacity>
      </Link>
    );
  };

  return (
    <View style={defaultStyleSheet.container}>
      <FlatList
        data={sets}
        renderItem={renderSetRow}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={loadSets} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  setRow: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Page;