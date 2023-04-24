import React, { useEffect, useState } from "react";
import { styles } from "../App.js";
import { StatusBar } from "expo-status-bar";
import { Text, View, FlatList } from "react-native";
import { Button, ButtonGroup } from "@rneui/themed";

function Summary({ data, answers }) {
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Calculate the score by comparing the user's answers with the correct answers
    let newScore = 0;
    data.forEach((question, index) => {
      const userAnswer = answers[index];
      const correctAnswer = question.correct;
      if (userAnswer === correctAnswer) {
        newScore++;
      }
    });
    setScore(newScore);
  }, [answers]);

  return (
    <View style={styles.container}>
      <Text>Your score: {score}</Text>
      {/* Display the user's answers for each question */}
      {data.map((question, index) => (
        <View key={index}>
          <Text>{question.prompt}</Text>
          <Text>Your answer: {question.choices[answers[index]]}</Text>
          <Text>Correct answer: {question.choices[question.correct]}</Text>
        </View>
      ))}
    </View>
  );
}

export default function Question({ route }) {
  const { data } = route.params;

  // state variable that goes through each question in the data array
  const [questionIndex, setQuestionIndex] = useState(0);

  // state variable that keeps track of the choice that users selects
  const [choiceIndex, setChoiceIndex] = useState(null);

  // for multiple answers
  const [choicesIndex, setChoicesIndex] = useState([]);

  // Array of the user's answers for each question
  const [answers, setAnswers] = useState([]);

  const question = data[questionIndex];
  const { choices, prompt, type, correct } = question;

  // debugging
  useEffect(() => {
    console.log(choicesIndex);
  });

  // selecting multiple answer function
  const multiSelect = (index) => {
    setChoicesIndex((prevIndex) => [...prevIndex, index]);

    // if user wants to deselect an answer
    if (choicesIndex.includes(index)) {
      setChoicesIndex((choicesIndex) =>
        choicesIndex.filter((item) => item !== index)
      );
    }
  };

  // checks type of question, checks user selection
  const answerPress = (index, type) => {
    switch (type) {
      case "multiple-choice":
        setChoiceIndex(index);
        break;
      case "multiple-answer":
        multiSelect(index);
        break;
      case "true-false":
        setChoiceIndex(index);
        break;
      case "matching":
        const newChoicesIndex = [...choicesIndex];
        const matchIndex = newChoicesIndex.findIndex((item) => item === null);
        newChoicesIndex[matchIndex] = index;
        setChoicesIndex(newChoicesIndex);
        break;
    }
  };

  const submitQuestion = () => {
    // TODO: check answer and update score
    const newAnswers = [...answers];
    newAnswers[questionIndex] =
      type === "multiple-answer" ? choicesIndex : choiceIndex;
    setAnswers(newAnswers);

    if (questionIndex === data.length - 1) {
      // If this is the last question, show the summary
      return;
    }

    setQuestionIndex(questionIndex + 1);
    setChoiceIndex(null);
    setChoicesIndex([]);
  };


  if (answers.length === data.length) {
    // If the user has answered all questions, show the summary
    return <Summary data={data} answers={answers} />;
  }

  return (
    <View style={styles.container}>
      <Text>{prompt}</Text>
      {
        //conditionally rendering a single answer question or multi question
        (type === 'multiple-answer') ? 
          <ButtonGroup
            buttons={choices}
            selectedIndexes={choicesIndex}
            onPress={(value) => {
              answerPress(value, type)
            }}
          />
        : (type === 'true-false') ?
          <ButtonGroup
            buttons={choices}
            selectedIndex={choiceIndex}
            onPress={(value) => {
              answerPress(value, type)
            }}
          />
        :
          <ButtonGroup
            buttons={choices}
            selectedIndex={choiceIndex}
            onPress={(value) => {
              answerPress(value, type)
            }}
          />
      }
      <Button onPress={submitQuestion}>Submit</Button>
    </View>
  )
}
