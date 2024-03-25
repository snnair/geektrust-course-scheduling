import { CourseAdditionResult, CourseAllotmentResult, CourseAttributes, CourseRegistrationCancellationResult, EmployeeAttributes, SuccessfulCourseRegistrationResult, UnsuccessfulCourseRegistrationResult } from "../../app/dto/cli/CliDtos";
import Course, { CourseConfig, CourseDeregistrationStatus, CourseRegistrationStatus } from "../models/aggregate-roots/Course";
import Employee from "../models/value-objects/Employee";
import CourseSchedulingService from "./CourseSchedulingService";

export default class CourseSchedulingServiceImpl implements CourseSchedulingService {

    private _courses: Course[];

    public constructor() {
        this._courses = [];
    }

    public addCourseOffering(
        courseName: string,
        instructor: string,
        maxAllowedEmployees: string,
        minNumberOfEmployees: string, 
        date: string
    ): CourseAdditionResult {
        const courseConfig: CourseConfig = {
            courseName, 
            instructor, 
            maxAllowedEmployees: +maxAllowedEmployees, 
            minNumberOfEmployees: +minNumberOfEmployees, 
            date,
        }
        const course: Course = new Course(courseConfig);
        this._courses.push(course);
        return new CourseAdditionResult(course.id.value);
    }

    public registerEmployeeForCourse(employeeEmail: string, courseId: string): SuccessfulCourseRegistrationResult | UnsuccessfulCourseRegistrationResult {
        const employee = new Employee(employeeEmail);
        const course = this.getCourseById(courseId);
        course.register(employee);
        const employeeRegistrationStatus: CourseRegistrationStatus = course.getRegistrationStatusFor(employee);
        return employeeRegistrationStatus === CourseRegistrationStatus.ACCEPTED 
        ? new SuccessfulCourseRegistrationResult(employee.courseRegistrationId.value, employeeRegistrationStatus)
        : new UnsuccessfulCourseRegistrationResult(employeeRegistrationStatus); 
    }

    public cancelEmployeeRegistrationFromCourse(employeeCourseRegistrationId: string): CourseRegistrationCancellationResult {
        const courseName: string = employeeCourseRegistrationId.split('-').pop()!;
        const course: Course = this.getCourseByName(courseName);
        const employee: Employee = this.getEmployeeByCourseRegistrationId(employeeCourseRegistrationId, courseName);
        course.deregister(employee);
        const employeeDeregistrationStatus: CourseDeregistrationStatus = course.getDeregistrationStatusFor(employee);
        return new CourseRegistrationCancellationResult(employee.courseRegistrationId.value, employeeDeregistrationStatus);
    }

    public allotCourse(courseId: string): CourseAllotmentResult {
        const course: Course = this._courses.find(course => course.id.value === courseId)!;
        course.allot();
        const courseAttributes: CourseAttributes = {
            courseId: course.id.value,
            name: course.name,
            instructor: course.instructorName,
            date: course.startDate,
        };
        const employees: EmployeeAttributes[] = course.employees
                                                    .map((employee: Employee) => { return {courseRegistrationId: employee.courseRegistrationId.value, email: employee.email, courseAllotmentStatus: employee.courseAllotmentStatus} })
                                                    .sort(this.employeeAllotmentComparatorFn);
        return new CourseAllotmentResult(courseAttributes, employees);
    }

    private getCourseByName(name: string): Course {
        return this._courses.find(course => course.name === name)!
    }

    private getEmployeeByCourseRegistrationId(employeeCourseRegistrationId: string, courseName: string): Employee {
        const course = this.getCourseByName(courseName);
        return course.employees.find(employee => employee.courseRegistrationId.value === employeeCourseRegistrationId)!;
    }

    private getCourseById(courseOfferingId: string): Course {
        return this._courses.find(course => course.id.value === courseOfferingId)!;
    }

    private employeeAllotmentComparatorFn = (a: EmployeeAttributes, b: EmployeeAttributes) => {
        if ( a.courseRegistrationId < b.courseRegistrationId ) {
            return -1;
        } else if ( a.courseRegistrationId > b.courseRegistrationId ) {
            return 1;
        } else {
            return 0;
        }
    };
}
