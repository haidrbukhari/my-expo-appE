import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { Card, getAllLearnCards, getLearnCards, saveLearning } from '@/data/api';
import { defaultStyleSheet } from '@/constants/Styles';

import { transformImage } from '@xata.io/client';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import LearnCard from '@/components/LearnCard';
import { Ionicons } from '@expo/vector-icons';

const Page = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { limit } = useLocalSearchParams<{ limit: string }>();
  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFront, setShowFront] = useState(true);
  const [textHidden, setTextHidden] = useState(false);
  const [correctCards, setCorrectCards] = useState(0);
  const [wrongCards, setWrongCards] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showFinalResults, setShowFinalResults] = useState(false);
  const [finalResult, setFinalResult] = useState(true);
  const [display, setDisplay] = useState('');
  const [endButton, setEndButton]  = useState(false)

  const rotate = useSharedValue(0);
  const frontAnimatedStyles = useAnimatedStyle(() => {
    const rotateValue = interpolate(rotate.value, [0, 1], [0, 180]);
    return {
      transform: [
        {
          rotateY: withTiming(`${rotateValue}deg`, { duration: 600 }),
        },
      ],
    };
  });

  const backAnimatedStyles = useAnimatedStyle(() => {
    const rotateValue = interpolate(rotate.value, [0, 1], [180, 360]);
    return {
      transform: [
        {
          rotateY: withTiming(`${rotateValue}deg`, { duration: 600 }),
        },
      ],
    };
  });

  useEffect(() => {
    const loadCards = async () => {
      if(limit){
      const cards = await getLearnCards(id!, limit!);
      console.log(cards)
      setCards(cards);
      }
       else {
        const cards = await getAllLearnCards(id!);
        console.log(cards)
        setCards(cards);
      }
  
    };
    loadCards();
  }, []);

  // Rotate the card
  const onShowAnswer = () => {
    rotate.value = 1;
    setShowFront(false);
  };

  // Show next card
  const onNextCard = async (correct: boolean) => {
    if (currentIndex < cards.length - 1) {
      correct ? setCorrectCards(correctCards + 1) : setWrongCards(wrongCards + 1);

      rotate.value = 0;
      setTextHidden(true);
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setTextHidden(false);
      }, 600);
    } else {
      setShowResult(true);
      // Save the use rprogress
      const correctResult = correctCards + (correct ? 1 : 0);
      const wrongResult = wrongCards + (correct ? 0 : 1);
      saveLearning(id, +limit, correctResult, wrongResult);
      setCorrectCards(correctResult);
      setWrongCards(wrongResult);
    }

    setShowFront(true);
  };

  const FinalResultCorrect = () => {
    return(
      <Text >Correct</Text>
    )
  }
  const FinalResultFalse = () => {
    return(
      <Text >False</Text>
    )
  }
  
  const ShowFinalResult = (result : boolean) => {
    console.log(result);
    setShowResult(false);
    setShowFinalResults(true);
    if (result){
      setFinalResult(true);
        } else {
      setFinalResult(false); 
    }
  }

  const checkName = (object : any, randomIndex : any) => {
    if (object === cards[randomIndex].option1){
      ShowFinalResult(true);
      setDisplay('none');
      setEndButton(true);
      
    } else {
      ShowFinalResult(false);
      setDisplay('none');
      setEndButton(true);
    }
  }

  const checkCorrectCard = (randomIndex: any) => {
    for (let i = 0; i < cards.length; i++){
      if (cards[i].option1 === cards[randomIndex].option1){
        return cards[i];
      }
    }
  }

  function shuffle(array:any) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex > 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

  const Test = () => {
    var arr = [];
    while(arr.length < 3){
      var r = Math.floor(Math.random() * cards.length) + 1;
      if(arr.indexOf(r) === -1) arr.push(r);
  }
    var randomIndex = Math.floor(Math.random() * cards.length);
    const correctCard = checkCorrectCard(randomIndex);
    var answerOptions = [correctCard?.option1, cards[arr[0]].option1, cards[arr[1]].option1];
    console.log(correctCard?.option1 + cards[arr[0]].option1 + cards[arr[1]].option1 )
    answerOptions = shuffle(answerOptions);
    
    return (<View >
      <Image
                source={{ uri: transformImage(cards[randomIndex].image.url, { width: 990, height: 990 }) }}
                style={{
                  backgroundColor: '#fff',
                  width: 300,
                  height: 300,
                  justifyContent: 'center',
                  borderRadius: 10,
                  padding: 20,
                  // elevation: 5,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                }}
              />
              <div style={style3.cardNumberr}>Select the right option:</div>
              {answerOptions.map(function (answer,i){
                return (<>
                  <Text style={style3.cardNumber}><TouchableOpacity onPress={() => checkName(answer, randomIndex)}>{answer}</TouchableOpacity></Text>
                </>)
              })}
              {/* {cards.map(function (object, i){
                return (<>
                    <Text style={style3.cardNumber}><TouchableOpacity onPress={() => checkName(object, randomIndex)}>{object.option1}</TouchableOpacity></Text>
                </>)
              })} */}
                                  {/* <Text>{correctCard?.option1}</Text> */}

              </View>
    )
  }
  const showTest = () => {
    setShowResult(true)
    return (
      <Test />
    )
  }
  const onAnswerClicked = async (optionNum: Number) => {
    var correct = true;
    if (optionNum === cards[currentIndex].answer){
      correct = true;
      if (currentIndex < cards.length - 1) {
        correct ? setCorrectCards(correctCards + 1) : setWrongCards(wrongCards + 1);
  
        rotate.value = 0;
        setTextHidden(true);
        setTimeout(() => {
          setCurrentIndex(currentIndex + 1);
          setTextHidden(false);
        }, 600);
      } else {
        setShowResult(true);
        // Save the use rprogress
        const correctResult = correctCards + (correct ? 1 : 0);
        const wrongResult = wrongCards + (correct ? 0 : 1);
        saveLearning(id, +limit, correctResult, wrongResult);
        setCorrectCards(correctResult);
        setWrongCards(wrongResult);
      }
    } else {
      correct = false;
      if (currentIndex < cards.length - 1) {
        correct ? setCorrectCards(correctCards + 1) : setWrongCards(wrongCards + 1);
  
        rotate.value = 0;
        setTextHidden(true);
        setTimeout(() => {
          setCurrentIndex(currentIndex + 1);
          setTextHidden(false);
        }, 600);
      } else {
        setShowResult(true);
        // Save the use rprogress
        const correctResult = correctCards + (correct ? 1 : 0);
        const wrongResult = wrongCards + (correct ? 0 : 1);
        saveLearning(id, +limit, correctResult, wrongResult);
        setCorrectCards(correctResult);
        setWrongCards(wrongResult);
      }
    }
    // if (currentIndex < cards.length - 1) {
    //   correct ? setCorrectCards(correctCards + 1) : setWrongCards(wrongCards + 1);

    //   rotate.value = 0;
    //   setTextHidden(true);
    //   setTimeout(() => {
    //     setCurrentIndex(currentIndex + 1);
    //     setTextHidden(false);
    //   }, 600);
    // } else {
    //   setShowResult(true);
    //   // Save the use rprogress
    //   const correctResult = correctCards + (correct ? 1 : 0);
    //   const wrongResult = wrongCards + (correct ? 0 : 1);
    //   saveLearning(id, +limit, correctResult, wrongResult);
    //   setCorrectCards(correctResult);
    //   setWrongCards(wrongResult);
    // }

    setShowFront(true);
  };

  const clickOption1 = () => {
    onAnswerClicked(1);
  }
  const clickOption2 = () => {
    onAnswerClicked(2);

  }
  const clickOption3 = () => {
    onAnswerClicked(3);

  }

  const LearnCardComponent = () => {
    return(
      <View style={{display: display}}>

      <View style={style1.container}>
        {showFront && !textHidden && <Image
                source={{ uri: transformImage(cards[currentIndex].image.url, { width: 990, height: 990 }) }}
                style={{
                  backgroundColor: '#fff',
                  width: 300,
                  height: 300,
                  justifyContent: 'center',
                  borderRadius: 10,
                  padding: 20,
                  // elevation: 5,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                }}
              />}
        {!showFront && <View>
          <Text style={style2.cardNumber}>Name</Text>
          <Text style={style1.cardNumber}>{cards[currentIndex].option1}</Text>
          <Text style={style2.cardNumber}>Fact</Text>
        <Text style={style1.cardNumber}>{cards[currentIndex].option2}</Text>
        {/* <TouchableOpacity style={style1.cardNumber} onPress={() => clickOption3()}>{cards[currentIndex].option3}</TouchableOpacity> */}
          </View>}
      </View>
      </View>
    )
  }

  // const LearnCard = ({ card, isFront, textHidden }: Props) => {
  //   return (
  //     <View style={styles.container}>
  //       {isFront && !textHidden && <Text style={styles.cardNumber}>{card.question}</Text>}
  //       {!isFront && <View>
  //       {/* <Text style={styles.cardNumber}>{card.answer}</Text> */}
  //       <Text style={styles.cardNumber}>{card.option1}</Text>
  //       <Text style={styles.cardNumber}>{card.option2}</Text>
  //       <Text style={styles.cardNumber}>{card.option3}</Text>
  //       </View>}
  //     </View>
  //   );
  // };

  return (
    <View style={defaultStyleSheet.container}>
      {showResult && !showFinalResults && (
        <View style={styles.container}>
          <Test />
          <Link href={'/(tabs)/sets'} asChild>
            <TouchableOpacity style={defaultStyleSheet.bottomButton}>
              <Text style={defaultStyleSheet.buttonText}>End session</Text>
            </TouchableOpacity>
          </Link>
        </View>
      )}

      {!showResult && cards.length > 0 && (
        <>
          <Text style={defaultStyleSheet.header}>
            {currentIndex + 1} / {cards.length}
          </Text>
          <View style={styles.container}>
            <Animated.View style={[styles.frontcard, frontAnimatedStyles]}>
              {/* <LearnCard card={cards[currentIndex]} isFront={true} textHidden={textHidden} /> */}
              <LearnCardComponent />
            </Animated.View>
            <Animated.View style={[styles.backCard, backAnimatedStyles]}>
              {/* <LearnCard card={cards[currentIndex]} isFront={false} /> */}
              <LearnCardComponent />
            </Animated.View>

            {showFront && (
              <TouchableOpacity style={defaultStyleSheet.bottomButton} onPress={onShowAnswer}>
                <Text style={defaultStyleSheet.buttonText}>Show Facts</Text>
              </TouchableOpacity>
            )}

{currentIndex==cards.length-1 && !showFront ? (<TouchableOpacity style={
  {textAlign: 'center',
  display:display,
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  bottom: 40,
  width: 300,
  flex: 1,
  backgroundColor: '#53419c',
  padding: 16,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#ccc',}
} onPress={() => router.back()}>
  <Text style={defaultStyleSheet.buttonText}>Finish</Text>
</TouchableOpacity>) : !showFront && (
              <TouchableOpacity style={defaultStyleSheet.bottomButton} onPress={() => onNextCard(true)}>
                <Text style={defaultStyleSheet.buttonText}>Next Card</Text>
              </TouchableOpacity>
            )}
{showFinalResults && (
  <>
    {finalResult && (<View style={style1.container}><Text style={style2.cardNumber}>Correct</Text></View>)}
    {!finalResult && (<View style={style1.container}><Text style={style2.cardNumber}>False</Text></View>)}
  </>
)}

{endButton &&  <Link href={'/(tabs)/sets'} asChild>
            <TouchableOpacity style={defaultStyleSheet.bottomButton}>
              <Text style={defaultStyleSheet.buttonText}>End session</Text>
            </TouchableOpacity>
          </Link> }
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 100,
  },
  frontcard: {
    position: 'absolute',
    backfaceVisibility: 'hidden',
  },
  backCard: {
    backfaceVisibility: 'hidden',
  },
  bottomView: {
    position: 'absolute',
    bottom: 40,
    width: 300,
    flex: 1,
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cardNumber: {
    fontSize: 18,
    color: '#023047',
    alignSelf: 'center',
    marginTop: 20,
  },
});


const style1 = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: 300,
    height: 300,
    justifyContent: 'center',
    borderRadius: 10,
    padding: 0,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  cardNumber: {
    fontSize: 24,
    fontWeight: '100',
    color: '#023047',
    alignSelf: 'center',
    marginTop: 17,
    fontFamily: 'san-serif',
  },
});


const style2 = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: 300,
    height: 300,
    justifyContent: 'center',
    borderRadius: 10,
    padding: 0,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  cardNumber: {
    fontSize: 23,
    fontWeight: "bold",
    color: '#023047',
    alignSelf: 'center',
    marginTop: 35,
  },
});


const style3 = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: 300,
    height: 300,
    // justifyContent: 'center',
    borderRadius: 10,
    padding: 0,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  cardNumber: {
    fontSize: 23,
    backgroundColor:'white',
    fontWeight: '100',
    color: '#023047',
    // alignSelf: 'center',
    paddingTop: 17,
    marginBottom:8,
    fontFamily: 'san-serif',
  },
  cardNumberr: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#023047',
    // alignSelf: 'center',
    marginTop: 17,
    paddingBottom:15,
    fontFamily: 'san-serif',
  },
});




export default Page;
