import { Injectable } from '@angular/core';
import * as elasticlunr from 'elasticlunr';
import { ITrack } from '../shared-model/Playlist.model';

@Injectable({
  providedIn: 'root',
})
export class TryValueService {
  constructor() { }

  tryValue(valueToTry: string, track: ITrack, blModeSoiree: boolean): boolean {
    if (blModeSoiree) {
      return true;
    }

    const index = elasticlunr(function () {
      this.addField('name');
      this.addField('artist');
      this.setRef('id');
    });

    const trackDoc = {
      "id": 1,
      "name": track.name,
      "artist": track.artist
    }

    index.addDoc(trackDoc);

    const searchResult = index.search(valueToTry);
    console.log(searchResult);
    // Todo séparer try titre et try artiste
    // Si morceau = + de 3 mot alors il faut + d'un mot pour réussir 
    // get array artists

    if (searchResult.length === 1 && searchResult[0].score > 0.05) {
      return true;
    }

    if (
      this.comparaisonSouple(valueToTry, track.name) ||
      this.comparaisonSouple(valueToTry, track.artist)
    ) {
      return true;
    }

    return false;
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
