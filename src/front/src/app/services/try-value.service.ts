import { Injectable } from '@angular/core';
import { ITrack } from '../shared-model/Playlist.model';

@Injectable({
  providedIn: 'root',
})
export class TryValueService {
  constructor() {}

  tryValue(valueToTry: string, track: ITrack, blModeSoiree: boolean): boolean {
    if (blModeSoiree) {
      return true;
    }
    if (
      this.comparaisonSouple(valueToTry, track.name) ||
      this.comparaisonSouple(valueToTry, track.artist)
    ) {
      return true;
    } else {
      return false;
    }
  }

  comparaisonSouple(valueToTry, valueToCompare): boolean {
    if (this.hammingDistance(valueToTry, valueToCompare) <= 1) {
      return true;
    } else {
      return false;
    }
  }
  hammingDistance(valueToTry, valueToCompare): number {
    let dist = 0;
    valueToTry = valueToTry.toLowerCase();
    valueToCompare = valueToCompare.toLowerCase();
    for (
      let i = 0, j = Math.max(valueToTry.length, valueToCompare.length);
      i < j;
      i++
    ) {
      if (
        !valueToTry[i] ||
        !valueToCompare[i] ||
        valueToTry[i] !== valueToCompare[i]
      ) {
        dist++;
      }
    }
    return dist;
  }
}

// function tryValue() {
//
// }

// function comparaisonSouple(valueToTry, valueToCompare) {
//   if (hammingDistance(valueToTry, valueToCompare) <= 1) {
//     return true;
//   } else {
//     return false;
//   }
// }
// function hammingDistance(valueToTry, valueToCompare) {
//   var dist = 0;
//   valueToTry = valueToTry.toLowerCase();
//   valueToCompare = valueToCompare.toLowerCase();
//   for (
//     var i = 0, j = Math.max(valueToTry.length, valueToCompare.length);
//     i < j;
//     i++
//   ) {
//     if (
//       !valueToTry[i] ||
//       !valueToCompare[i] ||
//       valueToTry[i] !== valueToCompare[i]
//     ) {
//       dist++;
//     }
//   }
//   return dist;
// }
