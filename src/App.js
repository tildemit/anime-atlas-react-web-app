import React from 'react';
import './App.css';
import Home from './home/Home';
import Search from './search/Search';
import Details from './details/Details';
import Signin from './users/signin';
import Account from './users/account';
import UserTable from './users/table';
import PublicUser from './users/publicuser';
import Signup from './users/signup';
import CharacterDetails from './details/CharacterDetails';
import {HashRouter} from "react-router-dom";
import {Routes, Route} from "react-router";

function App() {
  return (
    <HashRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/search/:query?" element={<Search/>}/>
          <Route path="/details/:animeId" element={<Details />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Account />} />
          <Route path="/profile/:userId" element={<PublicUser />} />
          <Route path="/users" element={<UserTable />} />
          <Route path="/characterdetails/:characterId" element={<CharacterDetails />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
