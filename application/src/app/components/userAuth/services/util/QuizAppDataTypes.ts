export class User {
  public name: string = '';
  public isLoggedIn: boolean = false;
  public isInsideLobby: boolean = false;
  public currentScore: number = 0;
  public currentWrongAnswers: number = 0;
  public currentCorrectAnswers: number = 0;
  public currentStreak: number = 0;
  public answerSubmitted: boolean = false;
}

export class LobbyInfo {
  public name: string = '';
  public leader: User = new User();
  public users: User[] = []; // All current Users in Lobby (joined + leader)
  public categoryName: string = '';
  public totalQuestionCount: number = 0;
  public difficulty: string = '';
  public maxTimerSeconds: number = 0;
  public started: boolean = false;
  public currentQuestionIndex: number = 0;
  public currentQuestionTopic: QuizQuestion = new QuizQuestion();
  public finished: boolean = false;
  public isStarting: boolean = false;
  public currentTimer: number = 0;
}

// Same interface as requested from opentdb
export class QuizQuestion {
  public question: string = '';
  public category: string = '';
  public type: string = '';
  public difficulty: string = '';
  public shuffledAnswers: string[] = [];
}
