import React, { useState } from 'react';

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';

import './MainView.scss';

const MainView: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string|undefined>();

  const handleLogin = () => { 
    fetch(
      'http://localhost/api/login',
      {
        method: 'POST',
        body: JSON.stringify({
          "username": username,
          "password": password
        })
      }
    ).then(response => {
      if (!response.ok) throw Error("Failed to login: " + response.statusText);
      window.location.href = '..';
    }).catch(e => {
      if (e instanceof Error) {
        setErrorMessage(e.toString());
      } else {
        setErrorMessage("unknown error during fetch...");
      }
    });
  };

  return (
    <Card className="login-form-card">
      <Card.Header>Tree Table Demo Login</Card.Header>
      <Card.Body>
        <Stack gap={2}>
          {errorMessage &&
            <Alert variant="danger">
              <pre>{errorMessage}</pre>
            </Alert>
          }
          <Form.Label>username:</Form.Label>
          <Form.Control
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <Form.Label>password:</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <Button
            className="ms-auto"
            variant="outline-primary"
            onClick={handleLogin}
          >
            <i className="bi bi-door-open"/>
            Login
          </Button>
        </Stack>
      </Card.Body>
    </Card>
  );
};

export default MainView;

