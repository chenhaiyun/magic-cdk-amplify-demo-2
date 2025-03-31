import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import TodoList from './components/TodoList';
import { Amplify } from 'aws-amplify';
import './App.css'

// Configure Amplify
const awsConfig = {
  aws_project_region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
  aws_cognito_region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
  aws_user_pools_id: import.meta.env.VITE_USER_POOL_ID,
  aws_user_pools_web_client_id: import.meta.env.VITE_USER_POOL_CLIENT_ID,
};

Amplify.configure(awsConfig);

function App() {
  return (
    <Authenticator hideSignUp={true}>
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
