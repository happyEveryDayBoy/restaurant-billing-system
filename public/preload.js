const {contextBridge} = require('electron');
const fs = require('fs');

const returnParticipants = () => {
    if (fs.existsSync("c:/rbsD001/autoconfig.txt")) {
        let config = JSON.parse("c:/rbsD001/autoconfig.txt")
        if (config.participantsWin && fs.existsSync("c:/rbsD001/autoconfig.txt")) {
            return fs.readFileSync("c:/rbsD001/autoconfig.txt")
        }
    } else if (fs.existsSync("home/rbsD001/autoconfig.txt")) {
        let config = JSON.parse("home/rbsD001/autoconfig.txt")
        if (config.participantsWin && fs.existsSync("home/rbsD001/autoconfig.txt")) {
            return fs.readFileSync("home/rbsD001/autoconfig.txt")
        }
    }
}

contextBridge.exposeInMainWorld('api', {
    lin:(msg)=>fs.appendFileSync('/home/trackerR324/log.txt', msg),
    win:(msg)=>fs.appendFileSync('C:/trackerR324/log.txt', msg),
    part: returnParticipants(),
});