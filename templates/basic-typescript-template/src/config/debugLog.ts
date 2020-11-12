import debug from "debug";
import {debugMode} from '../../env.json'
const debugLog = debug("~");

if (debugMode) {
    debugLog.enabled = true;
}

debugLog('Debug Mode On !')

export default debugLog ;