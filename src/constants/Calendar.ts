export type Game = {
  player1?: string;
  hour: string;
  player2?: string;
};

export type Card = {
  date: string;
  day: string;
  games: Game[];
};

export const calendar: Card[] = [
  {
    date: "11-06",
    day: "Quinta",
    games: [
      { player1: "mexico", hour: "16:00", player2: "south-africa" },
      { player1: "korea-republic", hour: "23:00" },
    ],
  },
  {
    date: "12-06",
    day: "Sexta",
    games: [
      { player1: "canada", hour: "12:00" },
      { player1: "usa", hour: "22:00", player2: "paraguay" },
    ],
  },
  {
    date: "13-06",
    day: "Sábado",
    games: [
      { player1: "qatar", hour: "16:00", player2: "switzerland" },
      { player1: "brazil", hour: "19:00", player2: "marocco" },
      { player1: "haiti", hour: "22:00", player2: "scotland" },
      { player1: "australia", hour: "01:00" },
    ],
  },
  {
    date: "14-06",
    day: "Domingo",
    games: [
      { player1: "germany", hour: "14:00", player2: "curaçao" },
      { player1: "netherlands", hour: "17:00", player2: "japan" },
      { player1: "costa-do-marfim", hour: "20:00", player2: "ecuador" },
      { hour: "23:00", player2: "tunisia" },
    ],
  },
  {
    date: "15-06",
    day: "Segunda",
    games: [
      { player1: "spain", hour: "13:00", player2: "cabo-verde" },
      { player1: "belgium", hour: "16:00", player2: "egypt" },
      { player1: "saudi-arabia", hour: "19:00", player2: "uruguay" },
      { player1: "iran", hour: "22:00", player2: "new-zealand" },
    ],
  },
  {
    date: "16/06",
    day: "Terça",
    games: [
      { player1: "france", hour: "16:00", player2: "senegal" },
      { hour: "19:00", player2: "norway" },
      { player1: "argentina", hour: "22:00", player2: "algeria" },
      { player1: "austria", hour: "01:00", player2: "jordan" },
    ],
  },
  {
    date: "17-06",
    day: "Quarta",
    games: [
      { player1: "portugal", hour: "14:00" },
      { player1: "england", hour: "17:00", player2: "croatia" },
      { player1: "ghana", hour: "20:00", player2: "panama" },
      { player1: "uzbekistan", hour: "23:00", player2: "colombia" },
    ],
  },
  {
    date: "18-06",
    day: "Quinta",
    games: [
      { hour: "13:00", player2: "south-africa" },
      { player1: "switzerland", hour: "16:00" },
      { player1: "canada", hour: "19:00", player2: "qatar" },
      { player1: "mexico", hour: "22:00", player2: "korea-republic" },
    ],
  },
  {
    date: "19-06",
    day: "Sexta",
    games: [
      { player1: "usa", hour: "16:00", player2: "australia" },
      { player1: "scotland", hour: "19:00", player2: "marocco" },
      { player1: "brazil", hour: "22:00", player2: "haiti" },
      { hour: "01:00", player2: "paraguay" },
    ],
  },
  {
    date: "20-06",
    day: "Sábado",
    games: [
      { player1: "netherlands", hour: "14:00" },
      { player1: "germany", hour: "17:00", player2: "costa-do-marfim" },
      { player1: "ecuador", hour: "21:00", player2: "curaçao" },
      { player1: "tunisia", hour: "01:00", player2: "japan" },
    ],
  },
  {
    date: "21-06",
    day: "Domingo",
    games: [
      { player1: "spain", hour: "13:00", player2: "saudi-arabia" },
      { player1: "belgium", hour: "16:00", player2: "iran" },
      { player1: "uruguay", hour: "19:00", player2: "cabo-verde" },
      { player1: "new-zealand", hour: "22:00", player2: "egypt" },
    ],
  },
  {
    date: "22-06",
    day: "Segunda",
    games: [
      { player1: "argentina", hour: "14:00", player2: "austria" },
      { player1: "france", hour: "18:00" },
      { player1: "norway", hour: "21:00", player2: "senegal" },
      { player1: "jordan", hour: "00:00", player2: "algeria" },
    ],
  },
  {
    date: "23-06",
    day: "Terça",
    games: [
      { player1: "portugal", hour: "14:00", player2: "uzbekistan" },
      { player1: "england", hour: "17:00", player2: "ghana" },
      { player1: "panama", hour: "20:00", player2: "croatia" },
      { player1: "colombia", hour: "23:00" },
    ],
  },
  {
    date: "24-06",
    day: "Quarta",
    games: [
      { player1: "switzerland", hour: "16:00", player2: "canada" },
      { hour: "16:00", player2: "qatar" },
      { player1: "marocco", hour: "19:00", player2: "haiti" },
      { player1: "scotland", hour: "19:00", player2: "brazil" },
      { player1: "south-africa", hour: "22:00", player2: "korea-republic" },
      { hour: "22:00", player2: "mexico" },
    ],
  },
  {
    date: "25-06",
    day: "Quinta",
    games: [
      { player1: "curaçao", hour: "17:00", player2: "costa-do-marfim" },
      { player1: "ecuador", hour: "17:00", player2: "germany" },
      { player1: "tunisia", hour: "20:00", player2: "netherlands" },
      { player1: "japan", hour: "20:00" },
      { hour: "23:00", player2: "usa" },
      { player1: "paraguay", hour: "23:00", player2: "australia" },
    ],
  },
  {
    date: "26-06",
    day: "Sexta",
    games: [
      { player1: "norway", hour: "16:00", player2: "france" },
      { player1: "senegal", hour: "16:00" },
      { player1: "cabo-verde", hour: "21:00", player2: "saudi-arabia" },
      { player1: "uruguay", hour: "21:00", player2: "spain" },
      { player1: "new-zealand", hour: "00:00", player2: "belgium" },
      { player1: "egypt", hour: "00:00", player2: "iran" },
    ],
  },
  {
    date: "27-06",
    day: "Sábado",
    games: [
      { player1: "panama", hour: "18:00", player2: "england" },
      { player1: "croatia", hour: "18:00", player2: "ghana" },
      { player1: "colombia", hour: "20:30", player2: "portugal" },
      { hour: "20:30", player2: "uzbekistan" },
      { player1: "algeria", hour: "23:00", player2: "austria" },
      { player1: "jordan", hour: "23:00", player2: "argentina" },
    ],
  },
];