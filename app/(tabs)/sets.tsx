import {
  View,
  Text,
  ListRenderItem,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Set } from '@/data/api';
import { Link } from 'expo-router';
import { getMySets } from '@/data/api';
import { transformImage } from '@xata.io/client';
import { defaultStyleSheet } from '@/constants/Styles';

const Page = () => {
  const [sets, setSets] = useState<{ id: string; set: Set; canEdit: boolean }[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadSets();
  }, []);

  // Load user Sets
  const loadSets = async () => {
    const data = await getMySets();
    setSets(data);
  };

  const renderSetRow: ListRenderItem<{ id: string; set: Set; canEdit: boolean }> = ({
    item: { set, canEdit },
  }) => {
    return (
     
                 
      <View style={styles.setRow}>
        
        <View style={{ flexDirection: 'column' }}>
           {set.image && (
                    <Image
                      source={{ uri: transformImage(set.image.url, { width: 100, height: 100 }) }}
                      style={{ width: 50, height: 50, borderRadius: 8, marginRight: 10 }}
                    />
                  )}
          
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle}>{set.title}</Text>
            <View style={{ flexDirection: 'row', gap: 4, marginTop: 10 }}>
              <Link href={`/(learn)/${set.id}`} asChild>
                <TouchableOpacity style={defaultStyleSheet.button}>
                  <Text style={defaultStyleSheet.buttonText}>cards</Text>
                </TouchableOpacity>
              </Link>
              <Link href={`/(learn)/${set.id}?limit=6`} asChild>
                <TouchableOpacity style={defaultStyleSheet.button}>
                  <Text style={defaultStyleSheet.buttonText}>6 cards</Text>
                </TouchableOpacity>
              </Link>
              <Link href={`/(learn)/${set.id}?limit=10`} asChild>
                <TouchableOpacity style={defaultStyleSheet.button}>
                  <Text style={defaultStyleSheet.buttonText}>10 cards</Text>
                </TouchableOpacity>
              </Link>
              {canEdit && (
                <Link href={`/(modals)/(cards)/${set.id}`} asChild>
                  <TouchableOpacity style={defaultStyleSheet.button}>
                    <Text style={defaultStyleSheet.buttonText}>Edit</Text>
                  </TouchableOpacity>
                </Link>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {!sets.length && (
        <Link href={'/(tabs)/search'} asChild>
          <TouchableOpacity style={{}}>
            <Text style={{ textAlign: 'center', padding: 20, color: '#3f3f3f', fontSize:19 }}>
              Add your first set!
            </Text>
          </TouchableOpacity>
        </Link>
      )}

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
  container: {
    flex: 1,
  },
  setRow: {
    margin: 8,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Page;
