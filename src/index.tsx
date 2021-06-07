import './wdyr'; // <--- first import
import React from 'react';
import ReactDOM from 'react-dom';
import './styles/tailwind.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import {
  DataBaseProvider,
  UserProvider,
  DataProvider,
  MetaProvider
} from "./contexts"
import PouchDB from 'pouchdb-browser'
import PouchDBFind from 'pouchdb-find'
import { Provider } from 'use-pouchdb'

PouchDB.plugin(PouchDBFind)
const db = new PouchDB('fieldbook')

ReactDOM.render(
  <React.StrictMode>
    <Provider pouchdb={db}>
      <DataBaseProvider>
        <MetaProvider>
          <UserProvider>
            <DataProvider>
              <App />
            </DataProvider>
          </UserProvider>
        </MetaProvider>
      </DataBaseProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
