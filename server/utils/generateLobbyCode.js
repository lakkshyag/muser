export const generateLobbyCode = () => { // the lobby code logic, currently 6 letter
    return Math.random().toString(36).substr(2, 6).toUpperCase(); 
};