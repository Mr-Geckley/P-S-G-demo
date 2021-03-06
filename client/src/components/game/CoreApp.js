import React, { Component } from "react";
import { bindActionCreators } from "redux";
import {
  updateBoard,
  choosePlayer,
  updateWinner,
  updateCknScore,
  updateKtnScore,
  updateCatsGame,
  updateWinGif
} from "../../actions/gamePlayActions";

import { connect } from "react-redux";
import Footer from "./Footer";
import Header from "./Header";

class CoreApp extends Component {
  // ------------------------- IGNORABLE TEST FUNCTIONS ---------------------------
  // "createListItems()" generates an unordered list from state.cknArray. This is just a test function
  createListItems() {
    return this.props.gameState.cknArray.map((token, index) => {
      return (
        <li key={index} onClick={() => this.props.consLogClick(token)}>
          {token}
        </li>
      );
    });
  }

  // "testClick()" console logs the content of a clicked target. This is a test function
  testClick(e) {
    e.preventDefault();
    this.props.consLogClick();
  }

  // ------------------------- GAME LOGIC ---------------------------

  // "generateToken" evaluates who the active player is, and outputs a random token form the appropriate array
  generateToken() {
    // create a copy of the team arrays.....
    let cknArray = this.props.gameState.cknArray;
    let ktnArray = this.props.gameState.ktnArray;
    // .....determine who the current player is.....
    let player = this.props.gameState.player;
    // .....declare a variable
    let token = null;
    token =
      // if player is chickens....
      player === "🐔"
        ? // .....pick a random chicken emoji form cknArray.....
          cknArray[Math.floor(Math.random() * cknArray.length)]
        : // .....otherwise pick a random emoji from the ktnArray.....
          ktnArray[Math.floor(Math.random() * ktnArray.length)];
    // finally, return the appropriate and random emoji :)
    return token;
  }

  // "claimSquare()" is triggered every time a game square is clicked.
  claimSquare(index) {
    // real quick, let's abbreviate 'this.props.gameState' for readability
    let state = this.props.gameState;
    // if a player is declared and there is no winner....
    if (state.player && !state.winner) {
      // .....clone the board....
      let newBoard = state.board;
      // .....then if the selected square is empty.....
      if (state.board[index] === "") {
        // .....populate the square with an appropriate token.....
        newBoard[index] = this.generateToken();

        console.log(newBoard[index]);

        // .....finally, dispatch or send the new and imporved board to the reducer & switch the player
        this.props.updateBoard(newBoard);
        // set a variable to equal the inactive player....
        let nextPlayer = state.player === "🐔" ? "😺" : "🐔";
        // ....call choosePlayer to switch turns
        this.props.choosePlayer(nextPlayer);
      }
      // after the state.board and state.player are updated, check to see if we have a winner
      this.checkCatsGame();

      this.checkWinner();
    }
  }
  // "checkWinner()" calls "checkMatch()" against it's winning combinations
  checkWinner() {
    let winLines = [
      // list all possibe winning combinations
      ["0", "1", "2"],
      ["3", "4", "5"],
      ["6", "7", "8"],
      ["0", "3", "6"],
      ["1", "4", "7"],
      ["2", "5", "8"],
      ["0", "4", "8"],
      ["2", "4", "6"]
    ];
    // call "checkMatch()" to see if we have a winning combo
    this.checkMatch(winLines);
  }

  // "checkCatsGame()" evaluates whether or not the game is a tie
  checkCatsGame() {
    //
    if (
      this.props.gameState.board.includes("") &&
      this.props.gameState.winner === null
    ) {
      console.log("not a cats game");
      return null;
    } else {
      this.props.updateCatsGame();
      console.log("cats game mutha sucka");
    }
  }
  // "checkMatch()" scans the board for 3 in a row
  checkMatch(winLines) {
    // run the loop as many times as we have winning combinations
    for (let index = 0; index < winLines.length; index++) {
      // here [a, b, c] refers to a possible winning combination, as provided by the parameter, 'winLines'.
      const [a, b, c] = winLines[index];
      // for the sake of readability, abbreviate our reference to the current game board
      let board = this.props.gameState.board;
      if (
        // position 'a' belongs to the current player and...
        this.evalToken(board[a]) &&
        // position 'a' and position 'b' belong to the current player AND...
        this.evalToken(board[a]) === this.evalToken(board[b]) &&
        // position 'a' and position 'c' belong to the current player execute the code declared below
        this.evalToken(board[a]) === this.evalToken(board[c])
      ) {
        this.declareWinner();
        this.renderGif();
      }
    }
  }

  declareWinner() {
    // spelled "state" as "stayt" so I don't get the var name mixed up with the actual state
    let stayt = this.props.gameState;

    if (stayt.player === "🐔") {
      this.props.updateCknScore();
      this.props.updateWinner();
      // console.log("CONSOLE LOG RENDER GIF: " + this.renderGif());
    } else {
      this.props.updateKtnScore();
      this.props.updateWinner();
      // this.renderGif();
      // console.log("CONSOLE LOG RENDER GIF: " + this.renderGif());
    }
  }

  // "evalToken()" determines if a token is part of the 'team' of the current player and returns a boolean
  evalToken(x) {
    // declare our result variable
    let result = false;
    result =
      // is the current player chickens?
      this.props.gameState.player === "🐔"
        ? // then check to see if the token is part of the array of chicken tokens
          (result = this.props.gameState.cknArray.includes(x))
        : // otherwise, check to see if the token is part of the kitten array
          (result = this.props.gameState.ktnArray.includes(x));
    // let me know if the token belongs to the current player
    return result;
  }

  changeBackground(player, winner) {
    let bg = "";
    if (this.props.gameState.pic !== null) {
      bg = "transparent";
    }

    return bg;
  }

  renderBoard() {
    let background = this.changeBackground(this.props.gameState.player);
    let font = this.props.gameState.pic === null ? "" : "transparent";

    return this.props.gameState.board.map((box, index) => (
      <button
        onClick={() => this.claimSquare(index)}
        className="box"
        key={index}
        style={{ backgroundColor: background, color: font }}
      >
        {box}
      </button>
    ));
  }
  //======================= gif logic ============================
  // apiCall(a) {
  //   fetch(a)
  //     .then(res => res.json())
  //     .then(result => {
  //       let gifURL = result.data.image_url;
  //       this.renderGif();
  //       return gifURL;
  //     });
  // }

  callUpdateWinGif(url) {
    this.props.updateWinGif(url);
  }

  renderGif() {
    if (!this.props.gameState.pic) {
      let httpString = "";
      // this.props.gameState.player === "🐔"
      //   ? "https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=chicken&rating=G"
      //   : "https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=kitten&rating=G";

      if (this.props.gameState.cknArray.includes("🐔")) {
        if (this.props.gameState.player === "🐔") {
          httpString =
            "https://api.giphy.com/v1/gifs/random?api_key=dfAcJOMGrFnodfBgAcjARs1Qe77W7k6W&tag=chicken&rating=G";
        } else if (this.props.gameState.player === "😺") {
          httpString =
            "https://api.giphy.com/v1/gifs/random?api_key=dfAcJOMGrFnodfBgAcjARs1Qe77W7k6W&tag=kitten&rating=G";
        }
        // return httpString;
      } else if (this.props.gameState.cknArray.includes("🎅")) {
        if (this.props.gameState.player === "🐔") {
          httpString =
            "https://api.giphy.com/v1/gifs/random?api_key=dfAcJOMGrFnodfBgAcjARs1Qe77W7k6W&tag=christmas&rating=G";
        } else if (this.props.gameState.player === "😺") {
          httpString =
            "https://api.giphy.com/v1/gifs/random?api_key=dfAcJOMGrFnodfBgAcjARs1Qe77W7k6W&tag=spooky&rating=G";
        }
      }
      fetch(httpString)
        .then(res => res.json())
        .then(result => {
          let gifURL = result.data.image_url;
          console.log(gifURL);
          this.callUpdateWinGif(gifURL);
          return gifURL;
        });
    }
  }

  // -------------------- LIFE CYCLE METHODS ---------------------------/

  componentDidMount() {
    // checks for authentication status and redirects accordingly
    if (!this.props.user.isAuthenticated) {
      this.props.history.push("/");
    }
  }

  componentWillReceiveProps(nextProps) {
    // checks for authentication status and redirects accordingly
    if (!nextProps.user.isAuthenticated) {
      this.props.history.push("/");
    }
  }
  // ----------------------- RENDER FUNCTION---------------------------------
  render() {
    let pic = this.props.gameState.pic;

    return (
      <div>
        <div className="main-screen">
          <Header />
          <div
            className="game-board row"
            style={{ background: "url(" + pic + ")" }}
          >
            {this.renderBoard()}
          </div>

          <Footer />
        </div>
      </div>
    );
  }
}

// the functions "mapStateToProps()", "mapDispatchToProps()" plug in our state and functions via "connect()"
function mapStateToProps(state) {
  return {
    gameState: state.game,
    user: state.user
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      updateBoard: updateBoard,
      choosePlayer: choosePlayer,
      updateWinner: updateWinner,
      updateCknScore: updateCknScore,
      updateKtnScore: updateKtnScore,
      updateCatsGame: updateCatsGame,
      updateWinGif: updateWinGif
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CoreApp);
