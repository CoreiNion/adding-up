'use strict';
// fs(FileSystem)モジュールを読み込んで使えるようにする
const fs = require('fs');
// readlineモジュールを読み込んで使えるようにする
const readline = require('readline');
// popu-pref.csvをファイルとして読み込める状態にする
const rs = fs.createReadStream('./popu-pref.csv');
// readlineモジュールに fs を設定する
const rl = readline.createInterface({ input: rs, output: {} });
// key: 都道府県 value: 集計データのオブジェクト
const prefectureDataMap = new Map();
// rlpopu-pref.csvのデータを1行ずつ読み込んで、設定された関数を実行する
rl.on('line', lineString => {
    // ["2010","北海道","237155","258530"]のようなデータ配列に分割
    const columns = lineString.split(',');
    const year = parseInt(columns[0]); //年
    const prefecture = columns[1]; //　都道府県
    const popu = parseInt(columns[3]); // 15〜19歳の人口
    if (year === 2010 || year === 2015) {
        let def = { popu10: 0 ,popu15: 0 ,change: null };
        //都道府県ごとのデータを作る。データがなかったらデータを初期化。
        let value = prefectureDataMap.get(prefecture) || def;
        if (year === 2010) {
            value.popu10 = popu;
        }　else if (year === 2015) {
            value.popu15 = popu;
        }
        prefectureDataMap.set(prefecture, value);
    }
});

rl.on('close', () => {
    for (let [prefecture, data] of prefectureDataMap) {
        data.change = data.popu15 / data.popu10;
    }
    //並び替えを行う
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
        // 引き算の結果、マイナスなら降順、プラスなら降順に切り替え
        return pair2[1].change - pair1[1].change;
    });
    const rankingStrings = rankingArray.map(([key, value]) => {
        return (
          key +
          ': ' +
          value.popu10 +
          '=>' +
          value.popu15 +
          ' 変化率:' +
          value.change
        );
    });
    console.log(rankingStrings);
});
