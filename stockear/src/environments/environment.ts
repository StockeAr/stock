// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig :{
    apiKey: "AIzaSyDlBjY4qeASTwPMHZnGL9tOg5bkHcyKCJA",
    authDomain: "stockear-123.firebaseapp.com",
    databaseURL: "https://stockear-123.firebaseio.com",
    projectId: "stockear-123",
    storageBucket: "stockear-123.appspot.com",
    messagingSenderId: "144917792861",
    appId: "1:144917792861:web:856dd83c26cc7440e6e5b4"
  },
  //API_URL:'http://localhost:3000',
  API_URL:'https://apistockear.herokuapp.com',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
