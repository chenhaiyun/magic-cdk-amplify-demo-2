import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import TodoList from './components/TodoList';
import { Amplify } from 'aws-amplify';
import './App.css'

// Configure Amplify
Amplify.configure({
  Auth: {
    region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
    userPoolId: import.meta.env.VITE_USER_POOL_ID,
    userPoolWebClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID,
  },
});

function App() {
  return (
    <Authenticator>
      {({ signOut }) => (
        <div className="app">
          <header>
            <h1>Todo App</h1>
            <button onClick={signOut}>Sign Out</button>
          </header>
          <main>
            <TodoList />
          </main>
        </div>
      )}
    </Authenticator>
  )
}

export default App
