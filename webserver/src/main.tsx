import React from 'react';
import { createRoot } from 'react-dom/client';

import MainView from './MainView';

import './main.scss';

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<MainView/>);

