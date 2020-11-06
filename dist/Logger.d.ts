declare const Log: {
    Info: (message: string) => void;
    Error: (message: string) => void;
};
declare const Logger: (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export { Logger, Log };
