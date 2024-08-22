"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = exports.messageRegistry = void 0;
exports.messageRegistry = {};
const Message = (type) => {
    return (constructor) => {
        exports.messageRegistry[type] = constructor;
    };
};
exports.Message = Message;
//# sourceMappingURL=message-decorator.js.map