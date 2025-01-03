import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { Audio } from 'expo-av';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import * as ScreenOrientation from 'expo-screen-orientation';

const { width, height } = Dimensions.get('window');
const App = () => {

  useEffect(() => {
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    };
    lockOrientation();
  }, []);

  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [setsA, setSetsA] = useState(0);
  const [setsB, setSetsB] = useState(0);

  const [history, setHistory] = useState<{ scoreA: number; scoreB: number; setsA: number; setsB: number }[]>([]);

  const [teamNameA, setTeamNameA] = useState('Time A');
  const [teamNameB, setTeamNameB] = useState('Time B');
  const [colorA, setColorA] = useState('#F8C224');
  const [colorB, setColorB] = useState('#2057D8');

  const [setGoal, setSetGoal] = useState(25); // Inicialmente 25 pontos para terminar o set

  const [time, setTime] = useState(0); // Tempo em segundos
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!isRunning && interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const [fontsLoaded] = useFonts({
    'Fonte1': require('../../assets/fonts/DS-DIGI.ttf'),
    'Fonte2': require('../../assets/fonts/DS-DIGIB.ttf'),
    'Fonte3': require('../../assets/fonts/DS-DIGII.ttf'),
    'Fonte4': require('../../assets/fonts/DS-DIGIT.ttf'),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }
  
  const playWhistle = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/images/Whistle.mp3') // Adicione seu arquivo de som na pasta assets
    );
    await sound.playAsync();
  };



  const incrementScore = (team: 'A' | 'B') => {
    setHistory([...history, { scoreA, scoreB, setsA, setsB }]);
  
    if (team === 'A') {
      const newScoreA = scoreA + 1;
      setScoreA(newScoreA);
  
      // Verificar se o Time A atingiu o objetivo do set com diferença de 2 pontos
      if (newScoreA >= setGoal && newScoreA >= scoreB + 2) {
        setScoreA(0); // Reseta o placar
        setScoreB(0); // Reseta o placar
        setSetsA(setsA + 1); // Aumenta o número de sets ganhos pelo Time A
      }
    } else {
      const newScoreB = scoreB + 1;
      setScoreB(newScoreB);
  
      // Verificar se o Time B atingiu o objetivo do set com diferença de 2 pontos
      if (newScoreB >= setGoal && newScoreB >= scoreA + 2) {
        setScoreA(0); // Reseta o placar
        setScoreB(0); // Reseta o placar
        setSetsB(setsB + 1); // Aumenta o número de sets ganhos pelo Time B
      }
    }
  };

  const resetGame = () => {
    setScoreA(0);
    setScoreB(0);
    setSetsA(0);
    setSetsB(0);
    setTime(0); // Reinicia o tempo
    setIsRunning(false); // Pausa o timer
  };

  const undoScore = () => {
    if (history.length > 0) {
      const lastState = history.pop(); // Recupera o último estado do histórico
      setHistory([...history]); // Atualiza o histórico (remove o último estado)
      if (lastState) {
        setScoreA(lastState.scoreA);
        setScoreB(lastState.scoreB);
        setSetsA(lastState.setsA);
        setSetsB(lastState.setsB);
      }
    } 
  };

  const swapTeams = () => {
    // Troca as pontuações, sets, nomes e cores entre os times A e B
    setScoreA(scoreB);
    setScoreB(scoreA);
    setSetsA(setsB);
    setSetsB(setsA);
  
    // Troca os nomes
    setTeamNameA(teamNameB);
    setTeamNameB(teamNameA);
  
    // Troca as cores
    setColorA(colorB);
    setColorB(colorA);
  };

  const toggleSetGoal = () => {
    if (setGoal === 25) {
      setSetGoal(21);
    } else if (setGoal === 21) {
      setSetGoal(15);
    } else {
      setSetGoal(25); // Retorna para 25
    }
  };
  
  const configurations = (team: 'A' | 'B') =>{
  } 
  
  

  return (
    <ImageBackground
      source={require('../../assets/images/Background.png')} // Substitua pelo caminho correto
      style={styles.container}
      resizeMode="cover" // Ajusta como a imagem se comporta no fundo
    >
      {/* Time A */}
      <View style={styles.teamContainer}>
      <Text style={[styles.teamName, { color: colorA }]}>{teamNameA}</Text>
  <TouchableOpacity onPress={() => incrementScore('A')}  activeOpacity={1}>
    <View style={[styles.scoreBox, { backgroundColor: colorA }]}>
      <Text style={styles.scoreText}>{scoreA}</Text>
    </View>
  </TouchableOpacity>
      </View>

      {/* Central Logo */}
      <View style={styles.centerContainer}>
        <Image
          source={require('../../assets/images/Logo.png')} // Substitua pelo logo correto
          style={styles.logo}
        />
        
         {/* Exibindo os sets */}
      <View style={styles.setsContainer}>
        <View style={[styles.setBox, {  backgroundColor: colorA }]}>
          <Text style={styles.setText}>{setsA}</Text>
        </View>
        <Text style={styles.setsVs}>x</Text>
        <View style={[styles.setBox, {  backgroundColor: colorB }]}>
          <Text style={styles.setText}>{setsB}</Text>
        </View>
      </View>


      <View style={styles.timer}>
          <TouchableOpacity onPress={toggleTimer}>
            <Text style={styles.timerText}>{formatTime(time)}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity onPress={playWhistle}>
            <Text style={styles.button}> <Image
          source={require('../../assets/images/Vector.png')} // Substitua pelo logo correto
          style={styles.button1}/></Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={resetGame}>
          <Text style={styles.button}> <Image
          source={require('../../assets/images/Vector-1.png')} // Substitua pelo logo correto
          style={styles.button2}/></Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={undoScore}>
          <Text style={styles.button}> <Image
          source={require('../../assets/images/Vector-2.png')} // Substitua pelo logo correto
          style={styles.button3}/></Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity onPress={swapTeams}>
          <Text style={styles.button}><Image
          source={require('../../assets/images/Vector-3.png')} // Substitua pelo logo correto
          style={styles.button4}/></Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleSetGoal}>
    <Text style={styles.setGoalButton}>{setGoal}</Text>
  </TouchableOpacity>
  
          <TouchableOpacity>
          <Text style={styles.button}> <Image
          source={require('../../assets/images/Group.png')} // Substitua pelo logo correto
          style={styles.button6}/></Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Time B */}
      <View style={styles.teamContainer}>
      <Text style={[styles.teamName, { color: colorB }]}>{teamNameB}</Text>
  <TouchableOpacity onPress={() => incrementScore('B')}  activeOpacity={1}>
    <View style={[styles.scoreBox, { backgroundColor: colorB }]}>
      <Text style={styles.scoreText}>{scoreB}</Text>
    </View>
  </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
  },
  setsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  setBox: {
    width: width * 0.05, // 12% da largura da tela
    height: width * 0.05, // 12% da largura da tela
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    boxShadow: '0 1 3px rgba(0, 0, 0, 0.25)',
  },
  setText: {
    fontSize: width * 0.05, // Ajuste do tamanho do texto com base na largura
    color: '#fff',
    fontFamily: 'Fonte1',
  },
  setsVs: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  setGoalContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  setGoalButton: {
    fontSize: 36,
    fontFamily: 'Fonte2',
    color: '#fff',
  },
  teamContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  button1: {
    width: width * 0.035, // Ajuste da largura
    height: height * 0.08, // Ajuste da altura
  },
  button2: {
    width: width * 0.028, 
    height: height * 0.068,
  },
  button3: {
    width: width * 0.035,
    height: height * 0.035,
  },
  button4: {
    width: width * 0.035,
    height: height * 0.055,
  },
  button5: {
    width: width * 0.08,
    height: height * 0.035,
  },
  button6: {
    width: width * 0.04,
    height: height * 0.085,
  },

  teamName: {
    fontSize: width * 0.03, // Ajuste do tamanho da fonte com base na largura
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Fonte1',
  },
  scoreBox: {
    width: width * 0.27, // Ajuste de largura para responsividade
    height: width * 0.27, // Ajuste de altura para responsividade
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    boxShadow: '0 2 4px rgba(0, 0, 0, 0.25)',
  },
  scoreText: {
    fontSize: width * 0.25, // Ajuste do tamanho do texto com base na largura
    color: '#fff',
    fontFamily: 'Fonte1',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  logo: {
    width: width * 0.15, // Ajuste da largura do logo
    height: width * 0.15, // Ajuste da altura do logo
    marginBottom: 10,
  },
  timer: {
    backgroundColor: '#2057D8',
    paddingHorizontal: 30,
    paddingVertical: 5,
    borderRadius: 3,
    boxShadow: '0 2 4px rgba(0, 0, 0, 0.25)',
  },
  timerText: {
    fontSize: 35,
    color: '#fff',
    fontFamily: 'Fonte1',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginTop: 10,
  },
  button: {
    fontSize: 32,
    color: '#fff',
    marginHorizontal: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
});

export default App;
