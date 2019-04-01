import { SET_PLAYER } from "../actions/types";

const initialState = {
  board: Array(9).fill(""),
  player: null,
  winner: null,
  catsGame: false,
  cknArray: ["🐔", "🐓", "🐣", "🐤", "🐥"],
  ktnArray: ["🐆", "🐈", "😺", "😻", "😾"],
  cknScore: 0,
  ktnScore: 0,
  pic: null,
  isLoaded: false
};

export default function(state = initialState, action) {
  if (action.type === SET_PLAYER) {
    return {
      ...state,
      player: action.val
    };
  }

  return { ...state };
}
