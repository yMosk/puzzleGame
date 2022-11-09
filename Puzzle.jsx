import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { JigsawPuzzle } from "react-jigsaw-puzzle/lib";
import "react-jigsaw-puzzle/lib/jigsaw-puzzle.css";

import { CloseButton } from "atomic/atoms/containers";
import useWindowDimensions from "hooks/useWindowDimensions";
import Dropdown from "primitives/DropDown/Dropdown";

import {
  fetchUserLevels,
  insertNewUser,
  insertNewGame,
  updatePlayerCurrentLevel,
  getAllPlayerGamesByLevel,
} from "./puzzleService";
import { TimerContainer } from "./Timer";

export const Puzzle = ({ imgSrc, setPuzzleOn, setPuzzleButton }) => {
  const auth = useSelector((state) => state.auth);

  const { w: width } = useWindowDimensions();
  const isMobile = width.isLessThan("768px");

  const [bestTime, setBestTime] = useState(null);
  const [stopTimer, setStopTimer] = useState(false);
  let timer;

  const [player, setPlayer] = useState(null);
  const [text, setText] = useState("Unpuzzle the pieces!!");
  const [gameId, setGameId] = useState(null);
  const [gameLevel, setGameLevel] = useState({
    text: "Level 1",
    value: "2",
  });

  const dropdownOptions = [
    {
      text: "Level 1",
      value: "2",
    },
    {
      text: "Level 2",
      value: "3",
    },
    {
      text: "Level 3",
      value: "4",
    },
    {
      text: "Level 4",
      value: "5",
    },
    {
      text: "Level 5",
      value: "6",
    },
    {
      text: "Level 6",
      value: "7",
    },
    {
      text: "Level 7",
      value: "8",
    },
    {
      text: "Level 8",
      value: "9",
    },
    {
      text: "Level 9",
      value: "10",
    },
  ];

  useEffect(() => {
    fetchUserLevels(auth?.user?.id).then((response) => {
      setPlayer(response?.data[0]);
      if (response.data.length === 0) insertNewUser(auth?.user?.id);
    });

    setGameId(Math.floor(Math.random() * Date.now()));
  }, [auth]);

  useEffect(() => {
    if (player) {
      setGameLevel(() => {
        return {
          text: `Level ${player?.currentLevel}`,
          value: `${player?.currentLevel + 1}`,
        };
      });
    }
  }, [player]);

  useEffect(() => {
    if (bestTime) setText(`Best time: ${bestTime}`);
    else setText("Unpuzzle the pieces!!");
  }, [bestTime, gameLevel]);

  useEffect(() => {
    if (player)
      getAllPlayerGamesByLevel(player?.id, gameLevel?.value - 1).then(
        (response) => {
          setBestTime(bestTimeForLevel(response?.data));
        }
      );
  }, [gameLevel]);

  const onSolved = () => {
    setStopTimer(true);
    insertNewGame(gameId, player?.id, gameLevel?.value - 1, timer);
    updatePlayerCurrentLevel(player?.id, gameLevel?.value);
    setText(`Congratulations!! Your time: ${timer}`);
  };

  const dropdownHandler = (value) => {
    setStopTimer(true);
    setGameId(Math.floor(Math.random() * Date.now()));

    updatePlayerCurrentLevel(player?.id, value - 1).then(() => {
      setGameLevel(() => {
        return { text: `Level ${value - 1}`, value: `${value}` };
      });
      setStopTimer(false);
    });
  };

  const bestTimeForLevel = (arr) => {
    const converter = (strTime) => {
      let arr = strTime.split(":");
      let minutes = parseInt(arr[0], 10);
      let seconds = parseInt(arr[1], 10);
      return minutes * 60 + seconds;
    };

    let bestTime = null;
    let bestTimeStr = null;

    for (let i = 0; i < arr.length; i++) {
      let currentTime = converter(arr[i].time);

      if (!bestTime) {
        bestTime = currentTime;
        bestTimeStr = arr[i].time;
      }

      if (currentTime < bestTime) {
        bestTime = currentTime;
        bestTimeStr = arr[i].time;
      }
    }

    return bestTimeStr;
  };

  return (
    <>
      {isMobile ? (
        <div className="flex flex-row h-auto relative">
          <div className="flex flex-col p-1">
            <Dropdown
              defaultOption={gameLevel}
              onAnswer={dropdownHandler}
              options={dropdownOptions}
            />
          </div>

          <div className="flex flex-col self-center pt-1 pl-1">
            <h6>{text}</h6>

            {stopTimer ? null : (
              <div className="flex flex-row mt-[-5px]">
                <h6>Current time: &nbsp;</h6>
                <TimerContainer
                  timerHandler={(time) => {
                    timer = time;
                  }}
                  stopTimer={stopTimer}
                />
              </div>
            )}
          </div>

          <div className="flex flex-col top-0 right-0 absolute">
            <CloseButton
              onClick={() => {
                setPuzzleOn(false);
                setPuzzleButton(true);
              }}
            >
              <img src="/images/icon-close.svg" alt="Close Modal" />
            </CloseButton>
          </div>
        </div>
      ) : (
        <div className="flex flex-row h-auto">
          <div className="flex flex-col p-1">
            <Dropdown
              defaultOption={gameLevel}
              onAnswer={dropdownHandler}
              options={dropdownOptions}
            />
          </div>

          <div className="flex flex-row">
            <h6 className="flex flex-col self-center pl-1 pr-1">{text}</h6>
            {stopTimer ? null : (
              <div className="flex flex-row self-center pl-2">
                <h6>Current time: &nbsp;</h6>
                <TimerContainer
                  timerHandler={(time) => {
                    timer = time;
                  }}
                  stopTimer={stopTimer}
                />
              </div>
            )}
          </div>

          <CloseButton
            className="flex flex-col w-3 h-3"
            onClick={() => {
              setPuzzleOn(false);
              setPuzzleButton(true);
            }}
          >
            <img src="/images/icon-close.svg" alt="Close Modal" />
          </CloseButton>
        </div>
      )}

      <div className="w-full h-max m-auto rounded-md shadow-md">
        <JigsawPuzzle
          imageSrc={imgSrc}
          rows={gameLevel?.value}
          columns={gameLevel?.value}
          onSolved={onSolved}
          className="jigsaw-puzzle"
        />
      </div>
    </>
  );
};

export default Puzzle;
