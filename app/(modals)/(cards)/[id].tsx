import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Card, createCard, deleteSet, getCardsForSet } from '@/data/api';
import { defaultStyleSheet } from '@/constants/Styles';
import { Ionicons } from '@expo/vector-icons';
import { RadioButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [cards, setCards] = useState<Card[]>([]);
  const [checked, setChecked] = React.useState('first');
  const [information, setInformation] = useState({
    question: '',
    option1: '',
    option2: '',
    option3: '',
    answer: 0,
    image: null as any,
  });
  const router = useRouter();
 
  useEffect(() => {
    if (!id) return;

    const loadCards = async () => {
      const data = await getCardsForSet(id);
      setCards(data);
    };
    loadCards();
  }, [id]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      base64: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setInformation({ ...information, image: result.assets[0].base64 });
    }
  };

  const onAddCard = async () => {
    const newCard = await createCard({ set: id, ...information });
    setCards([...cards, newCard]);
    setInformation({
      question: '',
      option1: '',
      option2: '',
      option3: '',
      answer: 0,
      image: null as any,
    });
  };

  const onDeleteSet = async () => {
    deleteSet(id!);
    router.back();
  };

  return (
    <View style={[defaultStyleSheet.container, { marginTop: 20, marginHorizontal: 16 }]}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={onDeleteSet}>
              <Ionicons name="trash-outline" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />
      {/* <TextInput
        style={defaultStyleSheet.input}
        placeholder="Questions"
        value={information.question}
        onChangeText={(text) => setInformation({ ...information, question: text })}
      /> */}
      <View>
      <TextInput
        style={defaultStyleSheet.input}
        placeholder="Name"
        value={information.option1}
        onChangeText={(text) => setInformation({ ...information, option1: text })}
      />
      
      {/* <RadioButton value="first"
      status={ checked === 'first' ? 'checked' : 'unchecked' }
      onPress={() => {setChecked('first');
        setInformation({...information, answer:1})}}/> */}


      <TextInput
        style={defaultStyleSheet.input}
        placeholder="Fact"
        value={information.option2}
        onChangeText={(text) => setInformation({ ...information, option2: text })}
      />
      
      {/* <RadioButton value="second"
      status={ checked === 'second' ? 'checked' : 'unchecked' }
      onPress={() => {setChecked('second');setInformation({...information, answer:2})}}/> */}
      {/* <TextInput
        style={defaultStyleSheet.input}
        placeholder="Option#3"
        value={information.option3}
        onChangeText={(text) => setInformation({ ...information, option3: text })}
      /><RadioButton value="third"
      status={ checked === 'third' ? 'checked' : 'unchecked' }
      onPress={() => {setChecked('third');
      setInformation({...information, answer:3})}}/> */}
            </View>

      {/* <TextInput
        style={defaultStyleSheet.input}
        placeholder="Answer"
        value={information.answer}
        onChangeText={(text) => setInformation({ ...information, answer: text })}
      /> */}
              <TouchableOpacity style={defaultStyleSheet.button} onPress={pickImage}>
          <Text style={defaultStyleSheet.buttonText}>Select Image</Text>
        </TouchableOpacity>

      <TouchableOpacity style={defaultStyleSheet.button} onPress={onAddCard}>
        <Text style={defaultStyleSheet.buttonText}>Add card</Text>
      </TouchableOpacity>

      <View style={{ marginTop: 20 }}>
        {cards.map((card) => (
          <View key={card.id} style={{ padding: 16, backgroundColor: '#fff', marginBottom: 10 }}>
            <Text style={{ fontWeight: 'bold' }}>{card.question}</Text>
            <Text>{card.option1}</Text>
            {/* <Text>{card.answer}</Text> */}
            {/* <Text>{card.option2}</Text>
            <Text>{card.option3}</Text> */}
          </View>
        ))}
      </View>
    </View>
  );
};

export default Page;
