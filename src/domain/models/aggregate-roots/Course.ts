import InputDataError from "../../../app/errors/InputDataError";
import CourseId from "../value-objects/CourseId";
import Employee from "../value-objects/Employee";

export default class Course {
    private _id: CourseId;

    private _config: CourseConfig;

    private _employees: Employee[];

    private _status: CourseLifecyleState;

    public constructor(config: CourseConfig) {
        if (!this.areConfigParamsValid(config)) {
            throw new InputDataError();
        }
        this._config = config;
        this._id = new CourseId(config.courseName, config.instructor);
        this._employees = [];
        this._status = CourseLifecyleState.REGISTRATION_PHASE;
    }

    get allotmentStatus(): string {
        return this._status;
    }

    get id(): CourseId {
        return this._id;
    }

    get employees(): Employee[] {
        return this._employees;
    }

    get name(): string {
        return this._config.courseName;
    }

    get instructorName(): string {
        return this._config.instructor;
    }

    get startDate(): string {
        return this._config.date;
    }
  
    public allot(): void {
        this._status = CourseLifecyleState.ALLOTED;
        const allotmentStatus: CourseAllotmentStatus = this._employees.length >= this._config.minNumberOfEmployees 
        ? CourseAllotmentStatus.CONFIRMED : CourseAllotmentStatus.COURSE_CANCELED;
        this._employees.forEach(employee => employee.updateCourseAllotmentStatus(allotmentStatus));
    }   
  
    public register(employee: Employee): void {
        if (this.isAtCapacity() || this._status === CourseLifecyleState.ALLOTED) {
            return;
        }
        employee.confirmRegistration(this._config.courseName);
        this._employees.push(employee);
    }

    public deregister(employee: Employee): void {
        if (this._status === CourseLifecyleState.ALLOTED) {
            return;
        }
        this._employees = this._employees.filter(registeredEmployee => registeredEmployee.courseRegistrationId.value !== employee.courseRegistrationId.value);
    }

    public getDeregistrationStatusFor(employee: Employee): CourseDeregistrationStatus {
        return this.employeesHas(employee) ? CourseDeregistrationStatus.CANCEL_REJECTED : CourseDeregistrationStatus.CANCEL_ACCEPTED;
    }

    public getRegistrationStatusFor(employee: Employee): CourseRegistrationStatus {
        return this.employeesHas(employee) ? CourseRegistrationStatus.ACCEPTED : CourseRegistrationStatus.COURSE_FULL_ERROR;
    }
    
    private employeesHas(employee: Employee): boolean {
        return this._employees.find(employeeInList => employee.email === employeeInList.email) ? true : false;
    }

    private isAtCapacity(): boolean {
        return this._employees.length === this._config.maxAllowedEmployees;
    }

    private areConfigParamsValid(config: CourseConfig): boolean {
        return Object
                .values(config)
                .filter(val => val === undefined || Number.isNaN(val))
                .length === 0
    }
}

enum CourseLifecyleState {
    REGISTRATION_PHASE = 'REGISTRATION_PHASE',
    ALLOTED = 'ALLOTED',
}

export enum CourseDeregistrationStatus {
    CANCEL_ACCEPTED = 'CANCEL_ACCEPTED',
    CANCEL_REJECTED = 'CANCEL_REJECTED',
}

export enum CourseRegistrationStatus {
    ACCEPTED = 'ACCEPTED',
    COURSE_FULL_ERROR = 'COURSE_FULL_ERROR',
}

export enum CourseAllotmentStatus {
    CONFIRMED = 'CONFIRMED',
    COURSE_CANCELED = 'COURSE_CANCELED',
}

export type CourseConfig = {
    courseName: string;
    instructor: string;
    maxAllowedEmployees: number;
    minNumberOfEmployees: number;
    date: string;
}
