import * as fs from 'fs';
import LMSService from '../../app/interface/LMSService';
import CourseSchedulingServiceImpl from '../../domain/services/CourseSchedulingServiceImpl';

if (process.argv.length < 3) {
    console.error('Usage: node program.js <filename>');
    process.exit(1);
}

const filename: string = process.argv[2];

fs.readFile(filename, 'utf8', (err: NodeJS.ErrnoException | null, data: string) => {
    if (err) { 
        console.error(`Error reading file: ${err}`);
        process.exit(1);
    }
    console.log(processCommands(data.split('\n')).join('\n'));
});

const processCommands = (commands: string[]): String[] => {
    const lmsService: LMSService = new LMSService(new CourseSchedulingServiceImpl());
    const output: string[] = [];
    commands.forEach(commandString => {
        const [command, ...parameters] = commandString.split(' ');
        const parametersString: string = parameters.join(' ');
        switch ( command ) {
            case 'ADD-COURSE-OFFERING':
                output.push(lmsService.addCourseOffering(parametersString));
                break;
            case 'REGISTER':
                output.push(lmsService.register(parametersString));
                break;
            case 'ALLOT':
                const allotmentCliOutput: string[] = lmsService.allotCourse(parametersString);
                allotmentCliOutput.forEach(outputString => output.push(outputString));
                break;
            case 'CANCEL':
                output.push(lmsService.cancelRegistration(parametersString));
                break;
            default:
                break;
        }
    });
    return output;
}