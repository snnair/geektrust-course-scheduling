import { CourseAllotmentStatus } from "../aggregate-roots/Course";
import CourseRegistrationId from "./CourseRegistrationId";

export default class Employee {
    
    private _email: string;

    private _name: string;

    private _courseRegistrationId!: CourseRegistrationId;

    private _courseAllotmentStatus!: CourseAllotmentStatus; 

    public constructor(email: string) {
        this._email = email;
        this._name = email.split('@').shift()!;
    }

    public confirmRegistration(courseName: string) {
        this._courseRegistrationId = new CourseRegistrationId(this._name, courseName);
    }

    get email(): string { 
        return this._email; 
    }

    get name(): string {
        return this._name; 
    }

    get courseRegistrationId() {
        return this._courseRegistrationId;
    }

    get courseAllotmentStatus(): CourseAllotmentStatus {
        return this._courseAllotmentStatus;
    }
    
    public updateCourseAllotmentStatus(status: CourseAllotmentStatus) {
        this._courseAllotmentStatus = status;
    }
}