// const data = [
//   {"Topic":"Drill/TaskCmd","Data":[1,2,3,4,5,6,7,8,9,10,11,12,13,14]},
//   {"Topic":"Drill/TaskSts","Data":[10,20,30,8884,85,6,70,8,9,10,811,12,138,14]},
//   {"Topic":"Hoist/TaskSts","Data":[10,20,30,8884,85,6,70,8,9,10,811,12,138,14]}
// ]

// const mapTableData = () => {
//   const headers = [];
//   data.forEach((header) => {
//      headers.push(header["Topic"]);
//   });

//  const result = data[0].Data.map((fff,index)=> {
//      const res = {};

//      headers.forEach(header=>{
//          res[header] = data.find(dd => dd.Topic === header).Data[index]
//      });
//      return res;
//   });

//   console.log(headers);
//   console.log(result);
// }

// mapTableData();

//   const respone = [
//     { 'Drill/TaskCmd': 1, 'Drill/TaskSts': 10, 'Hoist/TaskSts': 10 },
//     { 'Drill/TaskCmd': 2, 'Drill/TaskSts': 20, 'Hoist/TaskSts': 20 },
//     { 'Drill/TaskCmd': 3, 'Drill/TaskSts': 30, 'Hoist/TaskSts': 30 },
//     { 'Drill/TaskCmd': 4, 'Drill/TaskSts': 8884, 'Hoist/TaskSts': 8884 },
//     { 'Drill/TaskCmd': 5, 'Drill/TaskSts': 85, 'Hoist/TaskSts': 85 },
//     { 'Drill/TaskCmd': 6, 'Drill/TaskSts': 6, 'Hoist/TaskSts': 6 },
//     { 'Drill/TaskCmd': 7, 'Drill/TaskSts': 70, 'Hoist/TaskSts': 70 },
//     { 'Drill/TaskCmd': 8, 'Drill/TaskSts': 8, 'Hoist/TaskSts': 8 },
//     { 'Drill/TaskCmd': 9, 'Drill/TaskSts': 9, 'Hoist/TaskSts': 9 },
//     { 'Drill/TaskCmd': 10, 'Drill/TaskSts': 10, 'Hoist/TaskSts': 10 },
//     { 'Drill/TaskCmd': 11, 'Drill/TaskSts': 811, 'Hoist/TaskSts': 811 },
//     { 'Drill/TaskCmd': 12, 'Drill/TaskSts': 12, 'Hoist/TaskSts': 12 },
//     { 'Drill/TaskCmd': 13, 'Drill/TaskSts': 138, 'Hoist/TaskSts': 138 },
//     { 'Drill/TaskCmd': 14, 'Drill/TaskSts': 14, 'Hoist/TaskSts': 14 }
//   ]

//   const mapResponse = () => {
//     const keys = Object.keys(respone[0]).map(key => key);

//     const reMapData = keys.map(key=> {
//         console.log(key);
//         return {"Topic": key, "Data": respone.map(data => {
//             console.log(data[key]);
//             return data[key]
//         })};
//     })
//     console.log(reMapData);
//  }
//  mapResponse();

// function binaryPattrenMatching(pattern, string) {
//   let counter = 0
//   let stop = string.length - pattern.length
//   for (let i = 0; i <= stop; i++) {
//       let substring = string.substr(i, pattern.length)

//       if (substring == pattern) {
//         counter++
//       }
//   }
//   return counter
// }

//  const out = binaryPattrenMatching("110", "amazing")
// console.log(out);

// function getCount(pattern, s) {
//   let Join = []
//   let i = 0
//   while ('' !== (char = s.charAt(i++))) {
//     if (/[aeiouy]/.test(char)) {
//       Join.push(0)
//     } else {
//       Join.push(1)
//     }
//   }
//   let string = Join.join('')
//   let pattern1 = pattern.length - s.length
//   let count = 0;
//   for (let i = 0; i < string.length; i++) {
//     for (let j = 0; j < pattern1.length; j++) {
//         if (pattern1[j] !== string[i+j]) {

//             break
//         }
//         if(j === pattern1.length -1) {
//             count++
//         }
//     }
// }
//   return count;
// }

// const out11 = getCount('010', 'amazing');
// console.log(out11);

const binaryPatternMatching = (pattern, string) => {
  let i = 0;
  let count = 0;
  let substring = pattern;
  string = string
    .replace(/[aeiouy]/gi, "0")
    .replace(/[bcdfghjklmnpqrstvwxz]/gi, "1");
  console.log(string);

  for (let i = 0; i < string.length; i++) {
    for (let j = 0; j < substring.length; j++) {
      if (substring[j] !== string[i + j]) {
        break;
      }
      if (j === substring.length - 1) {
        count++;
      }
    }
  }
  return count;
};

const out12 = binaryPatternMatching("010", "amazing");
console.log(out12);
