export default class InputDataError extends Error {
    private _code: string = `INPUT_DATA_ERROR`;
    
    constructor() {
        super();
    }
    
    get code(): string {
        return this._code;
    }
}