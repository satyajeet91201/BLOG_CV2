class AppError extends Error{

    constructor(message, statusCode ){
        console.log("I have been called");
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? "Error" : "Success";
        this.isOperational = true;

        Error.captureStackTrace(this , this.constructor);

    }
}

export default AppError;