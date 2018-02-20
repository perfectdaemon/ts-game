export class LevelData {
  tileSize: number = 0;
  tileTypes: {
    id: string,
    region: string,
  }[] = [];
  map: string = ``;
}

export const LEVEL_DATA: LevelData[] = [
  {
    tileSize: 32,
    tileTypes: [
      { id: '1', region: 'wall1.png' },
      { id: '2', region: 'wall2.png' },
      { id: '3', region: 'wall3.png' },
      { id: '4', region: 'wall4.png' },
      { id: '5', region: 'wall5.png' },
      { id: '6', region: 'wall6.png' },
    ],

    map:
      `
11111111111111111111
1                  2
1                  3
1                  4
1                  5
1                  6
1                  2
1                  3
11111111111111111111
    `,
  },
];
