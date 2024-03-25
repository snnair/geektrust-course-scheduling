import CourseSchedulingService from "../../domain/services/CourseSchedulingService";

export default class LMSService {
    
    private _courseSchedulingService: CourseSchedulingService;
    
    constructor(courseSchedulingService: CourseSchedulingService) {
        this._courseSchedulingService = courseSchedulingService;
    }
    
    public addCourseOffering(command: string): string {
        const [ courseName, instructor, date, minNumberOfEmployees, maxAllowedEmployees ] = command.split( ' ' );
        return this._courseSchedulingService.addCourseOffering(courseName, instructor, maxAllowedEmployees, minNumberOfEmployees, date).commandLineOutput;
    }

    public register(command: string): string {
        const [ employeeEmail, courseId ] = command.split( ' ' );
        return this._courseSchedulingService.registerEmployeeForCourse(employeeEmail, courseId).commandLineOutput;
    }

    public cancelRegistration(courseRegistrationId: string): string {
        return this._courseSchedulingService.cancelEmployeeRegistrationFromCourse(courseRegistrationId).commandLineOutput;
    }
    
    public allotCourse(courseOfferingId: string): string[] {
        return this._courseSchedulingService.allotCourse(courseOfferingId).commandLineOutput;
    }
}