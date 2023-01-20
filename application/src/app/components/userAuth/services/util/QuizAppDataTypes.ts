export class User {
  public name: string = "";
  public isLoggedIn: boolean = false;
  public isInsideLobby: boolean = false;
}

export class LobbyInfo {
  public name: string = "";
  public leader: string = "";
  public users: string[] = []; // All current Users in Lobby (joined + leader)
  public category: string = "";
  public totalQuestions: number = 0;
  public difficulty: string = "";
  public started: boolean = false;
}
