// Imports use relative file paths or Node.js package names
import { textInput } from './dom-utils';
// CSS IMPORT IN TS NUR ÜBER VITE MÖGLICH
import './styles/styles.css';


//THIS IS THE ENTRY FILE - WRITE YOUR MAIN LOGIC HERE

// init App
textInput.addEventListener('input', (e) => {
    //log input value
    console.log((e.target as HTMLInputElement).value);
})