export default class CourseRegistrationId {
    private _value: string;

    public constructor(employeeName: string, courseName: string) {
        this._value = `REG-COURSE-${employeeName}-${courseName}`;
    }

    public static fromValue(value: string): CourseRegistrationId {
        const [reg, course, employeeName, courseName] = value.split('-');
        return new CourseRegistrationId(employeeName, courseName);
    }

    get value(): string {
        return this._value;
    }
}