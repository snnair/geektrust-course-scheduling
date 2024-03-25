export default class CourseId {
    private _value: string;
    
    public constructor(courseName: string, instructor: string) {
        this._value = `OFFERING-${courseName}-${instructor}`;
    }

    get value(): string {
        return this._value;
    }
}