export class CourseAdditionResult {
    private _outputString: string;
    constructor(courseId: string) {
        this._outputString = courseId;
    }
    get commandLineOutput(): string {
        return this._outputString;
    }
}

export class SuccessfulCourseRegistrationResult {
    private _outputString: string;
    constructor(courseRegistrationId: string, status: string) {
        this._outputString = `${courseRegistrationId} ${status}`;
    }
    get commandLineOutput(): string {
        return this._outputString;
    }
}

export class UnsuccessfulCourseRegistrationResult {
    private _outputString: string;
    constructor(status: string) {
        this._outputString = status;
    }
    get commandLineOutput(): string {
        return this._outputString;
    }
}

export class CourseRegistrationCancellationResult {
    private _outputString: string;
    constructor(courseRegistrationId: string, courseCancellationStatus: string) {
        this._outputString = `${courseRegistrationId} ${courseCancellationStatus}`;
    }
    get commandLineOutput(): string {
        return this._outputString;
    }
}

export class CourseAllotmentResult {
    private _output: string[];
    constructor(courseAttributes: CourseAttributes, employeeAttributes: EmployeeAttributes[]) {
        this._output = employeeAttributes
                        .map(employeeAttribute => 
                            `${employeeAttribute.courseRegistrationId} ${employeeAttribute.email} ${courseAttributes.courseId} ${courseAttributes.name} ${courseAttributes.instructor} ${courseAttributes.date} ${employeeAttribute.courseAllotmentStatus}`
                        );
    }
    get commandLineOutput(): string[] {
        return this._output;
    }
}

export type CourseAttributes = {
    courseId: string;
    name: string;
    instructor: string;
    date: string;
}

export type EmployeeAttributes = {
    courseRegistrationId: string;
    email: string;
    courseAllotmentStatus: string;
}