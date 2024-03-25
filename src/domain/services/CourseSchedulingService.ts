import { CourseAdditionResult, CourseAllotmentResult, CourseRegistrationCancellationResult, SuccessfulCourseRegistrationResult, UnsuccessfulCourseRegistrationResult } from "../../app/dto/cli/CliDtos";

export default interface CourseSchedulingService {
    addCourseOffering(
        courseName: string,
        instructor: string,
        maxAllowedEmployees: string,
        minNumberOfEmployees: string, 
        date: string
    ): CourseAdditionResult; 

    registerEmployeeForCourse(employeeEmail: string, courseId: string): SuccessfulCourseRegistrationResult | UnsuccessfulCourseRegistrationResult;

    cancelEmployeeRegistrationFromCourse(employeeCourseRegistrationId: string): CourseRegistrationCancellationResult;

    allotCourse(courseId: string): CourseAllotmentResult;
}