import { FlatList, Pressable, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'

import Icons from './components/Icons'
import Snackbar from 'react-native-snackbar'

const App = (): JSX.Element => {
  enum GameState {
    Empty = 'empty',
    Cross = 'cross',
    Circle = 'circle',
  }

  const [isCross, setIsCross] = useState<boolean>(false);
  const [gameWinner, setGameWinner] = useState<string>('');
  const [gameState, setGameState] = useState<GameState[]>(new Array(9).fill(GameState.Empty));

  const reloadGame = () => {
    setIsCross(false);
    setGameWinner('');
    setGameState(new Array(9).fill(GameState.Empty));
  };

  const checkIsWinner = () => {
    const winningCombinations: number[][] = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6],            // Diagonals
    ]

    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (
        gameState[a] !== GameState.Empty &&
        gameState[a] === gameState[b] &&
        gameState[b] === gameState[c]
      ) {
        setGameWinner(`${gameState[a]} won the game! 🥳`);
        return;
      }
    }

    if (!gameState.includes(GameState.Empty)) {
      setGameWinner('Draw game... ⌛️');
    }
  }

  const onChangeItem = (itemNumber: number) => {
    if (gameWinner) {
      return Snackbar.show({
        text: gameWinner,
        backgroundColor: '#000000',
        textColor: '#ffffff',
      })
    }

    if (gameState[itemNumber] === GameState.Empty) {
      gameState[itemNumber] = isCross ? GameState.Cross : GameState.Circle;
      setIsCross(!isCross);
    } else {
      return Snackbar.show({
        text: 'Already filled',
        backgroundColor: '#000000',
        textColor: '#ffffff',
      });
    }

    checkIsWinner();
  }

  return (
    <SafeAreaView>
      <StatusBar />
      {gameWinner ? (
        <View style={[styles.playerInfo, styles.winnerInfo]}>
          <Text style={styles.winnerTxt}>{gameWinner}</Text>
        </View>
      ) : (
        <View style={[
          styles.playerInfo,
          isCross ? styles.playerX : styles.playerO]}>
          <Text style={styles.gameTurnTxt}>Player {isCross ? 'X' : 'O'}'s Turn</Text>
        </View>
      )}
      <FlatList
        numColumns={3}
        data={gameState}
        style={styles.grid}
        renderItem={({ item, index }) => (
          <Pressable
            style={styles.card}
            key={index}
            onPress={() => onChangeItem(index)}
          >
            <Icons name={item} />
          </Pressable>
        )}
      />
      <Pressable style={styles.gameBtn} onPress={reloadGame}>
        <Text style={styles.gameBtnText}>{gameWinner ? 'Start new game' : 'Play Again'}</Text>
      </Pressable>
    </SafeAreaView>
  )
}

export default App

const styles = StyleSheet.create({
  playerInfo: {
    height: 56,

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    borderRadius: 4,
    paddingVertical: 8,
    marginVertical: 12,
    marginHorizontal: 14,

    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowColor: '#333',
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  gameTurnTxt: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  playerX: {
    backgroundColor: '#38CC77',
  },
  playerO: {
    backgroundColor: '#F7CD2E',
  },
  grid: {
    margin: 12,
  },
  card: {
    height: 100,
    width: '33.33%',

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: '#333',
  },
  winnerInfo: {
    borderRadius: 8,
    backgroundColor: '#38CC77',

    shadowOpacity: 0.1,
  },
  winnerTxt: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  gameBtn: {
    alignItems: 'center',

    padding: 10,
    borderRadius: 8,
    marginHorizontal: 36,
    backgroundColor: '#8D3DAF',
  },
  gameBtnText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  emptyCard: {
    backgroundColor: '#B0B0B0', // Set a color for empty cells
    borderColor: '#A0A0A0', // Set a border color for empty cells
    borderWidth: 1,
  },
});