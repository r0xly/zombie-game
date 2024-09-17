import { App } from "uWebSockets.js";
import { Server } from "./server";

import "../../common/src/messages/message-objects";

const app = App();
const server = new Server(app, 9001);