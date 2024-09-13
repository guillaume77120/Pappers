import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert } from 'react-native';

const JustePrix = () => {
  // Définir la fonction `generateRandomNumber` avant son utilisation
  const generateRandomNumber = () => Math.floor(Math.random() * 100) + 1;

  const [guess, setGuess] = useState('');
  const [randomNumber, setRandomNumber] = useState(generateRandomNumber());
  const [message, setMessage] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);  // 30 secondes pour jouer
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
      setMessage('Temps écoulé ! Vous avez perdu.');
    }
  }, [timeLeft, gameOver]);

  const handleGuess = () => {
    if (gameOver) return;

    const guessNumber = parseInt(guess, 10);
    if (isNaN(guessNumber)) {
      Alert.alert('Veuillez entrer un nombre valide');
      return;
    }

    setAttempts(attempts + 1);

    if (guessNumber < randomNumber) {
      setMessage('C\'est plus !');
    } else if (guessNumber > randomNumber) {
      setMessage('C\'est moins !');
    } else {
      setMessage(`Félicitations ! Vous avez trouvé le Juste Prix en ${attempts + 1} tentatives !`);
      setGameOver(true);
    }
  };

  const handlePlayAgain = () => {
    setRandomNumber(generateRandomNumber());
    setGuess('');
    setMessage('');
    setAttempts(0);
    setTimeLeft(30);
    setGameOver(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Devinez le Juste Prix !</Text>
      <Text>Temps restant : {timeLeft} secondes</Text>
      <Text>Nombre de tentatives : {attempts}</Text>

      {!gameOver ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Entrez un nombre"
            keyboardType="numeric"
            value={guess}
            onChangeText={setGuess}
          />
          <Button title="Valider" onPress={handleGuess} />
          {message ? <Text style={styles.message}>{message}</Text> : null}
        </>
      ) : (
        <>
          <Text style={styles.message}>{message}</Text>
          <Button title="Play Again" onPress={handlePlayAgain} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default JustePrix;
