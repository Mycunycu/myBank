import dotenv from 'dotenv';
dotenv.config();

const vars = ['PORT', 'COURSES_PATH'];

export const PORT: string = process.env.PORT;
export const COURSES_PATH: string = process.env.COURSES_PATH;

export const isValidEnv = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const invalidVars = [];

    vars.forEach((_var) => {
      if (!process.env[_var]) {
        invalidVars.push(_var);
      }
    });

    if (invalidVars.length > 0) {
      console.error('Invalid Environment variables: ', invalidVars);
      reject(false);
    }

    resolve(true);
  });
};
