// import { fetchTracksFromSource } from "./fetchTracksFromSource.js";
import shuffle from "lodash.shuffle"; // Fisher-Yates (or Knuth) shuffle, its good apparently, also runs in O(n);

export const getBalancedRandomizedTracks = (allTrackLists, total) => { // all track lists is an array of arrays, total is the required count
  const shuffledTrackLists = allTrackLists.map(list => shuffle([...list])); // initial shuffle;

  const result = [];
  let round = 0;

  while (result.length < total) { // the round robin selection thing 
    const sourceIndex = round % shuffledTrackLists.length;
    const sourceTracks = shuffledTrackLists[sourceIndex];

    if (sourceTracks.length === 0) {
      round++;
      continue;
    }

    const [selected, ...rest] = sourceTracks;
    result.push(selected);
    shuffledTrackLists[sourceIndex] = rest;
    round++;
  }

  return shuffle(result.slice(0, total)); // final shuffle
};